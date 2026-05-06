/**
 * Feishu Bitable integration layer.
 *
 * === PUBLIC RELEASE NOTE ===
 * This file connects to a Feishu (Lark)多维表格 to fetch photo metadata.
 *
 * To use in production:
 *   1. Create a Feishu app at https://open.feishu.cn
 *   2. Add it to your Bitable as a collaborator
 *   3. Copy .env.example → .env.local and fill in the credentials
 *
 * When credentials are not configured, the app falls back to mock data
 * (src/lib/mock-data.ts) so the UI can be previewed without a real backend.
 * ==========================
 */

import { Client } from "@larksuiteoapi/node-sdk";
import { pinyin } from "pinyin-pro";
import MOCK_ENTRIES from "./mock-data";
import type { PhotoEntry, District, WeatherCondition, Season } from "./types";

const APP_ID = process.env.FEISHU_APP_ID!;
const APP_SECRET = process.env.FEISHU_APP_SECRET!;
const BASE_ID = process.env.FEISHU_BASE_ID!;
const TABLE_ID = process.env.FEISHU_TABLE_ID!;
const VIEW_ID = process.env.FEISHU_VIEW_ID;

const client = new Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
});

/**
 * Actual field names from the Feishu table (verified via API).
 * Adjust if column names change in the table.
 */
const FIELD_MAP = {
  title: "文本_CN",
  titleEn: "文本_EN",
  titleJa: "文本_JA",
  date: "日期",
  imageSrc: "图片地址",
  district: "区县",
  tags: "标签",
  weatherCondition: "天气",
  temperature: "温度",
  aqi: "空气质量",
  season: "多选（季节）",
  featured: "精选",
  cameraModel: "相机型号",
  locationField: "经纬度(手动输入）",
  // "位置" column — add to Feishu table for street-level addresses (e.g. "菊儿胡同")
  locationText: "位置",
  locationEn: "位置_EN",     // optional: pinyin (auto-generated if empty)
  locationJa: "位置_JA",     // optional: Japanese (falls back to Chinese)
  seqNo: "序号",
} as const;

const SEASON_MAP: Record<string, Season> = {
  "春": "spring", "夏": "summer", "秋": "autumn", "冬": "winter",
};

const WEATHER_MAP: Record<string, WeatherCondition> = {
  "晴": "sunny", "多云": "cloudy", "阴": "overcast",
  "雨": "rainy", "雪": "snowy", "雾": "foggy",
  "风": "windy", "霾": "hazy",
};

const DISTRICT_MAP: Record<string, string> = {
  "东城": "东城区", "西城": "西城区", "朝阳": "朝阳区", "海淀": "海淀区",
  "丰台": "丰台区", "石景山": "石景山区", "通州": "通州区", "大兴": "大兴区",
  "房山": "房山区", "门头沟": "门头沟区", "昌平": "昌平区", "顺义": "顺义区",
  "平谷": "平谷区", "怀柔": "怀柔区", "密云": "密云区", "延庆": "延庆区",
};

interface FeishuRecord {
  record_id?: string;
  fields: Record<string, any>;
}

/** Parse image URL: Feishu link field format {link, text} or plain string */
function parseImageUrl(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    return String(obj.link || obj.url || obj.src || "");
  }
  return "";
}

/** Parse coordinates from Feishu location field or "lat,lng" string */
function parseCoordinates(val: unknown): { lat: number; lng: number } {
  if (!val) return { lat: 39.91, lng: 116.4 };
  // Feishu location field object
  if (typeof val === "object") {
    const loc = (val as Record<string, unknown>).location;
    if (typeof loc === "string") {
      return parseCoordString(loc);
    }
  }
  if (typeof val === "string") {
    return parseCoordString(val);
  }
  return { lat: 39.91, lng: 116.4 };
}

function parseCoordString(s: string): { lat: number; lng: number } {
  const parts = s.split(",").map(p => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return { lat: 39.91, lng: 116.4 };
}

/** Parse location name from Feishu location field or raw string */
function parseLocationName(val: unknown): string {
  if (!val) return "";
  if (typeof val === "object") {
    return String((val as Record<string, unknown>).name || "");
  }
  return String(val);
}

/** Parse tags separated by # */
function parseTags(val: unknown): string[] {
  if (!val) return [];
  if (typeof val === "string") {
    return val.split("#").map(t => t.trim()).filter(Boolean);
  }
  return [];
}

/** Parse Feishu date value to YYYY-MM-DD */
function parseDate(val: unknown): string {
  if (!val) return "";
  // Feishu date field as object {timestamp, timezone} or {time, timezone}
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const ts = (obj.timestamp ?? obj.time) as number | undefined;
    if (typeof ts === "number") {
      return new Date(ts).toISOString().slice(0, 10);
    }
    return "";
  }
  // Feishu date field returns milliseconds
  if (typeof val === "number") {
    return new Date(val).toISOString().slice(0, 10);
  }
  return String(val).slice(0, 10);
}

function mapSeason(val: unknown): Season {
  const raw = val ? String(val).trim() : "";
  return SEASON_MAP[raw] || "spring";
}

function mapWeather(val: unknown): WeatherCondition {
  if (!val) return "sunny";
  const raw = String(val).trim();
  return WEATHER_MAP[raw] || raw as WeatherCondition;
}

function mapAQI(val: unknown): string | undefined {
  if (!val) return undefined;
  const raw = String(val).trim();
  // If it's already a Chinese label or text, return as-is
  if (isNaN(Number(raw))) return raw;
  // If numeric, convert via map (fallback for backward compatibility)
  const revMap: Record<number, string> = {
    50: "优", 100: "良", 150: "轻度污染",
    200: "中度污染", 300: "重度污染", 500: "严重污染",
  };
  return revMap[Number(raw)] || undefined;
}

function mapDistrict(val: unknown): District {
  const raw = String(val || "东城").trim();
  return (DISTRICT_MAP[raw] || raw) as District;
}

function mapFeatured(val: unknown): boolean {
  if (val === true || val === false) return val;
  const raw = String(val || "").trim().toLowerCase();
  return raw === "yes" || raw === "是" || raw === "true";
}

function recordToPhotoEntry(record: FeishuRecord): PhotoEntry | null {
  const f = record.fields;
  const imageUrl = parseImageUrl(f[FIELD_MAP.imageSrc]);
  const coords = parseCoordinates(f[FIELD_MAP.locationField]);
  const locName = parseLocationName(f[FIELD_MAP.locationField]);
  const tags = parseTags(f[FIELD_MAP.tags]);
  const dateStr = parseDate(f[FIELD_MAP.date]);
  const seqNo = String(f[FIELD_MAP.seqNo] || "");
  const id = seqNo || record.record_id || `photo-${dateStr}`;

  // Skip records without a sequence number (empty rows)
  if (!seqNo && !record.record_id) return null;

  // Build location text: district + street name from "位置" column, or fallback
  const rawLocText = String(f[FIELD_MAP.locationText] || "").trim();
  const districtFull = mapDistrict(f[FIELD_MAP.district]);
  const locationText = rawLocText
    ? `${districtFull} ${rawLocText}`
    : districtFull;

  // Auto-generate pinyin for English if no manual translation provided
  const rawLocationEn = String(f[FIELD_MAP.locationEn] || "").trim();
  const locationEn = rawLocationEn || (rawLocText ? pinyin(rawLocText, { toneType: 'none' }) : '');
  const rawLocationJa = String(f[FIELD_MAP.locationJa] || "").trim();
  const locationJa = rawLocationJa || undefined;

  return {
    id,
    locationText,
    locationEn: locationEn || undefined,
    locationJa,
    title: String(f[FIELD_MAP.title] || ""),
    titleEn: String(f[FIELD_MAP.titleEn] || ""),
    titleJa: String(f[FIELD_MAP.titleJa] || ""),
    description: String(f[FIELD_MAP.title] || ""),    // no separate description field
    descEn: String(f[FIELD_MAP.titleEn] || ""),
    descJa: String(f[FIELD_MAP.titleJa] || ""),
    date: dateStr,
    image: {
      src: imageUrl,
      width: 1600,
      height: 1200,
      alt: String(f[FIELD_MAP.title] || f[FIELD_MAP.titleEn] || ""),
    },
    location: {
      name: locName,
      district: mapDistrict(f[FIELD_MAP.district]),
      coordinates: coords,
    },
    tags,
    weather: {
      condition: mapWeather(f[FIELD_MAP.weatherCondition]),
      temperature: Number(f[FIELD_MAP.temperature]) || 20,
      aqi: mapAQI(f[FIELD_MAP.aqi]),
    },
    season: mapSeason(f[FIELD_MAP.season]),
    featured: mapFeatured(f[FIELD_MAP.featured]),
    camera: f[FIELD_MAP.cameraModel]
      ? { model: String(f[FIELD_MAP.cameraModel]), settings: "" }
      : undefined,
  };
}

export async function getAllStreetPhotos(): Promise<PhotoEntry[]> {
  // Fall back to mock data when Feishu is not configured
  if (!process.env.FEISHU_APP_ID || !process.env.FEISHU_BASE_ID) {
    console.info("[feishu] Feishu credentials not configured — using mock data");
    return MOCK_ENTRIES;
  }

  const allRecords: FeishuRecord[] = [];
  let pageToken: string | undefined;

  do {
    const response = await client.bitable.appTableRecord.list({
      params: {
        view_id: VIEW_ID,
        page_size: 500,
        page_token: pageToken,
      },
      path: {
        app_token: BASE_ID,
        table_id: TABLE_ID,
      },
    });

    const items = response.data?.items || [];
    allRecords.push(...items);
    pageToken = response.data?.page_token;
  } while (pageToken);

  return allRecords.map(recordToPhotoEntry).filter((p): p is PhotoEntry => p !== null);
}
