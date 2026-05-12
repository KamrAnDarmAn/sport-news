import { auth } from "@/auth";
import { prisma } from "../prisma";
import { console } from "inspector/promises";

export const BOOKMARK_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
} as const;

export const addAndRemoveBookmark = async (storyId: string) => {
  try {
    const session = await auth();
    if (!session) return;
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        storyId: storyId,
        userId: session.user.id!,
      },
    });

    let isCreatedNewBookmark = false;
    if (bookmark) {
      await prisma.bookmark.delete({
        where: {
          id: bookmark.id,
        },
      });
      isCreatedNewBookmark = true;
    } else {
      await prisma.bookmark.create({
        data: {
          storyId: storyId,
          userId: session.user.id!,
        },
      });
    }

    return {
      success: true,
      action: isCreatedNewBookmark
        ? BOOKMARK_ACTIONS.ADD
        : BOOKMARK_ACTIONS.REMOVE,
      bookmarkId: bookmark?.id,
      message:
        "Bookmark " +
        (isCreatedNewBookmark ? "added" : "removed") +
        " successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      message: "An error occurred while adding/removing the bookmark",
    };
  }
};

export const getUserBookmarks = async (userId: string) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
      include: {
        story: true,
      },
    });
    return {
      success: true,
      bookmarks,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      message: "An error occurred while fetching the bookmarks",
    };
  }
};

export const isStoryBookmarkedByUser = async (
  storyId: string,
  userId: string,
) => {
  let bookmark;
  try {
    bookmark = await prisma.bookmark.findFirst({
      where: {
        storyId: storyId,
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error checking if story is bookmarked:", error);
    return false;
  }

  return !!bookmark;
};
