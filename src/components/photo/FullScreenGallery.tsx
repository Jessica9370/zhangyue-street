"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { PhotoEntry } from "@/lib/types";
import { useTranslation } from "@/i18n/LanguageProvider";

interface FullScreenGalleryProps {
  photos: PhotoEntry[];
  initialIndex: number;
  onClose: () => void;
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
};

export default function FullScreenGallery({ photos, initialIndex, onClose }: FullScreenGalleryProps) {
  const { t, translatePhoto } = useTranslation();
  const [[currentIndex, direction], setState] = useState([initialIndex, 0]);

  const paginate = useCallback((newDir: number) => {
    setState(([idx]) => [(idx + newDir + photos.length) % photos.length, newDir]);
  }, [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": paginate(-1); break;
        case "ArrowRight": paginate(1); break;
        case "Escape": onClose(); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paginate, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const style = document.createElement("style");
    style.id = "fullscreen-crt-hide";
    style.textContent = "body::before,body::after{display:none!important}";
    document.head.appendChild(style);
    return () => {
      document.body.style.overflow = "";
      const s = document.getElementById("fullscreen-crt-hide");
      if (s) s.remove();
    };
  }, []);

  const photo = photos[currentIndex];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col" onClick={onClose}>
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <span className="text-sm text-gray-400 font-display tracking-wider">{currentIndex + 1} / {photos.length}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl" aria-label={t("gallery.close")}>✕</button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}>
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div key={currentIndex} custom={direction} variants={variants} initial="enter" animate="center"
            exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative max-w-[90vw] max-h-[75vh] w-full h-full">
            {photo.image.src ? (
              <>
                <Image src={photo.image.src} alt={photo.image.alt} fill
                  className="object-contain select-none pointer-events-none"
                  priority sizes="90vw" draggable={false} />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-600 font-display tracking-wider">NO IMAGE</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 px-6 py-4 bg-gradient-to-t from-black/80">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h3 className="text-white font-display tracking-wider text-sm">{translatePhoto(photo, "title")}</h3>
            <p className="text-gray-400 text-xs mt-1">{photo.titleEn}</p>
          </div>
          <div className="text-right text-xs text-gray-500 font-mono">
            <p>{photo.location.district} · {photo.location.name}</p>
            <p>{photo.date}</p>
          </div>
        </div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); paginate(-1); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
          rounded-full bg-white/5 hover:bg-white/20 text-white/60 hover:text-white transition-all"
        aria-label={t("gallery.prev")}>‹</button>
      <button onClick={(e) => { e.stopPropagation(); paginate(1); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
          rounded-full bg-white/5 hover:bg-white/20 text-white/60 hover:text-white transition-all"
        aria-label={t("gallery.next")}>›</button>
    </motion.div>
  );
}
