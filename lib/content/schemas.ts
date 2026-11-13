import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const score = z.number().int().min(1).max(5);
const todo = z.string().regex(/^TODO_[A-Z0-9_]+$/);
const scoreOrTodo = z.union([score, todo]);
const linkOrTodo = z.union([z.string().url(), todo, z.literal("")]);

export const projectStatuses = ["done", "building", "ongoing"] as const;

const month = z.string().regex(/^\d{4}(-\d{2})?$/);
const publicPath = z.string().regex(/^\/[\w\-./]+$/);

export const projectSchema = z
  .object({
    title: z.string().min(1),
    slug,
    /** Start, as YYYY or YYYY-MM. */
    date: month,
    /** End, as YYYY or YYYY-MM. Leave out for a single date or ongoing work. */
    end: month.optional(),
    place: z.string().min(1).optional(),
    /** done: finished work. building or ongoing: listed as an experiment. */
    status: z.enum(projectStatuses),
    role: z.string().min(1).optional(),
    url: z.string().url().optional(),
    linkLabel: z.enum(["site", "github"]).optional(),
    summary: z.string().min(1),
    /** "value label" pairs, for example "5 models compared". Only measured facts. */
    stats: z.array(z.string().min(1)).default([]),
    stack: z.array(z.string().min(1)).min(1),
    /** One real recording or screenshot of the work. Files live in /public. */
    media: z
      .object({
        type: z.enum(["video", "image"]),
        src: publicPath,
        poster: publicPath.optional(),
        alt: z.string().min(1),
        caption: z.string().min(1).optional(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        /** Short silent clips can loop. Long recordings get controls instead. */
        loop: z.boolean().default(false),
      })
      .optional(),
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
  /** Day the breakdown was published. */
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

export const nowSchema = z.object({
  title: z.string().min(1),
  updated: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), todo]),
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;
export type PaperFrontmatter = z.infer<typeof paperSchema>;
export type NowFrontmatter = z.infer<typeof nowSchema>;
