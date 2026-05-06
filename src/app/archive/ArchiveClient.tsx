"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { PhotoEntry } from "@/lib/types";
import { useTranslation } from "@/i18n/LanguageProvider";
import PhotoCard from "@/components/photo/PhotoCard";
import FilterBar from "@/components/ui/FilterBar";
import TagBadge from "@/components/ui/TagBadge";
import { groupByMonth } from "@/lib/utils";

const MAIN_DISTRICTS = ["东城区", "西城区", "朝阳区", "海淀区"];
const MORE_DISTRICTS = [
  "丰台区", "石景山区", "通州区", "大兴区",
  "房山区", "门头沟区", "昌平区", "顺义区",
  "平谷区", "怀柔区", "密云区", "延庆区",
];

const SEASONS = [
  { id: "spring", labelKey: "spring" },
  { id: "summer", labelKey: "summer" },
  { id: "autumn", labelKey: "autumn" },
  { id: "winter", labelKey: "winter" },
];

type ViewMode = "grid" | "timeline";

interface ArchiveClientProps {
  allPhotos: PhotoEntry[];
}

export default function ArchiveClient({ allPhotos }: ArchiveClientProps) {
  const { t, translateDistrict } = useTranslation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [districtsOpen, setDistrictsOpen] = useState(false);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  // Auto-open if any "more" district is selected
  const hasMoreSelected = selectedTags.some((t) => MORE_DISTRICTS.includes(t));

  const mainOptions = MAIN_DISTRICTS.map((d) => ({ id: d, label: translateDistrict(d), color: "#00d4ff" }));
  const moreOptions = MORE_DISTRICTS.map((d) => ({ id: d, label: translateDistrict(d), color: "#00d4ff" }));
  const seasonOptions = SEASONS.map((s) => ({ id: s.id, label: t(`season.${s.labelKey}`), color: "#b026ff" }));

  const filtered = useMemo(() => {
    let result = allPhotos;
    if (selectedTags.length > 0) {
      result = result.filter(
        (p) =>
          selectedTags.some((t) => p.location.district === t) ||
          selectedTags.some((t) => p.season === t)
      );
    }
    return result;
  }, [allPhotos, selectedTags]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-display tracking-wider text-white mb-2">
          <span className="text-cyber-purple">#</span> {t("archive.title")}
        </h1>
        <p className="text-gray-500 text-sm">{t("archive.desc")}</p>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-display tracking-wider mr-1">{t("archive.district")}</span>
            {mainOptions.map((opt) => (
              <TagBadge
                key={opt.id}
                label={opt.label}
                active={selectedTags.includes(opt.id)}
                onClick={() => toggleTag(opt.id)}
                color={opt.color}
              />
            ))}
            <button
              onClick={() => setDistrictsOpen(!districtsOpen)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-display tracking-wider transition-all
                ${hasMoreSelected || districtsOpen
                  ? "text-cyber-amber border border-cyber-amber/30 bg-cyber-amber/10"
                  : "text-gray-500 border border-gray-700/50 hover:text-gray-300 hover:border-gray-500"
                }`}
            >
              {districtsOpen ? "▲" : "▼"} {t("archive.moreDistricts")} ({MORE_DISTRICTS.length})
            </button>
            {selectedTags.length > 0 && (
              <button onClick={() => { setSelectedTags([]); }}
                className="text-xs text-gray-500 hover:text-cyber-red transition-colors ml-2 font-display tracking-wider">
                [{t("archive.clear")}]
              </button>
            )}
          </div>
          {(districtsOpen || hasMoreSelected) && (
            <div className="flex flex-wrap items-center gap-2 pt-1 pl-2 border-l-2 border-cyber-blue/20 ml-1">
              {moreOptions.map((opt) => (
                <TagBadge
                  key={opt.id}
                  label={opt.label}
                  active={selectedTags.includes(opt.id)}
                  onClick={() => toggleTag(opt.id)}
                  color={opt.color}
                />
              ))}
            </div>
          )}
        </div>
        <FilterBar
          label={t("archive.season")}
          options={seasonOptions}
          selected={selectedTags}
          onChange={setSelectedTags}
        />
      </div>

      <div className="flex items-center gap-4 mb-8 border-b border-cyber-blue/10 pb-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`text-xs font-display tracking-wider transition-colors ${
            viewMode === "grid" ? "text-cyber-cyan" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {t("archive.gridView")}
        </button>
        <span className="text-gray-700">|</span>
        <button
          onClick={() => setViewMode("timeline")}
          className={`text-xs font-display tracking-wider transition-colors ${
            viewMode === "timeline" ? "text-cyber-cyan" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {t("archive.timelineView")}
        </button>
        <span className="text-gray-600 text-xs ml-auto">{filtered.length} {t("archive.records")}</span>
      </div>

      {viewMode === "grid" ? (
        <GridView photos={filtered} />
      ) : (
        <TimelineView photos={filtered} />
      )}
    </div>
  );
}

function GridView({ photos }: { photos: PhotoEntry[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <PhotoCard photo={photo} priority={i < 2} aspect="square" />
        </motion.div>
      ))}
    </div>
  );
}

function TimelineView({ photos }: { photos: PhotoEntry[] }) {
  const grouped = useMemo(() => groupByMonth(photos), [photos]);
  const sortedMonths = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-purple/50 via-cyber-blue/30 to-transparent" />
      <div className="space-y-10">
        {sortedMonths.map((month) => {
          const entries = grouped.get(month)!;
          return (
            <div key={month} className="relative pl-12">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-cyber-blue shadow-[0_0_8px_rgba(0,212,255,0.6)] -translate-x-1/2" />
              <h3 className="text-lg font-display tracking-wider text-cyber-blue mb-4">{month}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {entries.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} aspect="square" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
