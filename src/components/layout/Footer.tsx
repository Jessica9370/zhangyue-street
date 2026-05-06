"use client";

import { useTranslation } from "@/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative border-t border-cyber-blue/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs font-display tracking-wider">
          &copy; {new Date().getFullYear()} {t("site.name")}
        </p>
        <p className="text-gray-600 text-xs">
          {t("site.footer")}
        </p>
      </div>
    </footer>
  );
}
