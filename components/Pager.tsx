'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    page: number;
    total: number;
    onChange: (p: number) => void;
}

const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

const pageList = (current: number, total: number): (number | "…")[] => {
    if (total <= 1) return [1];
    if (total <= 7) return range(1, total);
    if (current <= 4) return [...range(1, 5), "…", total];
    if (current >= total - 3) return [1, "…", ...range(total - 4, total)];
    return [1, "…", current - 1, current, current + 1, "…", total];
};

export const Pager = ({ page, total, onChange }: Props) => {
    const safeTotal = Math.max(1, total);
    const current = Math.min(Math.max(1, page), safeTotal);
    const items = pageList(current, safeTotal);

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-12">
            <button
                onClick={() => onChange(Math.max(1, current - 1))}
                disabled={current === 1}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border disabled:opacity-40 disabled:pointer-events-none hover:border-primary transition-smooth"
                aria-label="Previous page"
                type="button"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            {items.map((it, i) =>
                it === "…" ? (
                    <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
                ) : (
                    <button
                        key={it}
                        type="button"
                        onClick={() => onChange(it)}
                        aria-current={it === current ? "page" : undefined}
                        className={cn(
                            "min-w-10 h-10 px-3 rounded-full font-bold text-sm transition-smooth",
                            it === current
                                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                                : "bg-card border border-border hover:border-primary",
                        )}
                    >
                        {it}
                    </button>
                ),
            )}
            <button
                onClick={() => onChange(Math.min(safeTotal, current + 1))}
                disabled={current === safeTotal}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border disabled:opacity-40 disabled:pointer-events-none hover:border-primary transition-smooth"
                aria-label="Next page"
                type="button"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
};
