"use client";

import { usePathname } from "next/navigation";

export default function ScanlineOverlay() {
  const pathname = usePathname();
  const isMap = pathname === "/map";

  if (isMap) return null;

  return (
    <>
      {/* Animated scanline bar */}
      <div
        className="fixed inset-x-0 top-0 z-[9999] pointer-events-none"
        style={{
          height: "100px",
          background: "linear-gradient(180deg, transparent, rgba(0, 212, 255, 0.03), transparent)",
          animation: "scanline 8s linear infinite",
        }}
      />
      {/* CRT vignette */}
      <div
        className="fixed inset-0 z-[9996] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </>
  );
}
