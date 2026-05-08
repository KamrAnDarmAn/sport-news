'use client'
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { Pager } from "@/components/Pager";
import { BookmarkButton } from "@/components/BookMarkButton";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { BookmarksProvider } from "@/hooks/use-bookmarks";

const articles = [
  { id: "a1", tag: "Tactics", read: "12 min", title: "The False 9 Renaissance: How modern teams are reinventing Cruyff's idea", author: "M. Calvo" },
  { id: "a2", tag: "Long Read", read: "18 min", title: "Inside the academy that quietly produces half of Europe's top defenders", author: "S. Okafor" },
  { id: "a3", tag: "Interview", read: "8 min", title: "On burnout, comebacks, and what's next: a candid sit-down", author: "L. Tanaka" },
  { id: "a4", tag: "Data", read: "10 min", title: "xG isn't enough anymore — meet the metrics shaping 2026", author: "R. Patel" },
  { id: "a5", tag: "Culture", read: "15 min", title: "Ultras 2.0: how fan culture is being rewritten by Gen Z", author: "A. Nowak" },
  { id: "a6", tag: "Opinion", read: "6 min", title: "Why the salary cap conversation is finally serious", author: "J. Brooks" },
];

const TAGS = ["all", "Tactics", "Long Read", "Interview", "Data", "Culture", "Opinion"];
const PAGE_SIZE = 4;

const Articles = () => {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return articles.filter((a) => {
      if (tag !== "all" && a.tag !== tag) return false;
      if (!needle) return true;
      return a.title.toLowerCase().includes(needle) || a.author.toLowerCase().includes(needle);
    });
  }, [q, tag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <BookmarksProvider>

      <div>
        <SEO
          title="Sports Articles & Long Reads"
          description="Tactics, culture, data and stories — long-form sports journalism from Pulse."
          jsonLd={breadcrumbJsonLd([{ name: "Articles", href: "/articles" }])}
        />
        <Breadcrumbs items={[{ name: "Articles", href: "/articles" }]} />
        <PageHeader eyebrow="Long Reads" title="Sports Articles" subtitle="Tactics, culture, data and stories — written by reporters who actually love the sport." />

        <section className="container py-12 mx-auto">
          <div className="grid gap-4 mb-8">
            <SearchBar value={q} onChange={setQ} placeholder="Search long reads, authors…" />
            <FilterChips
              label="Topic"
              options={TAGS.map((t) => ({ value: t, label: t === "all" ? "All topics" : t }))}
              value={tag}
              onChange={(v) => { setTag(v); setPage(1); }}
            />
          </div>

          {paged.length === 0 ? (
            <p className="text-muted-foreground">No articles match.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {paged.map((a, i) => (
                  <article key={a.id} style={{ animationDelay: `${i * 80}ms` }} className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-scale-in overflow-hidden">
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <BookmarkButton item={{ id: a.id, title: a.title, href: `/articles#${a.id}`, sport: a.tag, excerpt: a.title }} />
                      <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-smooth" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      <span className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground font-bold uppercase tracking-wider">{a.tag}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground"><BookOpen className="w-3 h-3" /> {a.read} read</span>
                    </div>
                    <h3 className="text-2xl font-black leading-tight mb-4 group-hover:text-gradient-primary transition-smooth pr-24">{a.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-7 h-7 rounded-full bg-gradient-electric" />
                      <span>By <span className="font-semibold text-foreground">{a.author}</span></span>
                    </div>
                  </article>
                ))}
              </div>
              <Pager page={page} total={totalPages} onChange={setPage} />
            </>
          )}
        </section>
      </div>
    </BookmarksProvider>
  );
};

export default Articles;
