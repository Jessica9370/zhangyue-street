"use client";

import { useState, FormEvent } from "react";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function ContactForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, submitTime: new Date().toISOString() }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        console.error("留言接口错误:", data.error);
      }
    } catch (err) {
      console.error("留言请求失败:", err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-bg-card border border-gray-700/50 rounded px-4 py-2.5 text-sm text-gray-200 " +
    "placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50 focus:shadow-[0_0_8px_rgba(0,212,255,0.15)] " +
    "transition-all duration-300 font-mono";

  return (
    <div className="bg-bg-card rounded-lg border border-cyber-blue/5 p-6">
      <h3 className="text-lg font-display tracking-wider text-cyber-blue mb-4">{t("contact.title")}</h3>

      {status === "success" ? (
        <div className="text-center py-8">
          <p className="text-cyber-cyan font-display tracking-wider mb-2">{t("contact.success")}</p>
          <p className="text-gray-500 text-xs">{t("contact.successDesc")}</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-xs text-gray-400 hover:text-cyber-blue transition-colors font-display tracking-wider"
          >
            {t("contact.writeAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t("contact.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="email"
              placeholder={t("contact.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <textarea
            placeholder={t("contact.messagePlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className={`${inputClass} resize-none`}
          />

          {status === "error" && (
            <p className="text-red-400 text-xs">{t("contact.error")}</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full sm:w-auto px-6 py-2.5 rounded border border-cyber-blue/50 text-cyber-blue text-sm
              font-display tracking-wider transition-all duration-300
              bg-cyber-blue/10 hover:bg-cyber-blue/20
              hover:shadow-[0_0_15px_rgba(0,212,255,0.3),0_0_30px_rgba(0,212,255,0.1)]
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? t("contact.sending") : t("contact.send")}
          </button>
        </form>
      )}
    </div>
  );
}
