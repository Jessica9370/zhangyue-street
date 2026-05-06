"use client";

import Link from "next/link";

interface NeonButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

const variants = {
  primary:
    "bg-cyber-purple text-white border-cyber-purple hover:shadow-[0_0_15px_rgba(176,38,255,0.5),0_0_30px_rgba(176,38,255,0.2)]",
  secondary:
    "bg-cyber-blue/10 text-cyber-blue border-cyber-blue/50 hover:shadow-[0_0_15px_rgba(0,212,255,0.3),0_0_30px_rgba(0,212,255,0.1)] hover:bg-cyber-blue/20",
  outline:
    "bg-transparent text-gray-300 border-gray-600 hover:border-cyber-cyan hover:text-cyber-cyan hover:shadow-[0_0_15px_rgba(0,255,200,0.2)]",
};

export default function NeonButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}: NeonButtonProps) {
  const base =
    `inline-flex items-center gap-2 px-6 py-2.5 rounded border text-sm font-display tracking-wider transition-all duration-300 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      {children}
    </button>
  );
}
