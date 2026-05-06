"use client";

import { useMemo } from "react";
import type { PhotoEntry } from "@/lib/types";
import { useTranslation } from "@/i18n/LanguageProvider";
import DailyHero from "@/components/photo/DailyHero";
import PhotoCard from "@/components/photo/PhotoCard";
import NeonButton from "@/components/ui/NeonButton";

interface HomeClientProps {
  featured: PhotoEntry | null;
  photos: PhotoEntry[];
}

export default function HomeClient({ featured, photos }: HomeClientProps) {
  const { t } = useTranslation();
  const recent = useMemo(
    () => photos.filter((p) => p.id !== featured?.id).slice(0, 4),
    [photos, featured]
  );

  return (
    <>
      {featured && <DailyHero photo={featured} />}

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-display tracking-wider text-white">
            <span className="text-cyber-purple">#</span> {t("home.recent")}
          </h2>
          <NeonButton href="/archive" variant="outline">
            {t("home.viewAll")}
          </NeonButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recent.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} aspect="square" />
          ))}
        </div>
      </section>

    </>
  );
}
