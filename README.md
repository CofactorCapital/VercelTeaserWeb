# Acme Test — Teaser Site

A "coming soon" teaser for Acme Test. Single scrolling page that walks
through the questions investors face — black boxes, closet indexing, fees, taxes,
risk, alpha, transparency, control — and ends on a simple question plus an email
signup.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for restrained scroll reveals + subtle parallax
- Fonts: **Schibsted Grotesk** (display/wordmark) + **IBM Plex Mono** (data/labels)

## Brand

| Token     | Hex       | Use                         |
| --------- | --------- | --------------------------- |
| Obsidian  | `#0B0E16` | Background                  |
| Porcelain | `#ECEEF3` | Primary text                |
| Azure     | `#4571F4` | Accent / interactive        |
| Vermilion | `#F06A45` | Emphasis (the "+", payoff)  |

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Content

All copy lives in [`lib/content.ts`](lib/content.ts) — edit the `SECTIONS` array
and `FAITH_LINES` there.

## Email signup

The form in [`components/SignupForm.tsx`](components/SignupForm.tsx) is **visual
only** for this pass — submit is a no-op; nothing is sent or stored. Before
production, wire `handleSubmit` to a form endpoint (Formspree / Tally were the
candidates).

## Deploy

Push to GitHub and import the repo in Vercel. No environment variables required
for the current build.
