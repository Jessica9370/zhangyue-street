"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PhotoEntry } from "@/lib/types";
import DateDisplay from "@/components/ui/DateDisplay";
import LocationBadge from "@/components/ui/LocationBadge";
import NeonButton from "@/components/ui/NeonButton";
import { useTranslation } from "@/i18n/LanguageProvider";

function weatherEmoji(condition: string): string {
  const map: Record<string, string> = {
    sunny: "☀️", cloudy: "☁️", overcast: "🌥️", rainy: "🌧️",
    snowy: "❄️", foggy: "🌫️", windy: "💨", hazy: "🌤️",
  };
  return map[condition] || "";
}

interface DailyHeroProps {
  photo: PhotoEntry;
}

function getWeatherLabel(condition: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    sunny: t("weather.sunny"), cloudy: t("weather.cloudy"), overcast: t("weather.overcast"),
    rainy: t("weather.rainy"), snowy: t("weather.snowy"), foggy: t("weather.foggy"),
    windy: t("weather.windy"), hazy: t("weather.hazy"),
  };
  return map[condition] || condition;
}

export default function DailyHero({ photo }: DailyHeroProps) {
  const { t, translatePhoto, translateDistrict, locale } = useTranslation();
  const desc = translatePhoto(photo, "description");
  const { condition, temperature, aqi } = photo.weather;

  // Locale-aware location for the badge
  const badgeLocation = (() => {
    const rawStreet = photo.locationText ? photo.locationText.replace(photo.location.district, '').trim() : '';
    const districtLabel = translateDistrict(photo.location.district);
    if (locale === 'en') {
      const enStreet = photo.locationEn || rawStreet;
      return enStreet ? `${districtLabel} ${enStreet}` : districtLabel;
    }
    if (locale === 'ja') {
      const jaStreet = photo.locationJa || rawStreet;
      return jaStreet ? `${districtLabel} ${jaStreet}` : districtLabel;
    }
    return photo.locationText || districtLabel;
  })();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}>
      {photo.image.src ? (
        <Image
          src={photo.image.src}
          alt={photo.image.alt}
          fill
          className="object-cover select-none pointer-events-none"
          priority
          sizes="100vw"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-bg-card flex items-center justify-center">
          <span className="text-gray-600 text-lg font-display tracking-wider">NO IMAGE</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-bg-primary/20 to-bg-primary/50" />
      <div className="absolute inset-0 cyberpunk-grid" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 1, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-between">
            <DateDisplay dateStr={photo.date} />
            <LocationBadge
              name={badgeLocation}
            />
          </div>

          <div className="bg-bg-primary/40 backdrop-blur-sm rounded-lg border border-cyber-blue/20 px-5 py-3 w-fit mx-auto">
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed text-left">
              {desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-display tracking-wider">
            <span className="text-cyber-amber">
              {weatherEmoji(condition)} {getWeatherLabel(condition, t)} {temperature}°C
            </span>
            {aqi && (
              <span className="text-gray-400">
                {t("entry.aqi")} {aqi}
              </span>
            )}
            <span className="text-gray-500">
              📷 {photo.camera?.model || t("entry.unknownCamera")}
            </span>
          </div>

          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <NeonButton href={`/entry/${photo.id}`} variant="secondary">
              {t("home.viewDetail")}
            </NeonButton>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border border-cyber-blue/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-cyber-blue/60" />
        </div>
      </motion.div>
    </section>
  );
}
