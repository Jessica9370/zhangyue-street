"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PhotoEntry } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import { useTranslation } from "@/i18n/LanguageProvider";

interface PhotoCardProps {
  photo: PhotoEntry;
  priority?: boolean;
  aspect?: "auto" | "square" | "wide";
}

export default function PhotoCard({ photo, priority = false, aspect = "auto" }: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false);
  const { translatePhoto, translateDistrict } = useTranslation();
  const title = translatePhoto(photo, "title");
  const aspectRatio = aspect === "square" ? "1/1" : aspect === "wide" ? "16/9" : `${photo.image.width}/${photo.image.height}`;

  return (
    <Link
      href={`/entry/${photo.id}`}
      className="group relative block overflow-hidden rounded-lg border border-transparent
        transition-all duration-500 ease-out
        hover:border-cyber-purple/50
        hover:shadow-[0_0_15px_rgba(176,38,255,0.3),0_0_30px_rgba(176,38,255,0.15)]
        hover:-translate-y-0.5"
      style={{ aspectRatio }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {photo.image.src ? (
        <Image
          src={photo.image.src}
          alt={photo.image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-700 ease-out select-none pointer-events-none
            group-hover:scale-105
            ${loaded ? "opacity-100 blur-0" : "opacity-80 blur-[2px]"}`}
          onLoad={() => setLoaded(true)}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-bg-card flex items-center justify-center">
          <span className="text-gray-600 text-xs font-display tracking-wider">NO IMAGE</span>
        </div>
      )}

      {!loaded && photo.image.src && (
        <div className="absolute inset-0 bg-bg-card animate-pulse" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-sm font-display tracking-wider mb-1">{title}</h3>
          <p className="text-gray-400 text-xs">
            {formatDateShort(photo.date)} · {translateDistrict(photo.location.district)}
          </p>
          {photo.locationText && (
            <p className="text-cyber-blue/60 text-[10px] mt-0.5 font-mono">
              {photo.locationText}
            </p>
          )}
        </div>
      </div>

      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyber-blue/30 group-hover:border-cyber-blue/60 transition-colors" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyber-blue/30 group-hover:border-cyber-blue/60 transition-colors" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyber-blue/30 group-hover:border-cyber-blue/60 transition-colors" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyber-blue/30 group-hover:border-cyber-blue/60 transition-colors" />
    </Link>
  );
}
