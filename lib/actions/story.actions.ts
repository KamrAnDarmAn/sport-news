"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { formatDistanceToNow } from "date-fns";
import { Prisma } from "@/generated/prisma/client";
import type { Role } from "@/generated/prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canPublish, isAdmin } from "@/lib/authz";
import {
  StorySchema,
  StoryListQuerySchema,
  StoryUpdateSchema,
  type Story,
  type StoryListQueryInput,
  type StoryUpdate,
} from "@/lib/validations/story-validations";

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
  scheduledPublishAt: Date | null;
  inReview: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: StoryAuthorPreview;
  /** Display: relative created time */
  timeAgo: string;
  /** Display: topic label */
  tag: string;
  commentCount: number;
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

async function releaseDueScheduledStories() {
  await prisma.story.updateMany({
    where: {
      published: false,
      scheduledPublishAt: { not: null, lte: new Date() },
    },
    data: {
      published: true,
      scheduledPublishAt: null,
      inReview: false,
    },
  });
}

function deriveEditorialStatus(r: {
  published: boolean;
  scheduledPublishAt: Date | null;
  inReview: boolean;
}): "draft" | "review" | "scheduled" | "published" {
  if (r.published) return "published";
  if (r.scheduledPublishAt && r.scheduledPublishAt > new Date())
    return "scheduled";
  if (r.inReview) return "review";
  return "draft";
}

function revalidateStorySlug(slug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/news");
  revalidatePath("/editorial");
  revalidatePath(`/article/${slug}`);
}

function ensureEditor(session: { user?: { id?: string; role?: Role } } | null) {
  const userId = session?.user?.id;
  if (!userId || typeof userId !== "string") return { ok: false as const, userId: null };
  if (!canPublish(session?.user?.role)) return { ok: false as const, userId: null };
  return { ok: true as const, userId };
}

export async function createStory(
  input: Story,
): Promise<ActionResponse<{ id: string; slug: string }>> {
  try {
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

    const {
      title,
      content,
      type,
      cover_image_url,
      excerpt,
      sport,
      topic,
      published,
      scheduled_publish_at,
      in_review,
    } = parsed.data;

    const base = slugify(title);
    const slug = uniqueSlug(base);
    const readTime = estimateReadTimeMinutes(content);

    const excerptDb = excerpt?.trim() ?? "";
    const sportDb = sport?.trim() ? sport.trim() : "General";
    const topicDb = topic?.trim() ? topic.trim() : "general";
    const coverUrl =
      cover_image_url && cover_image_url.length > 0 ? cover_image_url : null;

    let scheduledAt: Date | null = null;
    if (scheduled_publish_at && scheduled_publish_at.length > 0) {
      const d = new Date(scheduled_publish_at);
      if (!Number.isNaN(d.getTime())) scheduledAt = d;
    }
    const now = new Date();
    const isFutureSchedule = scheduledAt !== null && scheduledAt > now;
    const publishedDb =
      Boolean(published) && !isFutureSchedule && !(in_review === true);

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
          published: publishedDb,
          scheduledPublishAt: isFutureSchedule ? scheduledAt : null,
          inReview: in_review === true && !publishedDb,
          authorId: userId,
        },
        select: { id: true, slug: true },
      });
      revalidateStorySlug(created.slug);

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

  const { page, pageSize, published, sport, topic, type, search, sort, authorId } =
    parsed.data;

  // Best-effort auto release of due scheduled stories.
  if (published === true) {
    await releaseDueScheduledStories();
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Prisma.StoryWhereInput = {
    ...(typeof published === "boolean" ? { published } : {}),
    ...(authorId ? { authorId } : {}),
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

  const orderBy: Prisma.StoryOrderByWithRelationInput[] =
    sort === "popular"
      ? [
          { views: { _count: "desc" } },
          { comments: { _count: "desc" } },
          { createdAt: "desc" },
        ]
      : [{ createdAt: "desc" }];

  try {
    const [total, rows] = await prisma.$transaction([
      prisma.story.count({ where }),
      prisma.story.findMany({
        where,
        orderBy,
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
          scheduledPublishAt: true,
          inReview: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          author: { select: { id: true, fullName: true } },
          _count: { select: { comments: true, views: true } },
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
      scheduledPublishAt: s.scheduledPublishAt,
      inReview: s.inReview,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      authorId: s.authorId,
      author: s.author,
      tag: s.topic,
      timeAgo: formatDistanceToNow(s.createdAt, { addSuffix: true }),
      commentCount: s._count.comments,
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

  const { page, pageSize, published, sport, topic, type, search, sort, authorId } =
    parsed.data;

  if (published === true) {
    await releaseDueScheduledStories();
  }

  const where: Prisma.StoryWhereInput = {
    ...(typeof published === "boolean" ? { published } : {}),
    ...(authorId ? { authorId } : {}),
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

  const orderBy: Prisma.StoryOrderByWithRelationInput[] =
    sort === "popular"
      ? [
          { views: { _count: "desc" } },
          { comments: { _count: "desc" } },
          { createdAt: "desc" },
        ]
      : [{ createdAt: "desc" }];

  try {
    const [total, rows] = await prisma.$transaction([
      prisma.story.count({ where }),
      prisma.story.findMany({
        where,
        orderBy,
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
          scheduledPublishAt: true,
          inReview: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          author: { select: { id: true, fullName: true } },
          _count: { select: { comments: true, views: true } },
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
      scheduledPublishAt: s.scheduledPublishAt,
      inReview: s.inReview,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      authorId: s.authorId,
      author: s.author,
      tag: s.topic,
      timeAgo: formatDistanceToNow(s.createdAt, { addSuffix: true }),
      commentCount: s._count.comments,
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
    await releaseDueScheduledStories();

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
        scheduledPublishAt: true,
        inReview: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        _count: { select: { comments: true } },
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
      scheduledPublishAt: story.scheduledPublishAt,
      inReview: story.inReview,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      authorId: story.authorId,
      author: { id: story.author.id, fullName: story.author.fullName },
      tag: story.topic,
      timeAgo: formatDistanceToNow(story.createdAt, { addSuffix: true }),
      commentCount: story._count.comments,
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
    const guard = ensureEditor(session);
    if (!guard.ok) {
      return {
        success: false,
        message: "You do not have permission to edit stories",
      };
    }
    const userId = guard.userId;

    const { id, ...patch } = parsed.data;

    const existing = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true, slug: true, published: true },
    });
    if (!existing) return { success: false, message: "Story not found" };
    if (existing.authorId !== userId && !isAdmin(session?.user?.role)) {
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
    if (patch.in_review !== undefined) data.inReview = patch.in_review;
    if (patch.scheduled_publish_at !== undefined) {
      const v = patch.scheduled_publish_at;
      if (!v || v.length === 0) {
        data.scheduledPublishAt = null;
      } else {
        const d = new Date(v);
        if (!Number.isNaN(d.getTime())) data.scheduledPublishAt = d;
      }
    }
    if (patch.published !== undefined) {
      if (patch.published) {
        data.published = true;
        data.scheduledPublishAt = null;
        data.inReview = false;
      } else {
        data.published = false;
      }
    }
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

    revalidateStorySlug(updated.slug);

    return { success: true, message: "Story updated", data: updated };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function getStoryById(
  id: string,
): Promise<ActionResponse<StoryDetail | null>> {
  if (!id || typeof id !== "string") return { success: false, message: "Invalid id" };
  try {
    const session = await auth();
    const guard = ensureEditor(session);
    if (!guard.ok) return { success: false, message: "Forbidden" };

    const story = await prisma.story.findUnique({
      where: { id },
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
        scheduledPublishAt: true,
        inReview: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, fullName: true } },
        _count: { select: { comments: true } },
      },
    });
    if (!story) return { success: true, message: "OK", data: null };

    if (story.authorId !== guard.userId && !isAdmin(session?.user?.role)) {
      return { success: false, message: "Forbidden" };
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
      scheduledPublishAt: story.scheduledPublishAt,
      inReview: story.inReview,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      authorId: story.authorId,
      author: story.author,
      tag: story.topic,
      timeAgo: formatDistanceToNow(story.createdAt, { addSuffix: true }),
      commentCount: story._count.comments,
    };
    return { success: true, message: "OK", data };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function publishStory(id: string) {
  if (!id || typeof id !== "string") return { success: false, message: "Invalid id" };
  try {
    const session = await auth();
    const guard = ensureEditor(session);
    if (!guard.ok) return { success: false, message: "Forbidden" };

    const s = await prisma.story.findUnique({ where: { id }, select: { authorId: true, slug: true } });
    if (!s) return { success: false, message: "Story not found" };
    if (s.authorId !== guard.userId && !isAdmin(session?.user?.role)) {
      return { success: false, message: "Forbidden" };
    }

    await prisma.story.update({
      where: { id },
      data: { published: true, scheduledPublishAt: null, inReview: false },
    });
    revalidateStorySlug(s.slug);
    return { success: true, message: "Published" };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function unpublishStory(id: string) {
  if (!id || typeof id !== "string") return { success: false, message: "Invalid id" };
  try {
    const session = await auth();
    const guard = ensureEditor(session);
    if (!guard.ok) return { success: false, message: "Forbidden" };

    const s = await prisma.story.findUnique({ where: { id }, select: { authorId: true, slug: true } });
    if (!s) return { success: false, message: "Story not found" };
    if (s.authorId !== guard.userId && !isAdmin(session?.user?.role)) {
      return { success: false, message: "Forbidden" };
    }

    await prisma.story.update({
      where: { id },
      data: { published: false },
    });
    revalidateStorySlug(s.slug);
    return { success: true, message: "Unpublished" };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function setStoryInReview(id: string, inReview: boolean) {
  if (!id || typeof id !== "string") return { success: false, message: "Invalid id" };
  try {
    const session = await auth();
    const guard = ensureEditor(session);
    if (!guard.ok) return { success: false, message: "Forbidden" };

    const s = await prisma.story.findUnique({ where: { id }, select: { authorId: true, slug: true } });
    if (!s) return { success: false, message: "Story not found" };
    if (s.authorId !== guard.userId && !isAdmin(session?.user?.role)) {
      return { success: false, message: "Forbidden" };
    }

    await prisma.story.update({
      where: { id },
      data: { inReview: Boolean(inReview), published: false },
    });
    revalidateStorySlug(s.slug);
    return { success: true, message: "OK" };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export async function scheduleStoryPublish(id: string, isoDate: string) {
  if (!id || typeof id !== "string") return { success: false, message: "Invalid id" };
  try {
    const session = await auth();
    const guard = ensureEditor(session);
    if (!guard.ok) return { success: false, message: "Forbidden" };

    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return { success: false, message: "Invalid date" };

    const s = await prisma.story.findUnique({ where: { id }, select: { authorId: true, slug: true } });
    if (!s) return { success: false, message: "Story not found" };
    if (s.authorId !== guard.userId && !isAdmin(session?.user?.role)) {
      return { success: false, message: "Forbidden" };
    }

    await prisma.story.update({
      where: { id },
      data: { published: false, scheduledPublishAt: d, inReview: false },
    });
    revalidateStorySlug(s.slug);
    return { success: true, message: "Scheduled" };
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
    const guard = ensureEditor(session);
    if (!guard.ok) {
      return { success: false, message: "You do not have permission to delete stories" };
    }
    const userId = guard.userId;

    const existing = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true, slug: true },
    });
    if (!existing) return { success: false, message: "Story not found" };
    if (existing.authorId !== userId && !isAdmin(session?.user?.role)) {
      return {
        success: false,
        message: "You can only delete your own stories",
      };
    }

    await prisma.story.delete({ where: { id } });

    revalidateStorySlug(existing.slug);

    return { success: true, message: "Story deleted", data: { id } };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export type EditorialRow = {
  id: string;
  slug: string;
  title: string;
  author: string;
  sport: string;
  status: "draft" | "review" | "scheduled" | "published";
  updated: string;
};

export async function getEditorialStories(): Promise<
  ActionResponse<EditorialRow[]>
> {
  try {
    const session = await auth();
    const guard = ensureEditor(session);
    if (!guard.ok) return { success: false, message: "You do not have permission" };

    const where: Prisma.StoryWhereInput = isAdmin(session?.user?.role)
      ? {}
      : { authorId: guard.userId };

    const rows = await prisma.story.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 200,
      select: {
        id: true,
        slug: true,
        title: true,
        sport: true,
        published: true,
        scheduledPublishAt: true,
        inReview: true,
        updatedAt: true,
        author: { select: { fullName: true } },
      },
    });

    const data: EditorialRow[] = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      author: r.author.fullName,
      sport: r.sport,
      status: deriveEditorialStatus({
        published: r.published,
        scheduledPublishAt: r.scheduledPublishAt,
        inReview: r.inReview,
      }),
      updated: formatDistanceToNow(r.updatedAt, { addSuffix: true }),
    }));

    return { success: true, message: "OK", data };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

/** Lowercased sport label → count of published stories (best-effort aggregation). */
export async function getPublishedStoryCountsBySport(): Promise<
  ActionResponse<Record<string, number>>
> {
  try {
    const rows = await prisma.story.groupBy({
      by: ["sport"],
      where: { published: true },
      _count: { _all: true },
    });
    const data: Record<string, number> = {};
    for (const r of rows) {
      const key = r.sport.trim().toLowerCase();
      data[key] = (data[key] ?? 0) + r._count._all;
    }
    return { success: true, message: "OK", data };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

export type DashboardActivityItem = {
  kind: "bookmark" | "story";
  text: string;
  time: Date;
  timeAgo: string;
};

export async function getDashboardActivity(): Promise<
  ActionResponse<DashboardActivityItem[]>
> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || typeof userId !== "string") {
      return { success: false, message: "You must be signed in" };
    }

    const [bookmarks, stories] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          createdAt: true,
          story: { select: { title: true, slug: true } },
        },
      }),
      prisma.story.findMany({
        where: { authorId: userId },
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          title: true,
          published: true,
          inReview: true,
          scheduledPublishAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const items: DashboardActivityItem[] = [
      ...bookmarks.map((b) => ({
        kind: "bookmark" as const,
        text: `You bookmarked "${b.story.title}"`,
        time: b.createdAt,
        timeAgo: formatDistanceToNow(b.createdAt, { addSuffix: true }),
      })),
      ...stories.map((s) => {
        const status = deriveEditorialStatus({
          published: s.published,
          inReview: s.inReview,
          scheduledPublishAt: s.scheduledPublishAt,
        });
        const verb =
          status === "published"
            ? "Published"
            : status === "scheduled"
              ? "Scheduled"
              : status === "review"
                ? "Sent to review"
                : "Saved draft";
        return {
          kind: "story" as const,
          text: `${verb}: "${s.title}"`,
          time: s.updatedAt,
          timeAgo: formatDistanceToNow(s.updatedAt, { addSuffix: true }),
        };
      }),
    ]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 12);

    return { success: true, message: "OK", data: items };
  } catch (error) {
    return { success: false, message: "Unexpected Error", error };
  }
}

/** @deprecated Use `createStory` */
export const publicStory = createStory;
