import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

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

export const getUserBookmarks = async () => {
  try {
    const session = await auth();
    if (!session) redirect("/auth");
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session?.user.id,
      },
      include: {
        story: true,
      },
    });

    // story id: 06a41eea-976c-4be8-9c65-f306b3f0e68b
    // user id: c3cb038a-0ea9-4459-a61d-ab86284884a6
    // await prisma.bookmark.create({
    //   data: {
    //     storyId: "06a41eea-976c-4be8-9c65-f306b3f0e68b",
    //     userId: "c3cb038a-0ea9-4459-a61d-ab86284884a6",
    //   },
    // });
    console.log("BOOKMARKS IN ACTION: ", bookmarks);
    return {
      success: true,
      bookmarks: bookmarks.map((b) => b.story),
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
