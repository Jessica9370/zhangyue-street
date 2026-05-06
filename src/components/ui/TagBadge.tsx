interface TagBadgeProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}

export default function TagBadge({ label, active, onClick, color }: TagBadgeProps) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-display tracking-wider transition-all duration-300 cursor-pointer";

  const activeStyle = active
    ? `bg-${color || "cyber-blue"}/20 border border-${color || "cyber-blue"}/50 text-${color || "cyber-blue"}`
    : "bg-bg-card border border-gray-700/50 text-gray-400 hover:border-gray-500 hover:text-gray-200";

  // Inline style for dynamic colors since Tailwind JIT can't handle dynamic classnames
  const style = active
    ? {
        backgroundColor: `${color || "#00d4ff"}20`,
        borderColor: `${color || "#00d4ff"}80`,
        color: color || "#00d4ff",
      }
    : {};

  return (
    <span
      onClick={onClick}
      className={`${base} ${!active ? "bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:border-gray-500 hover:text-gray-200" : ""}`}
      style={style}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {label}
    </span>
  );
}
