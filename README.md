# Fantasy Content Studio (Placeholder UI)

Retro trading-card vibes with a modern, Sleeper-like frame. This repo ships a complete **mocked** app UI: load a league, edit team logos (placeholders), and generate weekly posters (SVG -> PNG) — no AI yet.

## Tech
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand
- Next/Image
- JSZip (client-side ZIPs)
- Mock JSON data only

## Quickstart
```bash
npm install   # or pnpm install / yarn
npm run dev   # or pnpm dev / yarn dev
# open http://localhost:3000
```

## Deploy (Vercel)
- Push to GitHub, import to Vercel. No env vars required.
- `images.unoptimized` is set for simplicity.

## Routes
- `/` Landing → enter League ID → routes to `/dashboard?leagueId=...`
- `/dashboard` Team grid with edit/regenerate/finalize
- `/team/[id]` Editor: rotary knob (v1/v2/v3), color pickers, mascot idea
- `/complete` Confetti + "Download All Logos" ZIP
- `/content` Weekly content hub (Matchups / Recaps / Power) with per-card actions & ZIP
- `/gallery/[leagueId]/week/[n]` Public read-only page

## API
- `GET /api/league?id=` returns `data/mockLeague.json`
- `POST /api/generate-logo` → random placeholder logo URL
- `POST /api/finalize-logo` → mock OK
- `POST /api/content/generate` → returns SVG posters for current week/tab
- `GET /api/poster/[id]?homeId=&awayId=&week=` → server-rendered SVG

## Assets
- `/public/placeholders/logos` — 12 colored square PNGs
- `/public/placeholders/textures` — paper.png, foil.png
- `/public/posters/templates` — base SVG templates

## Notes
- State is in-memory via Zustand. No persistence yet.
- Fonts loaded with `next/font` (Inter, Bebas Neue, Oswald).

## Acceptance Criteria Mapping
- Landing → Dashboard works with mock League ID
- Team cards show placeholder logos + edit/regenerate/finalize
- Editor updates style/colors/mascot; finalize updates dashboard
- After all teams finalized, `/complete` shows confetti + ZIP
- `/content` renders posters; per-card actions work; ZIP builds
- `/gallery/...` lists week posters (client fetch of mock API)
- Vercel deploy succeeds without additional config
