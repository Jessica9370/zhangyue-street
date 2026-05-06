"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/LanguageProvider";

function Digit({ value, label, wide }: { value: string; label: string; wide?: boolean }) {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlipping(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlipping(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${wide ? "w-16 sm:w-20" : "w-10 sm:w-12"} h-14 sm:h-16 mx-0.5`}>
        <div
          className="w-full h-full rounded border border-cyber-blue/30 bg-bg-card flex items-center justify-center overflow-hidden"
          style={{ perspective: "200px" }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="font-mono text-xl sm:text-2xl text-cyber-blue"
              style={{ backfaceVisibility: "hidden" }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="absolute top-1/2 inset-x-0 h-[1px] bg-cyber-blue/20" />
      </div>
      <span className="text-[10px] text-gray-500 mt-1 font-display tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}

interface DateDisplayProps {
  dateStr: string;
  showWeekday?: boolean;
}

export default function DateDisplay({ dateStr, showWeekday = true }: DateDisplayProps) {
  const { t } = useTranslation();
  if (!dateStr) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-40 h-14 sm:h-16 rounded border border-cyber-blue/10 bg-bg-card flex items-center justify-center">
          <span className="text-gray-600 text-xs font-mono">--</span>
        </div>
      </div>
    );
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-40 h-14 sm:h-16 rounded border border-cyber-blue/10 bg-bg-card flex items-center justify-center">
          <span className="text-gray-600 text-xs font-mono">{dateStr}</span>
        </div>
      </div>
    );
  }
  const year = String(d.getFullYear());
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekdays = t("weekday").split(",");
  const weekday = weekdays[d.getDay()] || weekdays[0];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex items-center">
        <Digit value={year} label="" wide />
        <span className="text-cyber-purple text-xs font-display tracking-wider mt-[-1rem] mx-1">
          {t("entry.year")}
        </span>
        <span className="self-center text-cyber-blue/30 font-mono text-lg mx-0.5 mt-[-1.25rem]">.</span>
        <Digit value={month} label="" />
        <span className="self-center text-cyber-blue/30 font-mono text-lg mx-0.5 mt-[-1.25rem]">.</span>
        <Digit value={day} label="" />
      </div>
      {showWeekday && (
        <div className="mt-[-1.25rem]">
          <span className="text-xs font-display text-cyber-purple tracking-wider ml-2">
            {t("weekday").split(",")[d.getDay()]}
          </span>
        </div>
      )}
    </div>
  );
}
