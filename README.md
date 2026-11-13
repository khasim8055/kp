# Khasim Bin Saleh

Personal site of Khasim Bin Saleh, AI engineer and researcher in Berlin. English is at `/`. German UI is at `/de`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Canonical URLs, the sitemap, RSS, and Open Graph use `NEXT_PUBLIC_SITE_URL`. Until that variable is set, they use `http://localhost:3000`. The only place to change the public address is `.env.example`. The likely domain is `https://khasimsaleh.com`. Copy that file to `.env.local` when you want local builds to use the public address. `.env.local` stays on your machine.

## Checks

```bash
npm run lint
npm run build
```

Invalid MDX frontmatter fails the build. Files in `content/` that start with `_` are templates and are not published.

## Add content

1. Copy a template. Papers use `content/papers/_template.mdx`. Projects use `content/projects/_template.mdx`. The Now page is `content/now.mdx`.
2. Rename the copy and drop the leading `_`. A project filename must match its `slug`. A paper filename can differ from its `slug`.
3. Fill the frontmatter. Dates are `YYYY-MM-DD`. Leave unknown values as `TODO_` plus capitals, for example `TODO_DATE`. Scores are whole numbers from 1 to 5, or `TODO_SCORE`. A verdict is `Must read`, `Worth reading`, `Skim`, `Skip`, or `TODO_VERDICT`.
4. Write the body in English. Page chrome is translated in `messages/en.json` and `messages/de.json`. Mark prose you still want to rewrite with `{/* DRAFT: Khasim to review */}`.
5. Run `npm run lint` and `npm run build`.

Papers have no schedule. A breakdown appears on the site when its `date` is set, newest first.

### Projects

- `status` is `done` for finished work, and `building` or `ongoing` for work in progress. The site lists the two groups separately: "Completed" and "Ongoing experiments".
- `stats` are optional "value label" pairs, for example `"5 models compared"`. Only add numbers that were measured. Leave `stats` out when there is nothing to report yet.
- `media` is optional: one real recording or screenshot from `public/media/`. Set `loop: true` only for short silent clips. Long videos get player controls and load nothing until play is pressed. Encode video as H.264 MP4 so it plays in every browser.
- Use these headings in the body: Problem, Approach, Implementation, What I measured, Current status, What I learned.

## The 3D layer

Everything 3D is built without a library and switches itself off where it would hurt.

- **The world** (`components/world/`): the background on every page. A grid floor, agents that float above it and pulses of light that travel between them. `world.tsx` renders a CSS-only floor first, `world-live.tsx` loads the WebGL scene once the page is idle, `world-canvas.tsx` draws it. The camera moves forward as the page scrolls.
- **The figure** (`components/figure/`): the 3D scatter plot in the Research section and on `/research`. It is drawn twice from the same seeded data in `lib/audit-field.ts`: as a static SVG on the server, and as a WebGL layer on top. The points are illustrative and the caption says so. Do not replace them with real study data without changing the caption.
- **Cards** (`components/ui/card.tsx`, `components/ui/effects.tsx`): every `Card` tilts toward the pointer and has a glow that follows it. `Effects` also fades sections in as they scroll into view (`data-reveal`).
- **Skills sphere** (`components/sections/skill-sphere.tsx`): a turning sphere of skill names. Decoration only, the same skills are listed next to it.

Fallbacks, so nothing depends on 3D:

- No WebGL: the CSS floor and the SVG figure stay.
- Reduced motion: one still frame of the world, no typing, no tilt, no reveal animation.
- Slow device: both scenes measure their own frame rate. Under about 20 frames a second they stop for good and the static version stays (`createFrameGuard` in `lib/webgl.ts`).
- Touch devices: no tilt, and the world runs at 30 frames a second with fewer agents.

Text sits on a veil over the world (`main > section` and friends in `app/globals.css`). Reading pages use a stronger veil than card sections. If text gets hard to read, raise the percentages there.

## Removed pages

`/learning` and two old paper pages redirect to `/papers`. The list is in `next.config.ts`.

## Deploy

The drafts stay as they are for the first deploy. `khasimsaleh.com` does not resolve yet.

1. Import `https://github.com/khasim8055/kp` in Vercel. The framework is Next.js. Leave the build command as `npm run build`.
2. Do not set `NEXT_PUBLIC_SITE_URL` yet. The live site uses its `https://….vercel.app` address until the domain exists.
3. When the domain is live, change `NEXT_PUBLIC_SITE_URL` in `.env.example` if it is not `https://khasimsaleh.com`, set that same variable in the Vercel project, and redeploy. Vercel does not read `.env.example`.
4. Attach the domain in Vercel and point DNS at Vercel.
5. Open `/sitemap.xml`, `/robots.txt`, and `/rss.xml` and confirm they use the public address.
