# Mend app (frontend)

This folder contains the **Vite + React** application. For the full **product narrative**, market framing, user journey, feature impact, product loop, and data pipeline, see the **[repository root README](../README.md)**.

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run test         # Vitest (watch)
npx vitest run       # CI-style single run
```

## Routes (MVP)

| Path | Screen |
| ---- | ------ |
| `/` | Discovery (YourDOST mock + Mend card) |
| `/onboarding` | Consent & setup |
| `/home` | Dashboard (debrief first; **Mend Moment PRO** card above Memory Jar) |
| `/debrief` | 5-prompt debrief |
| `/brief` | Pre-session brief |
| `/pulse` | Weekly pattern pulse |
| `/moment` | Mend Moment capture (first free, then PRO) |
| `/moments` | List of Mend Moments |

## Deploy

`vercel.json` is included for SPA routing. Deploy with **root directory** = this folder (`mend-app`).

**Live production:** [https://menddeployement.vercel.app/](https://menddeployement.vercel.app/)
