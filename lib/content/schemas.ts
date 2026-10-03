import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const score = z.number().int().min(1).max(5);
const todo = z.string().regex(/^TODO_[A-Z0-9_]+$/);
const scoreOrTodo = z.union([score, todo]);
const linkOrTodo = z.union([z.string().url(), todo, z.literal("")]);

export const projectSchema = z
  .object({
    title: z.string().min(1),
    slug,
    date: z.string().regex(/^\d{4}(-\d{2})?$/),
    place: z.string().min(1).optional(),
    status: z.enum(["building"]).optional(),
    url: z.string().url().optional(),
    linkLabel: z.enum(["site", "github"]).optional(),
    summary: z.string().min(1),
    stats: z.array(z.string().min(1)).min(1),
    stack: z.array(z.string().min(1)).min(1),
    featured: z.number().int().positive(),
  })
  .refine((value) => !value.url || Boolean(value.linkLabel), {
    path: ["linkLabel"],
    message: "linkLabel is required when url is set",
  });

export const paperVerdicts = [
  "Must read",
  "Worth reading",
  "Skim",
  "Skip",
] as const;

export const paperSchema = z.object({
  title: z.string().min(1),
  slug,
  week: z.number().int().positive(),
  date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), todo]),
  authors: z.array(z.string().min(1)).min(1),
  venue: z.string().min(1),
  year: z.number().int(),
  paperUrl: linkOrTodo,
  codeUrl: linkOrTodo,
  topics: z.array(z.string().min(1)).min(1),
  difficulty: scoreOrTodo,
  readingTime: z.union([z.number().int().positive(), todo]),
  verdict: z.union([z.enum(paperVerdicts), todo]),
  scores: z.object({
    novelty: scoreOrTodo,
    rigor: scoreOrTodo,
    reproducibility: scoreOrTodo,
    practicalImpact: scoreOrTodo,
  }),
  tldr: z.string().min(1),
});

export const learningSchema = z.object({
  week: z.number().int().positive(),
  dateStart: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), todo]),
  dateEnd: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), todo]),
  title: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  hoursSpent: z.union([z.number().positive(), todo]),
  mood: z.string().optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
      }),
    )
    .default([]),
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;
export type PaperFrontmatter = z.infer<typeof paperSchema>;
export type LearningFrontmatter = z.infer<typeof learningSchema>;
