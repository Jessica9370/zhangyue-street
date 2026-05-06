import { type PhotoEntry, type Season } from "./types";

export function getSeason(dateStr: string): Season {
  const month = new Date(dateStr).getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekday = weekdays[d.getDay()];
  return `${year}.${month}.${day} | ${weekday}`;
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function groupByMonth(photos: PhotoEntry[]): Map<string, PhotoEntry[]> {
  const map = new Map<string, PhotoEntry[]>();
  for (const p of photos) {
    const key = p.date.slice(0, 7); // "2026-04"
    const group = map.get(key) || [];
    group.push(p);
    map.set(key, group);
  }
  return map;
}

export function getDayPhotoCounts(
  photos: PhotoEntry[],
  year: number,
  month: number
): Map<number, number> {
  const map = new Map<number, number>();
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  for (const p of photos) {
    if (p.date.startsWith(prefix)) {
      const day = new Date(p.date).getDate();
      map.set(day, (map.get(day) || 0) + 1);
    }
  }
  return map;
}
