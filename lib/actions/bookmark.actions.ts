import { prisma } from "../prisma";

export const BOOKMARK_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
} as const;

export const addBookmark = async (storyId: string) => {
  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        storyId: storyId,
      },
    });
  } catch (error) {}
};
