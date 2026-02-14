# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Resume Builder Pro — a React 19 + TypeScript web app for creating, customizing, and exporting resumes to PDF, with Google Gemini AI integration for content enhancement. UI is in Korean.

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build via Vite
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

Single-page React app with Vite, using local state (`useState`) and localStorage for persistence.

```
App.tsx              — Root component, owns all resume state, split-pane layout
├── components/
│   ├── Editor.tsx   — Form-based resume editing (all sections)
│   └── Preview.tsx  — Resume rendering with 3 themes (classic/modern/minimal)
├── services/
│   └── gemini.ts    — Google Gemini AI calls (gemini-3-flash-preview model)
├── types.ts         — All TypeScript interfaces (ResumeData, Experience, etc.)
└── index.tsx        — React DOM entry point
```

**Data flow:** App.tsx holds `ResumeData` state → passes down to Editor (editing callbacks) and Preview (display). Resume data persists to localStorage under key `resume-data`.

## Key Technical Details

- **Styling:** Tailwind CSS via CDN (loaded in index.html), no local CSS files
- **Icons:** Font Awesome 6.4.0 via CDN
- **Fonts:** Inter + Noto Sans KR via Google Fonts CDN
- **AI API key:** Set `GEMINI_API_KEY` in `.env.local`; injected via `vite.config.ts` define
- **Path alias:** `@/*` maps to project root (configured in both vite.config.ts and tsconfig.json)
- **Print/PDF:** Custom `@media print` styles in index.html, A4 dimensions (210mm × 297mm), `.no-print` class hides UI elements during print
