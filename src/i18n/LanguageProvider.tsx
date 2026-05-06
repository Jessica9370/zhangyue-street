"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import zh from "./zh.json";
import en from "./en.json";
import ja from "./ja.json";

export type Locale = "zh" | "en" | "ja";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translatePhoto: (photo: { title?: string; titleEn?: string; titleJa?: string; description?: string; descEn?: string; descJa?: string }, field: "title" | "description") => string;
  translateDistrict: (district: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<Locale, Record<string, unknown>> = { zh, en, ja };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (typeof current === "string") return current;
  if (Array.isArray(current)) return (current as unknown[]).join(",");
  return path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");

  const t = useCallback(
    (key: string): string => getNestedValue(translations[locale], key),
    [locale]
  );

  const translatePhoto = useCallback(
    (photo: { title?: string; titleEn?: string; titleJa?: string; description?: string; descEn?: string; descJa?: string }, field: "title" | "description") => {
      if (locale === "en") {
        if (field === "title") return (photo as Record<string, string>).titleEn || (photo as Record<string, string>).title || "";
        return (photo as Record<string, string>).descEn || (photo as Record<string, string>).description || "";
      }
      if (locale === "ja") {
        if (field === "title") return (photo as Record<string, string>).titleJa || (photo as Record<string, string>).title || "";
        return (photo as Record<string, string>).descJa || (photo as Record<string, string>).description || "";
      }
      return (photo as Record<string, string>)[field] || "";
    },
    [locale]
  );

  const translateDistrict = useCallback(
    (district: string): string => {
      const districts = getNestedValue(translations[locale] as Record<string, unknown>, "districts");
      // districts is a comma-separated string from getNestedValue
      const districtMap: Record<string, string> = {};
      // Parse from the translation files — zh has all districts as keys
      const zhDistricts = translations["zh"].districts as Record<string, string> || {};
      // For current locale, try to look up the district
      const localeDistricts = (translations[locale] as Record<string, unknown>).districts as Record<string, string> | undefined;
      if (localeDistricts && localeDistricts[district]) {
        return localeDistricts[district];
      }
      return district;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, translatePhoto, translateDistrict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
