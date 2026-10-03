export const skillGroups = [
  {
    key: "programming",
    items: ["Python", "SQL", "CUDA", "LaTeX"],
  },
  {
    key: "ml",
    items: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "XGBoost",
      "Hugging Face Transformers",
    ],
  },
  {
    key: "genai",
    items: [
      "LangChain",
      "RAG",
      "OpenAI",
      "OpenRouter",
      "Gemini",
      "Azure Document Intelligence",
      "prompt engineering",
      "real-time speech (Deepgram STT, TTS)",
    ],
  },
  {
    key: "evaluation",
    items: [
      "evaluation harnesses",
      "rubric-based LLM scoring",
      "evidence-based model and prompt selection",
      "statistical testing (Diebold Mariano, Friedman)",
      "time-series forecasting",
      "ensemble methods",
    ],
  },
  {
    key: "vision",
    items: [
      "OpenCV",
      "YOLO",
      "ArUco marker tracking",
      "real-time object detection",
    ],
  },
  {
    key: "tools",
    items: [
      "Docker",
      "Git/GitHub",
      "Linux (Ubuntu)",
      "Postgres",
      "Prisma",
      "FastAPI",
      "Streamlit",
      "React",
      "Power BI",
    ],
  },
] as const;

export type SkillGroupKey = (typeof skillGroups)[number]["key"];
