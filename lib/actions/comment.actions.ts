"use server";

import { revalidatePath } from "next/cache";
import { formatDistanceToNow } from "date-fns";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateCommentSchema } from "@/lib/validations/comment-validations";
import { isAdmin } from "@/lib/authz";

export type CommentListItem = {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; fullName: string };
  timeAgo: string;
  isOwn: boolean;
};

export async function getCommentsByStoryId(storyId: string) {
  if (!storyId) {
    return { success: false as const, message: "Invalid story", comments: [] };
  }

  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const story = await prisma.story.findFirst({
      where: { id: storyId, published: true },
      select: { id: true, slug: true },
    });
    if (!story) {
      return { success: false as const, message: "Story not found", comments: [] };
    }

    const rows = await prisma.comment.findMany({
      where: { storyId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        author: { select: { id: true, fullName: true } },
      },
    });

    const comments: CommentListItem[] = rows.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: c.author,
      timeAgo: formatDistanceToNow(c.createdAt, { addSuffix: true }),
      isOwn: currentUserId === c.authorId,
    }));

    return { success: true as const, comments };
  } catch (error) {
    console.error("[getCommentsByStoryId]", error);
    return {
      success: false as const,
      message: "Could not load comments",
      comments: [],
    };
  }
}

export async function createComment(storyId: string, content: string) {
  const parsed = CreateCommentSchema.safeParse({ storyId, content });
  if (!parsed.success) {
    return { success: false as const, message: "Invalid comment" };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false as const, message: "Sign in to comment" };
    }

    const story = await prisma.story.findFirst({
      where: { id: parsed.data.storyId, published: true },
      select: { id: true, slug: true },
    });
    if (!story) {
      return { success: false as const, message: "Story not found" };
    }

    await prisma.comment.create({
      data: {
        storyId: parsed.data.storyId,
        authorId: userId,
        content: parsed.data.content,
      },
    });

    revalidatePath(`/article/${story.slug}`);
    revalidatePath(`/articles/${story.slug}`);
    revalidatePath(`/news/${story.slug}`);

    return { success: true as const, message: "Comment posted" };
  } catch (error) {
    console.error("[createComment]", error);
    return { success: false as const, message: "Could not post comment" };
  }
}

export async function deleteComment(commentId: string) {
  if (!commentId) {
    return { success: false as const, message: "Invalid comment" };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false as const, message: "Sign in required" };
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { story: { select: { slug: true } } },
    });
    if (!comment) {
      return { success: false as const, message: "Comment not found" };
    }

    const admin = isAdmin(session.user.role);
    if (comment.authorId !== userId && !admin) {
      return { success: false as const, message: "Not allowed" };
    }

    await prisma.comment.delete({ where: { id: commentId } });

    revalidatePath(`/article/${comment.story.slug}`);
    revalidatePath(`/articles/${comment.story.slug}`);
    revalidatePath(`/news/${comment.story.slug}`);

    return { success: true as const, message: "Comment removed" };
  } catch (error) {
    console.error("[deleteComment]", error);
    return { success: false as const, message: "Could not delete comment" };
  }
}
