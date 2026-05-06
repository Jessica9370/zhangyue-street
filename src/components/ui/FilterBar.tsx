"use client";

import { useMemo } from "react";
import TagBadge from "./TagBadge";

interface FilterOption {
  id: string;
  label: string;
  color?: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
}

export default function FilterBar({ options, selected, onChange, label }: FilterBarProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="text-xs text-gray-500 font-display tracking-wider mr-1">{label}</span>}
      {options.map((opt) => (
        <TagBadge
          key={opt.id}
          label={opt.label}
          active={selected.includes(opt.id)}
          onClick={() => toggle(opt.id)}
          color={opt.color}
        />
      ))}
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs text-gray-500 hover:text-cyber-red transition-colors ml-2 font-display tracking-wider"
        >
          [清除]
        </button>
      )}
    </div>
  );
}
