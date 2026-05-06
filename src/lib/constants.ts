export const SITE_NAME = "北京街景日更";
export const SITE_DESC = "每日一帧，记录北京的城市脉动";
export const SITE_URL = "https://your-domain.vercel.app";

export const NAV_ITEMS = [
  { label: "今日街景", href: "/" },
  { label: "往期回顾", href: "/archive" },
  { label: "关于", href: "/about" },
] as const;

export const DISTRICT_COLORS: Record<string, string> = {
  "东城区": "#b026ff",
  "西城区": "#00d4ff",
  "朝阳区": "#ff6a00",
  "海淀区": "#00ffc8",
};
