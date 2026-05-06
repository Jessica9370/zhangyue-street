"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function CyberpunkNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.archive"), href: "/archive" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="absolute inset-0 bg-bg-primary/70 backdrop-blur-md border-b border-cyber-blue/10" />
      <nav className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-lg tracking-widest text-cyber-blue hover:text-cyber-cyan transition-colors min-w-0 flex items-center gap-0"
        >
          <span className="text-cyber-purple shrink-0">&lt;</span>
          <span className="max-w-[40vw] md:max-w-none text-sm md:text-lg leading-tight">{t("site.name")}</span>
          <span className="text-cyber-purple shrink-0"> /&gt;</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-display tracking-wider transition-colors
                    ${isActive ? "text-cyber-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-[1px] bg-cyber-cyan"
                      style={{ boxShadow: "0 0 8px rgba(0, 255, 200, 0.5)" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
          <li className="ml-3">
            <LanguageSwitcher />
          </li>
        </ul>

        {/* Mobile: hamburger + lang switcher */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 group"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            <span className={`block w-6 h-[1.5px] bg-cyber-blue transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-cyber-blue transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-cyber-blue transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-bg-primary/95 backdrop-blur-lg border-b border-cyber-blue/10"
          >
            <ul className="flex flex-col py-4">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-3 font-display text-sm tracking-wider transition-colors
                      ${pathname === item.href ? "text-cyber-cyan bg-cyber-blue/5" : "text-gray-400"}`}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
