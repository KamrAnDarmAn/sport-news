"use client"

import { useEffect, useState, useCallback } from "react";
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { Search, FileText, Newspaper, Trophy, Compass, Bookmark, PenLine, LayoutDashboard, Flame, Home } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { SPORT_LIST } from "@/lib/sports-data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PostHit {
    id: string;
    title: string;
    slug: string;
    type: string;
    sport: string | null;
    excerpt: string | null;
}

const navIcons: Record<string, any> = {
    "/": Home,
    "/category": Compass,
    "/trending": Flame,
    "/recent": Newspaper,
    "/rankings": Trophy,
    "/articles": FileText,
    "/news": Newspaper,
    "/bookmarks": Bookmark,
};

export const GlobalSearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<PostHit[]>([]);
    const [loading, setLoading] = useState(false);
    const nav = useRouter();

    // const user = session?.user;
    // const isAdmin = user ? session.user.role === 'ADMIN' : false;
    const user = { name: "kamran" }
    const isAdmin = true



    // Cmd/Ctrl + K opens
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Debounced post search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        // TODO - add sport filter to search
    }, [query]);

    const go = useCallback((path: string) => {
        setOpen(false);
        setQuery("");
        nav.push(path);
    }, [nav]);

    const sportMatches = SPORT_LIST.filter((s) =>
        !query || s.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="gap-2 text-muted-foreground font-normal hidden md:inline-flex"
                aria-label="Open global search"
            >
                <Search className="w-4 h-4" />
                <span>Search…</span>
                <kbd className="ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                    ⌘K
                </kbd>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="md:hidden"
                aria-label="Search"
            >
                <Search className="w-5 h-5" />
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search stories, sports, pages…"
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        {loading ? "Searching…" : "No results found."}
                    </CommandEmpty>

                    {results.length > 0 && (
                        <CommandGroup heading="Stories">
                            {results.map((r) => (
                                <CommandItem
                                    key={r.id}
                                    value={`post-${r.id}-${r.title}`}
                                    onSelect={() => go(`/article/${r.slug}`)}
                                    className="flex items-start gap-3 py-3"
                                >
                                    {r.type === "news" ? (
                                        <Newspaper className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                    ) : (
                                        <FileText className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                    )}
                                    <div className="min-w-0">
                                        <div className="font-semibold truncate">{r.title}</div>
                                        {r.excerpt && (
                                            <div className="text-xs text-muted-foreground truncate">{r.excerpt}</div>
                                        )}
                                    </div>
                                    {r.sport && (
                                        <span className="ml-auto text-[10px] uppercase font-bold text-muted-foreground">
                                            {r.sport}
                                        </span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {sportMatches.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="Sports">
                                {sportMatches.map((s) => (
                                    <CommandItem
                                        key={s.slug}
                                        value={`sport-${s.slug}`}
                                        onSelect={() => go(`/sport/${s.slug}`)}
                                    >
                                        <span className="mr-2 text-base">{s.icon}</span>
                                        {s.name}
                                        <CommandShortcut>{s.count} stories</CommandShortcut>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}

                    <CommandSeparator />
                    <CommandGroup heading="Navigate">
                        {NAV_LINKS.map((l) => {
                            const Icon = navIcons[l.href] ?? Compass;
                            return (
                                <CommandItem key={l.href} value={`nav-${l.href}`} onSelect={() => go(l.href)}>
                                    <Icon className="mr-2 w-4 h-4" />
                                    {l.name}
                                </CommandItem>
                            );
                        })}
                        <CommandItem value="nav-bookmarks" onSelect={() => go("/bookmarks")}>
                            <Bookmark className="mr-2 w-4 h-4" /> Bookmarks
                        </CommandItem>
                        <CommandItem value="nav-dashboard" onSelect={() => go("/dashboard")}>
                            <LayoutDashboard className="mr-2 w-4 h-4" /> My Dashboard
                        </CommandItem>
                        {isAdmin && (
                            <>
                                <CommandItem value="nav-create" onSelect={() => go("/create")}>
                                    <PenLine className="mr-2 w-4 h-4" /> Write a story
                                </CommandItem>
                                <CommandItem value="nav-editorial" onSelect={() => go("/editorial")}>
                                    <LayoutDashboard className="mr-2 w-4 h-4" /> Editorial workflow
                                </CommandItem>
                            </>
                        )}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};
