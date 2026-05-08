'use client'
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks, type Bookmark as B } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface Props {
    item: Omit<B, "savedAt">;
    className?: string;
    /** "icon" only (default) or with a label */
    variant?: "icon" | "labeled";
}

export const BookmarkButton = ({ item, className, variant = "icon" }: Props) => {
    const bookMarks = useBookmarks();
    if (!bookMarks)
        return <p>Unexpected error.</p>

    const { has, toggle } = bookMarks
    const saved = has(item.id);

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
        track(saved ? "bookmark_remove" : "bookmark_add", { id: item.id });
    };

    const Icon = saved ? BookmarkCheck : Bookmark;

    if (variant === "labeled") {
        return (
            <button
                onClick={onClick}
                aria-pressed={saved}
                className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-smooth",
                    saved
                        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                        : "bg-card border-border hover:border-primary",
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
            onClick={onClick}
            aria-pressed={saved}
            aria-label={saved ? "Remove bookmark" : "Save for later"}
            className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-full bg-background/70 backdrop-blur border border-border hover:border-primary transition-smooth",
                saved && "text-primary",
                className,
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};
