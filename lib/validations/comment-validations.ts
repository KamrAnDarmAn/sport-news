import z from "zod";

export const CreateCommentSchema = z.object({
  storyId: z.string().uuid(),
  content: z.string().trim().min(1).max(2000),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
