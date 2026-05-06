"use client";

import { useTranslation } from "@/i18n/LanguageProvider";
import ContactForm from "./ContactForm";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-display tracking-wider text-white mb-2">
          <span className="text-cyber-purple">#</span> {t("nav.about")}
        </h1>
        <p className="text-gray-500 text-sm">{t("site.desc")}</p>
      </div>

      <section className="space-y-8">
        <div>
          <h2 className="text-lg font-display tracking-wider text-cyber-blue mb-3">{t("about.originTitle")}</h2>
          <p className="text-gray-300 leading-relaxed text-sm">{t("about.originDesc")}</p>
        </div>
        <div>
          <h2 className="text-lg font-display tracking-wider text-cyber-blue mb-3">{t("about.designTitle")}</h2>
          <p className="text-gray-300 leading-relaxed text-sm">{t("about.designDesc")}</p>
        </div>
        <div>
          <h2 className="text-lg font-display tracking-wider text-cyber-blue mb-3">{t("about.equipmentTitle")}</h2>
          <p className="text-gray-300 leading-relaxed text-sm">{t("about.equipmentDesc")}</p>
        </div>

        {/* 留言 */}
        <ContactForm />
      </section>
    </div>
  );
}
