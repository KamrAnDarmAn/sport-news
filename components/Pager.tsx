'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    page: number;
    total: number;
    onChange: (p: number) => void;
}

const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

const pageList = (current: number, total: number): (number | "…")[] => {
    if (total <= 7) return range(1, total);
    if (current <= 4) return [...range(1, 5), "…", total];
    if (current >= total - 3) return [1, "…", ...range(total - 4, total)];
    return [1, "…", current - 1, current, current + 1, "…", total];
};

export const Pager = ({ page, total }: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleNavigation = (type: "prev" | "next") => {
        const nextPageNumber =
            type === "prev" ? Number(page) - 1 : Number(page) + 1;


        // / {
        // params: searchParams.toString(),
        //     key: "page",
        //         value: nextPageNumber.toString(),
        // }


        router.push(window.location.href + `?page=${page}`);
    };
    const items = Array(total)



    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-12">
            <button
                onClick={() => onChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border disabled:opacity-40 disabled:pointer-events-none hover:border-primary transition-smooth"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            {items.map((it, i) =>
                it === "…" ? (
                    <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
                ) : (
                    <button
                        key={it}
                        onClick={() => onChange(it)}
                        aria-current={it === page ? "page" : undefined}
                        className={cn(
                            "min-w-10 h-10 px-3 rounded-full font-bold text-sm transition-smooth",
                            it === page
                                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                                : "bg-card border border-border hover:border-primary",
                        )}
                    >
                        {/* {it} */}
                        {i + 1}
                    </button>
                ),
            )}
            <button
                onClick={() => onChange(Math.min(total, page + 1))}
                disabled={page === total}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border disabled:opacity-40 disabled:pointer-events-none hover:border-primary transition-smooth"
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
};
