export type SkillLevel = "production" | "project" | "studying" | "TODO";

export type Skill = {
  id: string;
  name: string;
  /** Message key under Skills.usedIn, or null when unknown. */
  usedInKey: string | null;
  level: SkillLevel;
};

export type SkillTab = {
  id: "aiml" | "llms" | "evaluation" | "vision" | "engineering";
  skills: Skill[];
};

export const skillTabs: SkillTab[] = [
  {
    id: "aiml",
    skills: [
      { id: "pytorch", name: "PyTorch", usedInKey: null, level: "TODO" },
      { id: "tensorflow", name: "TensorFlow", usedInKey: null, level: "TODO" },
      {
        id: "sklearn",
        name: "scikit-learn",
        usedInKey: "predictive",
        level: "project",
      },
      {
        id: "xgboost",
        name: "XGBoost",
        usedInKey: "predictive",
        level: "project",
      },
      {
        id: "hf",
        name: "Hugging Face Transformers",
        usedInKey: null,
        level: "TODO",
      },
    ],
  },
  {
    id: "llms",
    skills: [
      { id: "rag", name: "RAG", usedInKey: "coschool", level: "production" },
      {
        id: "gpt-guardrails",
        name: "GPT fine-tuning with guardrails",
        usedInKey: "coschool",
        level: "production",
      },
      { id: "milvus", name: "Milvus", usedInKey: "coschool", level: "production" },
      { id: "langchain", name: "LangChain", usedInKey: null, level: "TODO" },
      { id: "openai", name: "OpenAI", usedInKey: null, level: "TODO" },
      { id: "openrouter", name: "OpenRouter", usedInKey: null, level: "TODO" },
      { id: "gemini", name: "Gemini", usedInKey: null, level: "TODO" },
      {
        id: "azure-doc",
        name: "Azure Document Intelligence",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "prompting",
        name: "prompt engineering",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "speech",
        name: "real-time speech (Deepgram STT, TTS)",
        usedInKey: null,
        level: "TODO",
      },
    ],
  },
  {
    id: "evaluation",
    skills: [
      {
        id: "harnesses",
        name: "evaluation harnesses",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "rubric",
        name: "rubric-based LLM scoring",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "selection",
        name: "evidence-based model and prompt selection",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "stats",
        name: "statistical testing (Diebold Mariano, Friedman)",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "forecasting",
        name: "time-series forecasting",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "ensemble",
        name: "ensemble methods",
        usedInKey: null,
        level: "TODO",
      },
    ],
  },
  {
    id: "vision",
    skills: [
      { id: "opencv", name: "OpenCV", usedInKey: null, level: "TODO" },
      { id: "yolo", name: "YOLO", usedInKey: null, level: "TODO" },
      {
        id: "aruco",
        name: "ArUco marker tracking",
        usedInKey: null,
        level: "TODO",
      },
      {
        id: "detection",
        name: "real-time object detection",
        usedInKey: null,
        level: "TODO",
      },
      { id: "ros2", name: "ROS 2", usedInKey: "studying", level: "studying" },
      {
        id: "robotics",
        name: "Robotics",
        usedInKey: "studying",
        level: "studying",
      },
    ],
  },
  {
    id: "engineering",
    skills: [
      { id: "python", name: "Python", usedInKey: null, level: "TODO" },
      { id: "sql", name: "SQL", usedInKey: null, level: "TODO" },
      { id: "cuda", name: "CUDA", usedInKey: null, level: "TODO" },
      { id: "latex", name: "LaTeX", usedInKey: null, level: "TODO" },
      {
        id: "docker",
        name: "Docker",
        usedInKey: "predictive",
        level: "project",
      },
      {
        id: "pytest",
        name: "pytest",
        usedInKey: "predictive",
        level: "project",
      },
      { id: "git", name: "Git/GitHub", usedInKey: null, level: "TODO" },
      { id: "linux", name: "Linux (Ubuntu)", usedInKey: null, level: "TODO" },
      { id: "postgres", name: "Postgres", usedInKey: null, level: "TODO" },
      { id: "prisma", name: "Prisma", usedInKey: null, level: "TODO" },
      { id: "fastapi", name: "FastAPI", usedInKey: null, level: "TODO" },
      { id: "streamlit", name: "Streamlit", usedInKey: null, level: "TODO" },
      { id: "react", name: "React", usedInKey: null, level: "TODO" },
      { id: "powerbi", name: "Power BI", usedInKey: null, level: "TODO" },
    ],
  },
];

export const todoSkills = skillTabs.flatMap((tab) =>
  tab.skills.filter((skill) => skill.level === "TODO"),
);
