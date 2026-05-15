'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { Pager } from "@/components/Pager";
import { BookmarkButton } from "@/components/BookMarkButton";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { BookmarksProvider } from "@/hooks/use-bookmarks";
import { getStories, type StoryListItem } from "@/lib/actions/story.actions";

const TAGS = ["all", "Tactics", "Long Read", "Interview", "Data", "Culture", "Opinion"];
const PAGE_SIZE = 4;

type Row = {
  id: string;
  tag: string;
  read: string;
  title: string;
  author: string;
  slug: string;
};

function mapRow(s: StoryListItem): Row {
  return {
    id: s.id,
    tag: s.topic,
    read: `${s.readTime} min`,
    title: s.title,
    author: s.author.fullName,
    slug: s.slug,
  };
}

const Articles = () => {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [q, tag]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await getStories({
        page,
        pageSize: PAGE_SIZE,
        published: true,
        type: "article",
        search: q.trim() || undefined,
        topic: tag !== "all" ? tag : undefined,
      });
      if (cancelled) return;
      if (res.success && res.data) {
        setRows(res.data.items.map(mapRow));
        setTotal(res.data.total);
      } else {
        setRows([]);
        setTotal(0);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page, q, tag]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <SEO
        title="Sports Articles & Long Reads"
        description="Tactics, culture, data and stories — long-form sports journalism from Pulse."
        jsonLd={breadcrumbJsonLd([{ name: "Articles", href: "/articles" }])}
      />
      <PageHeader eyebrow="Long Reads" title="Sports Articles" subtitle="Tactics, culture, data and stories — written by reporters who actually love the sport."
        breadcrumbs={[{ name: "Articles", href: "/articles" }]} />

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

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">No articles match.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {rows.map((a, i) => (
                <article key={a.id} style={{ animationDelay: `${i * 80}ms` }} className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-scale-in overflow-hidden">
                  <div className="absolute top-6 right-6 flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
                    <BookmarkButton item={{ id: a.id, title: a.title, href: `/article/${a.slug}`, sport: a.tag, excerpt: a.title }} />
                    <Link href={`/article/${a.slug}`} aria-hidden className="inline-flex">
                      <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-smooth" />
                    </Link>
                  </div>
                  <Link href={`/article/${a.slug}`} className="block">
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      <span className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground font-bold uppercase tracking-wider">{a.tag}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground"><BookOpen className="w-3 h-3" /> {a.read} read</span>
                    </div>
                    <h3 className="text-2xl font-black leading-tight mb-4 group-hover:text-gradient-primary transition-smooth pr-24">{a.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-7 h-7 rounded-full bg-gradient-electric" />
                      <span>By <span className="font-semibold text-foreground">{a.author}</span></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            <Pager page={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
};

export default Articles;
