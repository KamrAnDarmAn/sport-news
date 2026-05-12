import z from "zod";

export const StorySchema = z.object({
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().max(300).optional(),
  content: z.string().trim().min(20).max(50000),
  cover_image_url: z
    .string()
    .trim()
    .url()
    .max(500)
    .optional()
    .or(z.literal("")),
  sport: z.string().trim().max(50).optional(),
  type: z.enum(["news", "article"]),
});

export type Story = z.infer<typeof StorySchema>;
