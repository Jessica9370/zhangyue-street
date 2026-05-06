import type { PhotoEntry } from "@/lib/types";
import PhotoCard from "./PhotoCard";

interface PhotoGridProps {
  photos: PhotoEntry[];
  columns?: number;
  priorityCount?: number;
}

export default function PhotoGrid({ photos, columns = 3, priorityCount = 2 }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-display tracking-wider">暂无匹配的街景记录</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${Math.min(columns, photos.length)}, 1fr)`,
      }}
    >
      {photos.map((photo, i) => (
        <PhotoCard key={photo.id} photo={photo} priority={i < priorityCount} />
      ))}
    </div>
  );
}
