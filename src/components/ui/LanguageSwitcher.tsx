"use client";

import { useTranslation, type Locale } from "@/i18n/LanguageProvider";

const locales: { value: Locale; label: string }[] = [
  { value: "zh", label: "中" },
  { value: "en", label: "EN" },
  { value: "ja", label: "日" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-0.5 border border-gray-700/50 rounded overflow-hidden">
      {locales.map((l) => (
        <button
          key={l.value}
          onClick={() => setLocale(l.value)}
          className={`px-2 py-1 text-[11px] font-display tracking-wider transition-colors
            ${locale === l.value
              ? "bg-cyber-blue/20 text-cyber-blue"
              : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          aria-label={l.label}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
