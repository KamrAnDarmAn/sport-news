"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { Prisma } from "@/generated/prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canPublish } from "@/lib/authz";
import {
  StorySchema,
  StoryListQuerySchema,
  StoryUpdateSchema,
  type Story,
  type StoryListQueryInput,
  type StoryUpdate,
} from "@/lib/validations/story-validations";
import { redirect } from "next/navigation";

interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
  hasNext?: boolean;
}

export type StoryAuthorPreview = { id: string; fullName: string };

export type StoryListItem = {
  id: string;
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
  author: StoryAuthorPreview;
};

export type StoryDetail = StoryListItem & {
  content: string | null;
};

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

function uniqueSlug(base: string) {
  const prefix = base.length > 0 ? base : "story";
  return `${prefix}-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
}

export async function createStory(
  input: Story,
): Promise<ActionResponse<{ id: string; slug: string }>> {
  try {
    console.log("LOG - 1", input);
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || typeof userId !== "string") {
      return {
        success: false,
        message: "You must be signed in to create a story",
      };
    }

    if (!canPublish(session.user.role)) {
      return {
        success: false,
        message: "You do not have permission to publish stories",
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

    console.log("LOG - 2", parsed.data);
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
    const slug = uniqueSlug(base);
    const readTime = estimateReadTimeMinutes(content);

    console.log("LOG - 3", { base, slug, readTime });
    const excerptDb = excerpt?.trim() ?? "";
    const sportDb = sport?.trim() ? sport.trim() : "General";
    const topicDb = topic?.trim() ? topic.trim() : "general";
    const coverUrl =
      cover_image_url && cover_image_url.length > 0 ? cover_image_url : null;

    try {
      const created = await prisma.story.create({
        data: {
          title,
          slug,
          type: type === "article" ? "ARTICLE" : "NEWS",
          excerpt: excerptDb,
          content,
          sport: sportDb,
          topic: topicDb,
          readTime,
          coverUrl,
          published: Boolean(published),
          authorId: userId,
        },
        select: { id: true, slug: true },
      });
      console.log("LOG - 4", created);

      revalidatePath("/dashboard");
      revalidatePath("/news");

      return { success: true, message: "Story created", data: created };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          success: false,
          message: "Could not save: duplicate slug. Try again.",
          error,
        };
      }
      throw error;
    }
  } catch (error) {
    return {
      success: false,
      message: "Unexpected Error",
      error,
    };
  }
}

export async function getStories(query: StoryListQueryInput = {}): Promise<
  ActionResponse<{
    items: StoryListItem[];
    page: number;
    pageSize: number;
    hasNext?: boolean;
    total: number;
  }>
> {
  const parsed = StoryListQuerySchema.safeParse(query);
  if (!parsed.success) {
    return { success: false, message: "Invalid query", error: parsed.error };
  }

  const { page, pageSize, published, sport, topic, type, search } = parsed.data;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Prisma.StoryWhereInput = {
    ...(typeof published === "boolean" ? { published } : {}),
    ...(sport
      ? { sport: { equals: sport, mode: "insensitive" as const } }
      : {}),
    ...(topic
      ? { topic: { equals: topic, mode: "insensitive" as const } }
      : {}),
    ...(type ? { type: type === "article" ? "ARTICLE" : "NEWS" } : {}),
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
    const [total, rows] = await prisma.$transaction([
      prisma.story.count({ where }),
      prisma.story.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take,
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

    const items: StoryListItem[] = rows.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      type: s.type,
      excerpt: s.excerpt,
      sport: s.sport,
      topic: s.topic,
      readTime: s.readTime,
      coverUrl: s.coverUrl,
      published: s.published,
      tag: s.topic, // tag
      createdAt: s.createdAt,
      author: s.author,
      // TODO design this format for time:  (2 min ago, 3 hr ago)
      time: new Date(s.createdAt.getHours()).toString(),
    }));

    return {
      success: true,
      message: "OK",
      data: { items, page, pageSize, total },
      error: null,
      hasNext: total > skip + rows.length,
    };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function getStoriesForCategories(
  query: StoryListQueryInput = {},
): Promise<
  ActionResponse<{
    items: StoryListItem[];
    page: number;
    pageSize: number;
    total: number;
  }>
> {
  const parsed = StoryListQuerySchema.safeParse(query);
  if (!parsed.success) {
    return { success: false, message: "Invalid query", error: parsed.error };
  }

  const { page, pageSize, published, sport, topic, type, search } = parsed.data;

  const where: Prisma.StoryWhereInput = {
    ...(typeof published === "boolean" ? { published } : {}),
    ...(sport
      ? { sport: { equals: sport, mode: "insensitive" as const } }
      : {}),
    ...(topic
      ? { topic: { equals: topic, mode: "insensitive" as const } }
      : {}),
    ...(type ? { type: type === "article" ? "ARTICLE" : "NEWS" } : {}),
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
    const [total, rows] = await prisma.$transaction([
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

    const items: StoryListItem[] = rows.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      type: s.type,
      excerpt: s.excerpt,
      sport: s.sport,
      topic: s.topic,
      readTime: s.readTime,
      coverUrl: s.coverUrl,
      published: s.published,
      tag: s.topic, // tag
      createdAt: s.createdAt,
      author: s.author,
      // TODO design this format for time:  (2 min ago, 3 hr ago)
      time: new Date(s.createdAt.getHours()).toString(),
    }));

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
): Promise<ActionResponse<StoryDetail | null>> {
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
        author: {
          select: { id: true, fullName: true, email: true, role: true },
        },
      },
    });

    if (!story) {
      return { success: true, message: "OK", data: null };
    }

    const data: StoryDetail = {
      id: story.id,
      title: story.title,
      slug: story.slug,
      type: story.type,
      excerpt: story.excerpt,
      content: story.content,
      sport: story.sport,
      topic: story.topic,
      readTime: story.readTime,
      coverUrl: story.coverUrl,
      published: story.published,
      createdAt: story.createdAt,
      author: story.author,
    };

    return { success: true, message: "OK", data };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function updateStory(
  input: StoryUpdate,
): Promise<ActionResponse<{ id: string; slug: string }>> {
  const parsed = StoryUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid input", error: parsed.error };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || typeof userId !== "string") {
      return {
        success: false,
        message: "You must be signed in to update a story",
      };
    }

    if (!canPublish(session.user.role)) {
      return {
        success: false,
        message: "You do not have permission to edit stories",
      };
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

    const data: Prisma.StoryUpdateInput = {};

    if (patch.title !== undefined) data.title = patch.title;
    if (patch.excerpt !== undefined) data.excerpt = patch.excerpt;
    if (patch.content !== undefined) {
      data.content = patch.content;
      data.readTime = estimateReadTimeMinutes(patch.content);
    }
    if (patch.sport !== undefined) data.sport = patch.sport;
    if (patch.topic !== undefined) data.topic = patch.topic;
    if (patch.type !== undefined) {
      data.type = patch.type === "article" ? "ARTICLE" : "NEWS";
    }
    if (patch.published !== undefined) data.published = patch.published;
    if (patch.cover_image_url !== undefined) {
      data.coverUrl =
        patch.cover_image_url && patch.cover_image_url.length > 0
          ? patch.cover_image_url
          : null;
    }

    if (Object.keys(data).length === 0) {
      return { success: false, message: "Nothing to update" };
    }

    const updated = await prisma.story.update({
      where: { id },
      data,
      select: { id: true, slug: true },
    });

    revalidatePath("/dashboard");
    revalidatePath("/news");
    revalidatePath(`/article/${updated.slug}`);

    return { success: true, message: "Story updated", data: updated };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function deleteStory(
  id: string,
): Promise<ActionResponse<{ id: string }>> {
  if (!id || typeof id !== "string") {
    return { success: false, message: "Invalid id" };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || typeof userId !== "string") {
      return {
        success: false,
        message: "You must be signed in to delete a story",
      };
    }

    if (!canPublish(session.user.role)) {
      return {
        success: false,
        message: "You do not have permission to delete stories",
      };
    }

    const existing = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true, slug: true },
    });
    if (!existing) return { success: false, message: "Story not found" };
    if (existing.authorId !== userId) {
      return {
        success: false,
        message: "You can only delete your own stories",
      };
    }

    await prisma.story.delete({ where: { id } });

    revalidatePath("/dashboard");
    revalidatePath("/news");
    revalidatePath(`/article/${existing.slug}`);

    return { success: true, message: "Story deleted", data: { id } };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

/** @deprecated Use `createStory` */
export const publicStory = createStory;
