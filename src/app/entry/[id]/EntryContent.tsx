"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import type { PhotoEntry } from "@/lib/types";
import { useTranslation } from "@/i18n/LanguageProvider";
import PhotoCard from "@/components/photo/PhotoCard";
import NeonButton from "@/components/ui/NeonButton";
import FullScreenGallery from "@/components/photo/FullScreenGallery";

function getSeasonLabel(season: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    spring: t("season.spring"), summer: t("season.summer"), autumn: t("season.autumn"), winter: t("season.winter"),
  };
  return map[season] || season;
}

interface EntryContentProps {
  photo: PhotoEntry;
  allPhotos: PhotoEntry[];
  currentIndex: number;
  related: PhotoEntry[];
}

export default function EntryContent({ photo, allPhotos, currentIndex, related }: EntryContentProps) {
  const { t, translatePhoto, translateDistrict, locale } = useTranslation();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const desc = translatePhoto(photo, "description");

  // Locale-aware location text
  const locationDetail = photo.locationText
    ? photo.locationText.replace(photo.location.district, '').trim()
    : (photo.location.name || '');
  const locationValue = (() => {
    const districtLabel = translateDistrict(photo.location.district);
    if (locale === 'en') {
      const enStreet = photo.locationEn || locationDetail;
      return enStreet ? `${districtLabel} · ${enStreet}` : districtLabel;
    }
    if (locale === 'ja') {
      const jaStreet = photo.locationJa || locationDetail;
      return jaStreet ? `${districtLabel} · ${jaStreet}` : districtLabel;
    }
    return locationDetail
      ? `${districtLabel} · ${locationDetail}`
      : districtLabel;
  })();

  // Locale-aware date formatting with translated weekday
  const formatLocalizedDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const weekdays = t("weekday").split(",");
    const weekday = weekdays[d.getDay()] || "";
    return `${year}.${month}.${day} | ${weekday}`;
  };

  const tagFiltered = useMemo(() => {
    if (!activeTag) return null;
    return allPhotos
      .filter((p) => p.id !== photo.id && p.tags.includes(activeTag))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4);
  }, [activeTag, allPhotos, photo.id]);

  const displayRelated = tagFiltered ?? related;

  return (
    <article className="max-w-5xl mx-auto px-4 py-10">
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-lg overflow-hidden border border-cyber-blue/10 mb-8"
        onContextMenu={(e) => e.preventDefault()}>
        {photo.image.src ? (
          <Image
            src={photo.image.src}
            alt={photo.image.alt}
            fill
            className="object-cover select-none pointer-events-none"
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-bg-card flex items-center justify-center">
            <span className="text-gray-600 font-display tracking-wider">NO IMAGE</span>
          </div>
        )}
      </div>

      <div className="mb-10">
        <NeonButton onClick={() => setGalleryOpen(true)} variant="secondary">
          {t("entry.fullscreen")}
        </NeonButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <MetaCard label={t("entry.date")} value={formatLocalizedDate(photo.date)} />
        <MetaCard label={t("entry.location")} value={locationValue} />
        <MetaCard label={t("entry.season")} value={getSeasonLabel(photo.season, t)} />
        {photo.camera && (
          <MetaCard label={t("entry.camera")} value={photo.camera.model} />
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-sm font-display tracking-wider text-cyber-purple mb-3">{t("entry.notes")}</h2>
        <p className="text-gray-300 leading-relaxed">{desc}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {photo.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-3 py-1 rounded-full text-xs font-display tracking-wider border transition-all
              ${activeTag === tag
                ? "bg-cyber-amber/20 border-cyber-amber/50 text-cyber-amber shadow-[0_0_8px_rgba(255,106,0,0.3)]"
                : "bg-cyber-blue/5 border-cyber-blue/20 text-cyber-blue/70 hover:bg-cyber-blue/10 hover:border-cyber-blue/40"
              }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {displayRelated.length > 0 && (
        <section className="border-t border-cyber-blue/10 pt-10">
          <h2 className="text-lg font-display tracking-wider text-white mb-6">
            <span className="text-cyber-amber">#</span> {t("entry.related")}
            {activeTag && (
              <span className="text-sm text-cyber-amber/60 ml-2">· #{activeTag}</span>
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {displayRelated.map((r) => (<PhotoCard key={r.id} photo={r} aspect="square" />))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {galleryOpen && (
          <FullScreenGallery photos={allPhotos} initialIndex={currentIndex} onClose={() => setGalleryOpen(false)} />
        )}
      </AnimatePresence>
    </article>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-card rounded-lg border border-cyber-blue/5 p-4">
      <p className="text-[10px] text-gray-500 font-display tracking-widest mb-1 uppercase">{label}</p>
      <p className="text-sm text-gray-200 font-mono">{value}</p>
    </div>
  );
}
