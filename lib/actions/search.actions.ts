"use server";

import { prisma } from "@/lib/prisma";
import z from "zod";

const GlobalSearchSchema = z.object({
  query: z.string(),
});

export type GlobalSearchHit = {
  id: string;
  title: string;
  slug: string;
  type: "ARTICLE" | "NEWS";
  sport: string;
  excerpt: string;
};

export async function globalSearch(query: string) {
  try {
    const validation = GlobalSearchSchema.safeParse({ query });
    if (!validation.success) {
      return { success: false as const, error: "Invalid search parameters", hits: [] as GlobalSearchHit[] };
    }

    const searchQuery = validation.data.query.trim();
    if (!searchQuery) {
      return { success: true as const, hits: [] as GlobalSearchHit[] };
    }

    const stories = await prisma.story.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { excerpt: { contains: searchQuery, mode: "insensitive" } },
          { sport: { contains: searchQuery, mode: "insensitive" } },
          { topic: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        sport: true,
        excerpt: true,
      },
      take: 12,
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true as const,
      hits: stories as GlobalSearchHit[],
    };
  } catch (error) {
    console.error("[globalSearch]", error);
    return {
      success: false as const,
      error: "Search failed",
      hits: [] as GlobalSearchHit[],
    };
  }
}
