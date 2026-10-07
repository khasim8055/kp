# Launch checklist

Open items to provide or rewrite. Each phase adds a section here.

## Phase 1

- [x] Portrait: `public/profile.jpg`. Wooden wall replaced with a plain warm off-white background.
- [x] Google Scholar: removed from the site. No Scholar icon and no Scholar URL.

## Phase 2

Rewrite the case studies. Each file is marked `DRAFT: Khasim to review`.

- [x] `content/projects/klindok.mdx`: keep the current draft. Rewrite after deployment.
- [x] `content/projects/ai-tutor-coschool.mdx`: keep the current draft. Rewrite after deployment.
- [x] `content/projects/predictive-maintenance.mdx`: keep the current draft. Rewrite after deployment.

## Phase 3

- [x] `content/papers/week-01-react.mdx`: keep the current draft, including `TODO_DIAGRAM`, `TODO_RESULTS`, `TODO_QUESTIONS`, and the empty `codeUrl`. Rewrite after deployment.
- [x] `content/papers/week-02-reflexion.mdx`: keep the current draft, including every `TODO_` field and the empty `codeUrl`. Rewrite after deployment. Until Reflexion has a real date, ReAct stays paper of the week.

## Phase 4

- [x] `content/learning/week-01.mdx`: keep the current draft, including `TODO_HOURS`, `TODO_BUILT`, `TODO_CONFUSED`, and `TODO_NEXT`. Topic stays `agents`. Rewrite after deployment.

## Phase 5

- [x] `content/now.mdx`: keep the current draft. The facts are the thesis, Klindok, weekly papers, and German B1. Rewrite after deployment.

## Phase 6

- [x] Drafts stay on the site for the first deploy. Rewrite them after the site is public.
- The public address is one value: `NEXT_PUBLIC_SITE_URL` in `.env.example`. It is set to `https://khasimsaleh.com`. `khasimsaleh.com` does not resolve yet. Leave this unset on Vercel until the domain is live. A Vercel deploy uses its own `https://….vercel.app` address until then.

## Cinematic redesign

- [ ] Home About story copy (`About.p1` to `About.p3` in `messages/en.json` and `messages/de.json`): marked `DRAFT: Khasim to review`. Facts only from the CV path (LPU IoT, patent 2023, Coschool tutor, Berlin MSc, Klindok, synthetic health data thesis). Rewrite after review.
- [ ] Home Research core question copy (`ResearchHome.coreP1` to `coreP3`): marked `DRAFT: Khasim to review`. Links thesis, Klindok offline data, and agent survey/pattern work only. Rewrite after review.

## Already handled

- Request CV opens LinkedIn. There is no CV file and no `/cv` route.
- Email is not on the site.
