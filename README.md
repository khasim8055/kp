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

## The hero figure

The figure on the home page and on `/research` is drawn twice from the same seeded data in `lib/audit-field.ts`:

- `components/figure/audit-figure.tsx` renders it as a static SVG on the server. This is what loads first, and what stays without WebGL or with reduced motion.
- `components/figure/audit-canvas.tsx` is the WebGL layer. It has no dependencies, loads after the page is idle, and only runs while it is on screen.

The points are illustrative and the caption says so. Do not replace them with real study data without changing the caption.

## Removed pages

`/learning` and two old paper pages redirect to `/papers`. The list is in `next.config.ts`.

## Deploy

The drafts stay as they are for the first deploy. `khasimsaleh.com` does not resolve yet.

1. Import `https://github.com/khasim8055/kp` in Vercel. The framework is Next.js. Leave the build command as `npm run build`.
2. Do not set `NEXT_PUBLIC_SITE_URL` yet. The live site uses its `https://….vercel.app` address until the domain exists.
3. When the domain is live, change `NEXT_PUBLIC_SITE_URL` in `.env.example` if it is not `https://khasimsaleh.com`, set that same variable in the Vercel project, and redeploy. Vercel does not read `.env.example`.
4. Attach the domain in Vercel and point DNS at Vercel.
5. Open `/sitemap.xml`, `/robots.txt`, and `/rss.xml` and confirm they use the public address.
