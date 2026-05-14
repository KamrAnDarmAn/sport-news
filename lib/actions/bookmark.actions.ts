"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const BOOKMARK_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
} as const;

export const addAndRemoveBookmark = async (storyId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Not signed in" };
    }
    const userId = session.user.id;
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        storyId,
        userId,
      },
    });

    if (bookmark) {
      await prisma.bookmark.delete({
        where: { id: bookmark.id },
      });
      revalidatePath("/bookmarks");
      revalidatePath("/dashboard");
      return {
        success: true,
        action: BOOKMARK_ACTIONS.REMOVE,
        message: "Bookmark removed successfully",
      };
    }

    await prisma.bookmark.create({
      data: {
        storyId,
        userId,
      },
    });
    revalidatePath("/bookmarks");
    revalidatePath("/dashboard");
    return {
      success: true,
      action: BOOKMARK_ACTIONS.ADD,
      message: "Bookmark added successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      message: "An error occurred while adding/removing the bookmark",
    };
  }
};

export const getUserBookmarks = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth");
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        story: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      bookmarks: bookmarks.map((b) => ({
        ...b.story,
        timeAgo: formatDistanceToNow(new Date(b.createdAt), {
          addSuffix: true,
        }),
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      message: "An error occurred while fetching the bookmarks",
    };
  }
};

export async function getBookmarkCount() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: true as const, count: 0 };
    }
    const count = await prisma.bookmark.count({
      where: { userId: session.user.id },
    });
    return { success: true as const, count };
  } catch (error) {
    console.error("[getBookmarkCount]", error);
    return { success: false as const, count: 0 };
  }
}

export const isStoryBookmarkedByUser = async (
  storyId: string,
  userId: string,
) => {
  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        storyId,
        userId,
      },
    });
    return !!bookmark;
  } catch (error) {
    console.error("Error checking if story is bookmarked:", error);
    return false;
  }
};
