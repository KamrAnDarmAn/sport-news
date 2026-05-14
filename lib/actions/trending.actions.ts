"use server";

import { formatDistanceToNow } from "date-fns";

import { prisma } from "@/lib/prisma";

export type TrendingStoryItem = {
  id: string;
  title: string;
  slug: string;
  type: "ARTICLE" | "NEWS";
  excerpt: string;
  sport: string;
  readTime: number;
  coverUrl: string | null;
  createdAt: Date;
  commentCount: number;
  viewCount: number;
  timeAgo: string;
};

/**
 * Published stories ranked by recorded views (fallback: comments, recency).
 */
export async function getTrendingStories(options?: {
  sport?: string;
  limit?: number;
  type?: "news" | "article";
}) {
  const limit = Math.min(Math.max(options?.limit ?? 20, 1), 50);
  const sport = options?.sport?.trim();
  const type =
    options?.type === "news"
      ? ("NEWS" as const)
      : options?.type === "article"
        ? ("ARTICLE" as const)
        : undefined;

  try {
    const grouped = await prisma.view.groupBy({
      by: ["storyId"],
      _count: { storyId: true },
      orderBy: { _count: { storyId: "desc" } },
      take: 80,
    });

    const storyIds = grouped.map((g) => g.storyId);
    const countByStory = new Map(
      grouped.map((g) => [g.storyId, g._count.storyId]),
    );

    if (storyIds.length === 0) {
      const fallback = await prisma.story.findMany({
        where: {
          published: true,
          ...(sport
            ? { sport: { contains: sport, mode: "insensitive" as const } }
            : {}),
          ...(type ? { type } : {}),
        },
        orderBy: [{ comments: { _count: "desc" } }, { createdAt: "desc" }],
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          excerpt: true,
          sport: true,
          readTime: true,
          coverUrl: true,
          createdAt: true,
          _count: { select: { comments: true, views: true } },
        },
      });

      return {
        success: true as const,
        items: fallback.map((s) => mapRow(s, s._count.views)),
      };
    }

    const stories = await prisma.story.findMany({
      where: {
        id: { in: storyIds },
        published: true,
        ...(sport
          ? { sport: { contains: sport, mode: "insensitive" as const } }
          : {}),
        ...(type ? { type } : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        excerpt: true,
        sport: true,
        readTime: true,
        coverUrl: true,
        createdAt: true,
        _count: { select: { comments: true, views: true } },
      },
    });

    const order = new Map(storyIds.map((id, i) => [id, i]));
    const sorted = stories.sort(
      (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999),
    );

    const items: TrendingStoryItem[] = sorted.slice(0, limit).map((s) => {
      const vc = countByStory.get(s.id) ?? s._count.views;
      return mapRow(s, vc);
    });

    if (items.length < limit) {
      const existing = new Set(items.map((i) => i.id));
      const more = await prisma.story.findMany({
        where: {
          published: true,
          id: { notIn: [...existing] },
          ...(sport
            ? { sport: { contains: sport, mode: "insensitive" as const } }
            : {}),
          ...(type ? { type } : {}),
        },
        orderBy: [{ comments: { _count: "desc" } }, { createdAt: "desc" }],
        take: limit - items.length,
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          excerpt: true,
          sport: true,
          readTime: true,
          coverUrl: true,
          createdAt: true,
          _count: { select: { comments: true, views: true } },
        },
      });
      items.push(...more.map((s) => mapRow(s, s._count.views)));
    }

    return { success: true as const, items };
  } catch (error) {
    console.error("[getTrendingStories]", error);
    return { success: false as const, items: [] as TrendingStoryItem[] };
  }
}

function mapRow(
  s: {
    id: string;
    title: string;
    slug: string;
    type: "ARTICLE" | "NEWS";
    excerpt: string;
    sport: string;
    readTime: number;
    coverUrl: string | null;
    createdAt: Date;
    _count: { comments: number; views: number };
  },
  viewCount: number,
): TrendingStoryItem {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    type: s.type,
    excerpt: s.excerpt,
    sport: s.sport,
    readTime: s.readTime,
    coverUrl: s.coverUrl,
    createdAt: s.createdAt,
    commentCount: s._count.comments,
    viewCount,
    timeAgo: formatDistanceToNow(s.createdAt, { addSuffix: true }),
  };
}
