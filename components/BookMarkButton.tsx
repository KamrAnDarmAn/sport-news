"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useBookmarks, type Bookmark as B } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import {
  addAndRemoveBookmark,
  isStoryBookmarkedByUser,
} from "@/lib/actions/bookmark.actions";

const BM_CHANGE = "pulse:bookmarks-changed";

export function dispatchBookmarkChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BM_CHANGE));
  }
}

interface Props {
  item: Omit<B, "savedAt">;
  className?: string;
  variant?: "icon" | "labeled";
  /** When set, skips client fetch for signed-in bookmark state */
  initialSaved?: boolean;
}

export const BookmarkButton = ({
  item,
  className,
  variant = "icon",
  initialSaved,
}: Props) => {
  const ctx = useBookmarks();
  const { data: session, status } = useSession();
  const { has, toggle } = ctx;

  const isAuthenticated = status === "authenticated" && !!session?.user?.id;

  const [serverSaved, setServerSaved] = useState<boolean | null>(
    typeof initialSaved === "boolean" ? initialSaved : null,
  );

  useEffect(() => {
    if (typeof initialSaved === "boolean") {
      setServerSaved(initialSaved);
    }
  }, [initialSaved]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (typeof initialSaved === "boolean") return;
    let cancelled = false;
    void isStoryBookmarkedByUser(item.id, session!.user!.id!).then((v) => {
      if (!cancelled) setServerSaved(v);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, session?.user?.id, item.id, initialSaved]);

  const hydrating =
    isAuthenticated &&
    serverSaved === null &&
    typeof initialSaved !== "boolean";

  const saved = isAuthenticated ? Boolean(serverSaved) : has(item.id);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hydrating) return;

    if (!isAuthenticated) {
      toggle(item);
      track(saved ? "bookmark_remove" : "bookmark_add", { id: item.id });
      return;
    }

    const res = await addAndRemoveBookmark(item.id);
    if (!res.success || !("action" in res)) {
      toast.error("message" in res ? res.message : "Bookmark failed");
      return;
    }
    setServerSaved(res.action === "ADD");
    track(res.action === "ADD" ? "bookmark_add" : "bookmark_remove", {
      id: item.id,
    });
    dispatchBookmarkChanged();
  };

  const Icon = saved ? BookmarkCheck : Bookmark;

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        disabled={hydrating}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-smooth",
          saved
            ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
            : "bg-card border-border hover:border-primary",
          hydrating && "opacity-60 pointer-events-none",
          className,
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save for later"}
      disabled={hydrating}
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-full bg-background/70 backdrop-blur border border-border hover:border-primary transition-smooth",
        saved && "text-primary",
        hydrating && "opacity-60",
        className,
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};
