"use client";

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
import {
  Search,
  FileText,
  Newspaper,
  Trophy,
  Compass,
  Bookmark,
  PenLine,
  LayoutDashboard,
  Flame,
  Home,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { SPORT_LIST } from "@/lib/sports-data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getNumberOfStoriesForEachCategory, globalSearch, type GlobalSearchHit } from "@/lib/actions/search.actions";

const navIcons: Record<string, React.ElementType> = {
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
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<GlobalSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [noOfStoriesPerCategory, setNoOfStoriesPerCategory] = useState<any[] | undefined>([])
  const nav = useRouter();

  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";


  useEffect(() => {
    (async () => {
      const stories = await getNumberOfStoriesForEachCategory()
      if (stories.success)
        setNoOfStoriesPerCategory(stories.stoies)
    })()
  }, [])

  console.log('NO OF STORIES: ', noOfStoriesPerCategory)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!debounced) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const result = await globalSearch(debounced);
      if (cancelled) return;
      setLoading(false);
      setResults(result.success ? result.hits : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const go = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery("");
      setDebounced("");
      setResults([]);
      nav.push(path);
    },
    [nav],
  );

  const storyHref = (hit: GlobalSearchHit) =>
    hit.type === "NEWS" ? `/news/${hit.slug}` : `/articles/${hit.slug}`;

  const sportMatches = SPORT_LIST.filter(
    (s) => !query || s.name.toLowerCase().includes(query.toLowerCase()),
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
            {loading && debounced
              ? "Searching…"
              : debounced
                ? "No results found."
                : "Type to search stories, or pick a sport below."}
          </CommandEmpty>

          {results.length > 0 && (
            <CommandGroup heading="Stories">
              {results.map((r) => (
                <CommandItem
                  key={r.id}
                  value={`post-${r.id}-${r.title}`}
                  onSelect={() => go(storyHref(r))}
                  className="flex items-start gap-3 py-3"
                >
                  {r.type === "NEWS" ? (
                    <Newspaper className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  ) : (
                    <FileText className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{r.title}</div>
                    {r.excerpt && (
                      <div className="text-xs text-muted-foreground truncate">
                        {r.excerpt}
                      </div>
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
                {/* TODO */}
                {/* {noOfStoriesPerCategory && noOfStoriesPerCategory.map((s) => ( */}
                {sportMatches.map((s) => (
                  <CommandItem
                    key={s.slug}
                    value={`sport-${s.slug}`}
                    onSelect={() => go(`/categories/${s.slug}`)}
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
                <CommandItem
                  key={l.href}
                  value={`nav-${l.href}`}
                  onSelect={() => go(l.href)}
                >
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
      </CommandDialog >
    </>
  );
};
