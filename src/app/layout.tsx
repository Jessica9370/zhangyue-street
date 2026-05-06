import type { Metadata } from "next";
import "./globals.css";
import CyberpunkNavbar from "@/components/layout/CyberpunkNavbar";
import ScanlineOverlay from "@/components/layout/ScanlineOverlay";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { SITE_NAME, SITE_DESC } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_DESC}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESC,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <ScanlineOverlay />
          <CyberpunkNavbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
