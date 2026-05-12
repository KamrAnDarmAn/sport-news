import z from "zod";

/** Empty string or absolute http(s) URL; optional field may be omitted. */
const coverImageField = z
  .union([z.literal(""), z.string().trim().url().max(500)])
  .optional();

export const StorySchema = z.object({
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().max(300).optional(),
  content: z.string().trim().min(20).max(50000),
  cover_image_url: coverImageField,
  sport: z.string().trim().max(50).optional(),
  type: z.enum(["news", "article"]),
  slug: z.string().trim().max(200).optional(),
  topic: z.string().trim().max(100).optional(),
  published: z.boolean().optional(),
});

export type Story = z.infer<typeof StorySchema>;

/** Client create-editor form: aligned with `StorySchema` without server-only fields. */
export const CreateStoryFormSchema = StorySchema.pick({
  title: true,
  excerpt: true,
  content: true,
  cover_image_url: true,
  sport: true,
  type: true,
});

export type CreateStoryFormValues = z.infer<typeof CreateStoryFormSchema>;

export const StoryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(12),
  published: z.boolean().optional(),
  sport: z.string().trim().optional(),
  topic: z.string().trim().optional(),
  type: z.enum(["news", "article"]).optional(),
  search: z.string().trim().optional(),
  sort: z.string().trim().optional(),
  hasNext: z.boolean().optional(),
});

export type StoryListQuery = z.infer<typeof StoryListQuerySchema>;
export type StoryListQueryInput = z.input<typeof StoryListQuerySchema>;

export const StoryUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(3).max(200).optional(),
  excerpt: z.string().trim().max(300).optional(),
  content: z.string().trim().min(20).max(50000).optional(),
  cover_image_url: coverImageField,
  sport: z.string().trim().max(50).optional(),
  topic: z.string().trim().max(100).optional(),
  type: z.enum(["news", "article"]).optional(),
  published: z.boolean().optional(),
});

export type StoryUpdate = z.infer<typeof StoryUpdateSchema>;
