"use client";

import { motion } from "framer-motion";

interface GlitchTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "span";
  className?: string;
  glitchOnHover?: boolean;
}

export default function GlitchText({
  children,
  as: Tag = "h1",
  className = "",
  glitchOnHover = true,
}: GlitchTextProps) {
  return (
    <Tag className={`relative inline-block ${glitchOnHover ? "group cursor-pointer" : ""} ${className}`}>
      <span className="relative z-10">{children}</span>
      {glitchOnHover && (
        <>
          <motion.span
            aria-hidden
            className="absolute inset-0 z-0 text-cyber-red opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            style={{ clipPath: "inset(20px 0 40px 0)" }}
            whileHover={{ x: 2 }}
          >
            {children}
          </motion.span>
          <motion.span
            aria-hidden
            className="absolute inset-0 z-0 text-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            style={{ clipPath: "inset(40px 0 20px 0)" }}
            whileHover={{ x: -2 }}
          >
            {children}
          </motion.span>
        </>
      )}
    </Tag>
  );
}
