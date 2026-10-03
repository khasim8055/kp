export type ExperienceItem = {
  role: string;
  org: string;
  location: string;
  start: string;
  end: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Research Assistant",
    org: "SRH Berlin University of Applied Sciences",
    location: "Berlin",
    start: "06/2026",
    end: "10/2026",
    points: [
      "Compared four 2026 industry surveys on enterprise AI agent adoption, where reported uptake ran from 17% to 65%, and traced the gap to who each survey asked, how it defined an agent, and whether a vendor ran it.",
      "Reviewed five agent design patterns (ReAct, Reflection, Planning, Tool use, Multi-agent), going back to the original ReAct and Reflexion papers, and matched them to live deployments in banking and healthcare, and to the MCP and A2A protocols.",
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "Coschool",
    location: "Hyderabad",
    start: "03/2023",
    end: "08/2023",
    points: [
      "Built and shipped a 0 to 1 AI tutor serving 1,000+ beta users.",
      "Designed evaluation pipelines to catch unsafe or off-topic outputs, and fine-tuned GPT models with guardrails, cutting incorrect or off-topic answers by 80%+ across 500+ test cases.",
      "Built a RAG pipeline that improved contextual accuracy by 35%+.",
      "Deployed semantic chunking and Milvus ingestion for 10K+ documents, cutting retrieval latency by 40%.",
    ],
  },
];

export type EducationItem = {
  school: string;
  program: string;
  location: string;
  start: string;
  end: string;
  detail: string;
};

export const education: EducationItem[] = [
  {
    school: "SRH Berlin University of Applied Sciences",
    program: "MSc Artificial Intelligence",
    location: "Berlin",
    start: "04/2025",
    end: "03/2027",
    detail:
      "Thesis (in progress): An LLM agent for assessing the utility and privacy of synthetic health data under GDPR.",
  },
  {
    school: "Lovely Professional University",
    program: "B.Tech Computer Science and Engineering",
    location: "Punjab",
    start: "10/2020",
    end: "06/2024",
    detail: "Specialisation in Internet of Things.",
  },
];
