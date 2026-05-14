"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function recordStoryView(storyId: string) {
  if (!storyId || typeof storyId !== "string") {
    return { success: false, message: "Invalid story" };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    const story = await prisma.story.findFirst({
      where: { id: storyId, published: true },
      select: { id: true },
    });
    if (!story) {
      return { success: false, message: "Story not found" };
    }

    await prisma.view.create({
      data: {
        storyId,
        userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[recordStoryView]", error);
    return { success: false, message: "Could not record view" };
  }
}
