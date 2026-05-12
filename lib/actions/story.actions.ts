"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  StorySchema,
  StoryUpdateSchema,
  StoryListQuerySchema,
  type Story,
  type StoryListQuery,
  type StoryUpdate,
} from "@/lib/validations/story-validations";

import { randomUUID } from "crypto";

interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function estimateReadTimeMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function createStory(
  input: Story,
): Promise<ActionResponse<{ id: number; slug: string }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;
    if (!userId) {
      return {
        success: false,
        message: "You must be signed in to create a story",
      };
    }

    const parsed = StorySchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid input",
        error: parsed.error,
      };
    }

    const {
      title,
      content,
      type,
      cover_image_url,
      excerpt,
      sport,
      topic,
      published,
    } = parsed.data;

    const base = slugify(title);
    const slug = base.length > 0 ? `${base}-${Date.now().toString(36)}` : randomUUID();
    const readTime = estimateReadTimeMinutes(content);

    const created = await prisma.story.create({
      data: {
        title,
        slug,
        type: type === "article" ? "ARTICLE" : "NEWS",
        excerpt,
        content,
        sport,
        topic,
        readTime,
        coverUrl: cover_image_url && cover_image_url.length > 0 ? cover_image_url : null,
        published: Boolean(published),
        authorId: userId,
      },
      select: { id: true, slug: true },
    });

    return { success: true, message: "Story created", data: created };
  } catch (error) {
    return {
      success: false,
      message: "Unexpected Error",
      error: error,
    };
  }
};

export async function getStories(
  query: StoryListQuery = {},
): Promise<
  ActionResponse<{
    items: Array<{
      id: number;
      title: string;
      slug: string;
      type: "ARTICLE" | "NEWS";
      excerpt: string;
      sport: string;
      topic: string;
      readTime: number;
      coverUrl: string | null;
      published: boolean;
      createdAt: Date;
      author: { id: number; fullName: string };
    }>;
    page: number;
    pageSize: number;
    total: number;
  }>
> {
  const parsed = StoryListQuerySchema.safeParse(query);
  if (!parsed.success) {
    return { success: false, message: "Invalid query", error: parsed.error };
  }

  const { page = 1, pageSize = 12, published, sport, topic, type, search } =
    parsed.data;

  const where = {
    ...(typeof published === "boolean" ? { published } : {}),
    ...(sport ? { sport: { equals: sport, mode: "insensitive" as const } } : {}),
    ...(topic ? { topic: { equals: topic, mode: "insensitive" as const } } : {}),
    ...(type
      ? { type: type === "article" ? ("ARTICLE" as const) : ("NEWS" as const) }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
            { sport: { contains: search, mode: "insensitive" as const } },
            { topic: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  try {
    const [total, items] = await prisma.$transaction([
      prisma.story.count({ where }),
      prisma.story.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          excerpt: true,
          sport: true,
          topic: true,
          readTime: true,
          coverUrl: true,
          published: true,
          createdAt: true,
          author: { select: { id: true, fullName: true } },
        },
      }),
    ]);

    return {
      success: true,
      message: "OK",
      data: { items, page, pageSize, total },
    };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function getStoryBySlug(
  slug: string,
): Promise<
  ActionResponse<{
    id: number;
    title: string;
    slug: string;
    type: "ARTICLE" | "NEWS";
    excerpt: string;
    content: string | null;
    sport: string;
    topic: string;
    readTime: number;
    coverUrl: string | null;
    published: boolean;
    createdAt: Date;
    author: { id: number; fullName: string };
  } | null>
> {
  if (!slug || typeof slug !== "string") {
    return { success: false, message: "Invalid slug" };
  }

  try {
    const story = await prisma.story.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        excerpt: true,
        content: true,
        sport: true,
        topic: true,
        readTime: true,
        coverUrl: true,
        published: true,
        createdAt: true,
        author: { select: { id: true, fullName: true } },
      },
    });

    return { success: true, message: "OK", data: story };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function updateStory(
  input: StoryUpdate,
): Promise<ActionResponse<{ id: number; slug: string }>> {
  const parsed = StoryUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid input", error: parsed.error };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;
    if (!userId) {
      return { success: false, message: "You must be signed in to update a story" };
    }

    const { id, ...patch } = parsed.data;

    const existing = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });
    if (!existing) return { success: false, message: "Story not found" };
    if (existing.authorId !== userId) {
      return { success: false, message: "You can only edit your own stories" };
    }

    const updated = await prisma.story.update({
      where: { id },
      data: {
        ...(patch.title ? { title: patch.title } : {}),
        ...(patch.excerpt ? { excerpt: patch.excerpt } : {}),
        ...(typeof patch.content === "string"
          ? { content: patch.content, readTime: estimateReadTimeMinutes(patch.content) }
          : {}),
        ...(patch.sport ? { sport: patch.sport } : {}),
        ...(patch.topic ? { topic: patch.topic } : {}),
        ...(patch.type
          ? { type: patch.type === "article" ? "ARTICLE" : "NEWS" }
          : {}),
        ...(typeof patch.published === "boolean" ? { published: patch.published } : {}),
        ...(typeof patch.cover_image_url !== "undefined"
          ? {
              coverUrl:
                patch.cover_image_url && patch.cover_image_url.length > 0
                  ? patch.cover_image_url
                  : null,
            }
          : {}),
      },
      select: { id: true, slug: true },
    });

    return { success: true, message: "Story updated", data: updated };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function deleteStory(
  id: number,
): Promise<ActionResponse<{ id: number }>> {
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Invalid id" };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;
    if (!userId) {
      return { success: false, message: "You must be signed in to delete a story" };
    }

    const existing = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });
    if (!existing) return { success: false, message: "Story not found" };
    if (existing.authorId !== userId) {
      return { success: false, message: "You can only delete your own stories" };
    }

    await prisma.story.delete({ where: { id } });
    return { success: true, message: "Story deleted", data: { id } };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

// Backward-compatible export (previous name used in the repo).
export const publicStory = createStory;
