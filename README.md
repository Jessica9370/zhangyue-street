# Photographer Zhangyue's Daily Street Photo Project

Photographer Zhangyue's Daily Street Photo Project is a cyberpunk‑styled website built with **Next.js 16** and **Tailwind CSS v4**, using **Feishu (Lark) Bitable** as a headless CMS. Born and based in Beijing, Zhangyue is a journal editor, exhibition planner, and professional photographer who shares daily street views of his hometown.

> ⚠️ **Public Release Version** — This repository contains a sanitized, example-based version of the original private project. All credentials, real photo data, and personal information have been replaced with placeholders and sample data.

---

## ✨ Features

- **Daily Hero** — Large featured photo with HUD-style date display, weather info, and location badge
- **Photo Gallery** — Full-screen gallery with keyboard navigation and slide transitions
- **Archive** — Browse all photos by district and season, with grid/timeline views
- **Multi-language** — Chinese, English, Japanese (i18n via JSON locale files)
- **CRT + Cyberpunk UI** — Scanline overlay, neon colors, glitch effects
- **ISR (Incremental Static Regeneration)** — Content updates without redeployment

## 🛠 Tech Stack

| Technology   | Purpose                            |
| ------------ | ---------------------------------- |
| Next.js 16   | React framework, ISR + SSG         |
| TypeScript   | Type safety                        |
| Tailwind CSS v4 | Styling system + custom theme   |
| Framer Motion | Animations & page transitions     |
| Feishu Bitable | Headless CMS (photo metadata)    |
| Tencent COS  | Image storage                      |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Feishu app with Bitable API access (see [Feishu Open Platform](https://open.feishu.cn))
- (Optional) A Tencent COS bucket for image storage

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your own credentials — see [Configuration](#configuration) below.

### 3. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). The site will use **mock data** if Feishu credentials are not configured, so you can preview the UI immediately.

### 4. Production build

```bash
npm run build --webpack
npm start
```

> **Windows users:** The `--webpack` flag is required because Turbopack is not fully supported on Win32.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (navbar + scanline + transitions)
│   ├── globals.css         # Cyberpunk theme, CRT effects
│   ├── page.tsx            # Homepage (ISR, revalidate: 60s)
│   ├── HomeClient.tsx      # Homepage client logic
│   ├── archive/            # Archive page (ISR)
│   ├── entry/[id]/         # Photo detail page (ISR + dynamic params)
│   └── about/              # About page
├── components/
│   ├── layout/             # CyberpunkNavbar, ScanlineOverlay, Footer
│   ├── ui/                 # GlitchText, NeonButton, DateDisplay, LocationBadge
│   └── photo/              # PhotoCard, DailyHero, FullScreenGallery
├── i18n/                   # zh/en/ja locale JSON files
└── lib/
    ├── types.ts            # PhotoEntry type definitions
    ├── feishu.ts           # Feishu API integration ← core data layer
    ├── mock-data.ts        # Sample entries for development / demo
    ├── photos.ts           # Data access layer (TTL cache 30s)
    ├── constants.ts        # Site-wide constants
    └── cos.ts              # COS cleanup utility
```

---

## 🔧 Configuration

### Feishu Bitable

This project uses Feishu (Lark)多维表格 as its data backend. The expected table schema:

| Column (Feishu)      | Required | Description                            |
| -------------------- | -------- | -------------------------------------- |
| `文本_CN`            | Yes      | Chinese title                          |
| `文本_EN`            | No       | English title                          |
| `文本_JA`            | No       | Japanese title                         |
| `日期`               | Yes      | Date                                   |
| `图片地址`           | Yes      | Image URL (COS or other)               |
| `区县`               | Yes      | Beijing district code                  |
| `位置`               | No       | Street / location name                 |
| `标签`               | Yes      | Tags separated by `#`                  |
| `天气`               | Yes      | 晴/多云/阴/雨/雪/雾/风/霾             |
| `温度`               | Yes      | Temperature (°C)                       |
| `空气质量`           | No       | 优/良/轻度污染/中度污染/重度污染/严重污染 |
| `多选（季节）`       | Yes      | 春/夏/秋/冬                            |
| `精选`               | Yes      | `Yes` = show as featured photo         |
| `相机型号`           | No       | Camera model                           |
| `序号`               | Yes      | Numeric ID (001, 002...)               |
| `位置_EN` / `位置_JA` | No      | Location translations                  |

Field mapping is defined in `src/lib/feishu.ts` (`FIELD_MAP`).

### Environment Variables

See [.env.example](.env.example) for all required variables.

---

## 🌐 ISR & Data Flow

```
Feishu Bitable ──→ lib/feishu.ts ──→ lib/photos.ts ──→ Server Components (ISR)
                         (API + mapping)   (TTL cache 30s)   │
                                                               ↓
                                                         Client Components
                                                         (props receive data)
```

- **Build time**: Feishu API fetches all records → maps to `PhotoEntry[]` → generates pages
- **Runtime**: ISR re-generates every 60s; TTL cache (30s) ensures fresh data
- **New entries**: `dynamicParams: true` allows on-demand page generation for new IDs

---

## 📄 License

This project is provided for educational and portfolio purposes.
