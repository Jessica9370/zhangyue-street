"use client";

interface LocationBadgeProps {
  name: string;
}

export default function LocationBadge({ name }: LocationBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm font-display tracking-wider text-cyber-blue">
        📍 {name}
      </span>
    </div>
  );
}
