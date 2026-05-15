"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FilterChips } from "@/components/FilterChips";
import { BookmarkButton } from "@/components/BookMarkButton";
import { Flame, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  getTrendingStories,
  type TrendingStoryItem,
} from "@/lib/actions/trending.actions";

const TAGS = ["all", "Football", "NBA", "F1", "Tennis", "Cricket", "Boxing"];

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

type Row = TrendingStoryItem & { rank: number };

const Trending = () => {
  const [tag, setTag] = useState("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const sportFilter =
        tag === "all"
          ? undefined
          : tag === "NBA"
            ? "basketball"
            : tag === "F1"
              ? "f1"
              : tag.toLowerCase();
      const res = await getTrendingStories({
        sport: sportFilter,
        limit: 25,
        type: "news",
      });
      if (cancelled) return;
      if (res.success && res.items) {
        setRows(
          res.items.map((s, i) => ({
            ...s,
            rank: i + 1,
          })),
        );
      } else setRows([]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [tag]);

  const items = useMemo(() => rows, [rows]);

  return (
    <div>
      <SEO
        title="Trending Sports News"
        description="The most-read, most-shared sports stories on Pulse right now."
        jsonLd={breadcrumbJsonLd([{ name: "Trending", href: "/trending" }])}
      />
      <PageHeader
        breadcrumbs={[{ name: "Trending", href: "/trending" }]}
        eyebrow="Hot Right Now"
        title="Trending News"
        subtitle="The stories everyone is reading, sharing, and arguing about — right this minute."
      />
      <section className="container py-12 mx-auto">
        <div className="mb-8">
          <FilterChips
            label="Sport"
            options={TAGS.map((t) => ({
              value: t,
              label: t === "all" ? "All sports" : t,
            }))}
            value={tag}
            onChange={setTag}
          />
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid gap-4 ">
            {items.map((n, i) => (
              <article
                key={n.id}
                style={{ animationDelay: `${i * 70}ms` }}
                className="group flex items-center gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-slide-in-right"
              >
                <div className="text-5xl md:text-6xl font-black text-gradient-primary tabular-nums w-16 text-center">
                  {String(n.rank).padStart(2, "0")}
                </div>
                <Link href={`/article/${n.slug}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-bold uppercase tracking-wider">
                      {n.sport}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-bold">
                      <Flame className="w-3 h-3" /> Trending
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-smooth">
                    {n.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {formatViews(n.viewCount)} views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {n.commentCount}
                    </span>
                  </div>
                </Link>
                <div onClick={(e) => e.stopPropagation()}>
                  <BookmarkButton
                    item={{
                      id: n.id,
                      title: n.title,
                      href: `/article/${n.slug}`,
                      sport: n.sport,
                    }}
                  />
                </div>
              </article>
            ))}
            {items.length === 0 && (
              <p className="text-muted-foreground text-center py-12">
                No trending stories in this sport.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Trending;
