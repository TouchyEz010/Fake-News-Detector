# Fake News Detector (MVP v2)
Next.js + TypeScript + NewsAPI demo that searches for articles and applies basic heuristics to estimate misinformation risk.
Supports **direct URL analysis** (paste a link) in addition to NewsAPI search.

## Features
- Search via NewsAPI (`/api/search` proxy, keeps your key server-side)
- **NEW:** Paste a URL (http/https) -> `/api/analyze-url` fetches the page and extracts OpenGraph/meta
- Heuristic scoring:
  - Source reputation (trusted/low-trust lists)
  - Clickbait features (phrases, exclamation count, ALL-CAPS ratio)
  - Sensational wording in description
- Risk band: Low / Medium / High + signal explanations

## Getting Started
1. Create `.env.local`:
   ```bash
   NEWSAPI_KEY=your-newsapi-key
   ```
   (URL analysis does not require this key, but NewsAPI search does.)
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3001

## Notes
- Some sites block bots or require JS; the URL analyzer extracts what is available.
- Update `lib/credibility.ts` to customize domain lists and scoring.
- Add caching/rate limits for production.
