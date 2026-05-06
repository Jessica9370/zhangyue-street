export type District =
  | "东城区" | "西城区" | "朝阳区" | "海淀区"
  | "丰台区" | "石景山区" | "通州区" | "大兴区"
  | "房山区" | "门头沟区" | "昌平区" | "顺义区"
  | "平谷区" | "怀柔区" | "密云区" | "延庆区";

export type WeatherCondition =
  | "sunny" | "cloudy" | "overcast" | "rainy"
  | "snowy" | "foggy" | "windy" | "hazy";

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface PhotoEntry {
  id: string;
  title: string;
  titleEn: string;
  titleJa?: string;
  description: string;
  descEn?: string;
  descJa?: string;
  date: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
  location: {
    name: string;
    district: District;
    coordinates: { lat: number; lng: number };
  };
  locationText: string;
  locationEn?: string;
  locationJa?: string;
  tags: string[];
  weather: { condition: WeatherCondition; temperature: number; aqi?: string };
  season: Season;
  featured: boolean;
  camera?: { model: string; settings: string };
}

export interface TagDefinition {
  id: string;
  label: string;
  category: "district" | "weather" | "season" | "subject";
}
