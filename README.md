# Khasim Bin Saleh

Personal site for an AI/ML engineer in Berlin. English is at `/`. German UI is at `/de`.

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

1. Copy a template. Papers use `content/papers/_template.mdx`. The learning log uses `content/learning/_template.mdx`. Projects use `content/projects/_template.mdx`. The Now page is `content/now.mdx`.
2. Rename the copy and drop the leading `_`. A project filename must match its `slug`. A paper filename can differ from its `slug`, as in `week-03-some-paper.mdx`. A learning filename is the URL, so `week-03.mdx` is `/learning/week-03`, and `week` in the frontmatter must be `3`.
3. Fill the frontmatter. Dates are `YYYY-MM-DD`. Leave unknown values as `TODO_` plus capitals, for example `TODO_HOURS`. Scores are whole numbers from 1 to 5, or `TODO_SCORE`. A verdict is `Must read`, `Worth reading`, `Skim`, `Skip`, or `TODO_VERDICT`.
4. Write the body in English. Page chrome is translated in `messages/en.json` and `messages/de.json`. Mark prose you still want to rewrite with `{/* DRAFT: Khasim to review */}`.
5. Run `npm run lint` and `npm run build`.

## Deploy

Do not deploy yet. Drafts listed in `LAUNCH_CHECKLIST.md` are still open, and the domain is not live.

When those drafts are done:

1. If the domain is not `https://khasimsaleh.com`, change `NEXT_PUBLIC_SITE_URL` in `.env.example`.
2. Import `https://github.com/khasim8055/kp` in Vercel. The framework is Next.js. Leave the build command as `npm run build`.
3. In the Vercel project settings, set `NEXT_PUBLIC_SITE_URL` to the same value. Vercel does not read `.env.example`.
4. Deploy, then attach the domain in Vercel and point DNS at Vercel.
5. Open `/sitemap.xml`, `/robots.txt`, and `/rss.xml` and confirm they use the public address.
