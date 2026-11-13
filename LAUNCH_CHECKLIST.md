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

- [ ] Home About story copy (`About.p1` to `About.p3` in `messages/en.json` and `messages/de.json`): marked `DRAFT: Khasim to review`. Facts only from the CV path (LPU IoT, patent 2023, Coschool tutor, Germany MSc, Klindok, synthetic health data thesis). Rewrite after review.
- [ ] Home Research core question copy (`ResearchHome.coreP1` to `coreP3`): marked `DRAFT: Khasim to review`. Links thesis, Klindok offline data, and agent survey/pattern work only. Rewrite after review.
- [ ] Home Skills levels in `data/skills.ts`: set `level` and `usedInKey` for every skill still marked `TODO`. Already proven and filled: RAG, GPT fine-tuning with guardrails, Milvus (production at Coschool); XGBoost, scikit-learn, pytest, Docker (project in Predictive Maintenance); ROS 2 and Robotics (studying). Pending: PyTorch, TensorFlow, Hugging Face Transformers, LangChain, OpenAI, OpenRouter, Gemini, Azure Document Intelligence, prompt engineering, real-time speech (Deepgram STT, TTS), evaluation harnesses, rubric-based LLM scoring, evidence-based model and prompt selection, statistical testing (Diebold Mariano, Friedman), time-series forecasting, ensemble methods, OpenCV, YOLO, ArUco marker tracking, real-time object detection, Python, SQL, CUDA, LaTeX, Git/GitHub, Linux (Ubuntu), Postgres, Prisma, FastAPI, Streamlit, React, Power BI.
- [ ] `data/tracks.ts`: progress for Robotics and ROS 2, Computer Vision, and German B1 is `TODO`. Fill real progress later. Do not invent percentages.

## Already handled

- Request CV opens LinkedIn. There is no CV file and no `/cv` route.
- Email is not on the site.

## Hybrid 3D redesign (November 2026)

Copy written during the redesign. Each item is marked `DRAFT: Khasim to review` in its file. Facts come from the Klindok walkthrough video, the two public GitHub repositories and the earlier site text. Nothing was estimated.

- [ ] `content/projects/klindok.mdx`: status line says "has not been deployed in a clinic". Confirm, or reword.
- [ ] `content/projects/klindok.mdx`: stack is Python, SQLCipher, GGUF models, PDF/A, pytest. SQLCipher is taken from the app's status bar in the video. Confirm it applies to both editions.
- [ ] `content/projects/ai-tutor-coschool.mdx`: the 80%, 35% and 40% figures carry the note "internal evaluation during the internship". Add the baseline for each if you have it.
- [ ] `content/projects/kiko.mdx`: short on purpose. Confirm the team is fine with the clip and the text, then add detail when there is something to show.
- [ ] `content/projects/predictive-maintenance.mdx` and `content/projects/rag-pipeline-demo.mdx`: numbers are copied from the repository READMEs.
- [ ] Home About (`About.p3`, `About.p4`), Research (`ResearchHome.question`, `coreP1`, `coreP2`) and `/research` (`ResearchPage.thesisP1` to `thesisP3`, `interests`) in both message files.
- [ ] German: new strings were written to match the existing informal voice. Read them once as a native reader would.
- [ ] `data/skills.ts`: skills still marked `TODO` now appear under "Also worked with", without a level. Set a level only where a project on the site backs it up.
- [ ] `public/profile*.jpg` are not used anywhere on the site. Delete them, or add the portrait where you want it.
