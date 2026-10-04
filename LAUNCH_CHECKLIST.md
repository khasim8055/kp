# Launch checklist

Open items to provide or rewrite. Each phase adds a section here.

## Phase 1

- Portrait: replace `public/profile.svg` when you have a photo.
- Google Scholar: `data/profile.ts` still has `TODO_SCHOLAR_URL`. The icon stays a placeholder until that is a real URL.

## Phase 2

Rewrite the case studies. Each file is marked `DRAFT: Khasim to review`.

- `content/projects/klindok.mdx`
- `content/projects/ai-tutor-coschool.mdx`
- `content/projects/predictive-maintenance.mdx`

## Phase 3

`content/papers/week-01-react.mdx` is marked DRAFT. Still open:

- `TODO_DIAGRAM`
- `TODO_RESULTS` (benchmark numbers)
- `TODO_QUESTIONS`
- `TODO_CODE_URL` (`codeUrl` is empty)

`content/papers/week-02-reflexion.mdx` is marked DRAFT. Still open:

- `TODO_DATE`
- `TODO_VENUE`
- `TODO_PAPER_URL`
- `TODO_DIFFICULTY`
- `TODO_READING_TIME`
- `TODO_VERDICT`
- `TODO_SCORE` on novelty, rigor, reproducibility, and practical impact
- `TODO_TLDR`
- `TODO_PROBLEM`, `TODO_METHOD`, `TODO_BENCHMARK`, `TODO_RESULT`, `TODO_QUESTIONS`, `TODO_USE`, `TODO_REPRODUCE`
- `codeUrl` is empty

Until Reflexion has a real date, ReAct stays paper of the week.

## Phase 4

`content/learning/week-01.mdx` is marked DRAFT. Still open:

- `TODO_HOURS` (the heatmap can only show that the week exists until this is a number)
- `TODO_BUILT`, `TODO_CONFUSED`, `TODO_NEXT`
- Topic tag is `agents`. Change it if you want a different topic cloud.
- Mood and links are optional. Add them in the frontmatter if you want them on the week.

## Phase 5

- Rewrite `content/now.mdx`. It is marked DRAFT. The facts are the thesis, Klindok, weekly papers, and German B1.

## Phase 6

- Do not deploy until the drafts above are rewritten.
- The public address is one value: `NEXT_PUBLIC_SITE_URL` in `.env.example`. It is set to `https://khasimsaleh.com`. Change that line if the domain is different, then set the same variable on Vercel. Until then, local RSS, sitemap, and OG links stay on `http://localhost:3000`.

## Already handled

- Request CV opens LinkedIn. There is no CV file and no `/cv` route.
- Email is not on the site.
