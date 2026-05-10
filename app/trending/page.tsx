'use client';
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FilterChips } from "@/components/FilterChips";
import { BookmarkButton } from "@/components/BookMarkButton";
import { Flame, Eye, MessageCircle } from "lucide-react";
import { BookmarksProvider } from "@/hooks/use-bookmarks";

const news = [
    { id: "t1", rank: 1, tag: "Football", title: "Madrid stuns Barcelona in 92nd-minute Clásico thriller", views: "284K", comments: 1240 },
    { id: "t2", rank: 2, tag: "NBA", title: "Lakers complete historic 4-1 comeback in Western Conference", views: "198K", comments: 980 },
    { id: "t3", rank: 3, tag: "F1", title: "Verstappen secures 6th consecutive pole at Monaco", views: "156K", comments: 620 },
    { id: "t4", rank: 4, tag: "Tennis", title: "Sinner powers into French Open final after epic semi", views: "142K", comments: 510 },
    { id: "t5", rank: 5, tag: "Cricket", title: "India announces revolutionary squad for SA series", views: "129K", comments: 870 },
    { id: "t6", rank: 6, tag: "Boxing", title: "Heavyweight unification bout confirmed for September", views: "98K", comments: 430 },
];

const TAGS = ["all", "Football", "NBA", "F1", "Tennis", "Cricket", "Boxing"];

const Trending = () => {
    const [tag, setTag] = useState("all");
    const items = useMemo(() => tag === "all" ? news : news.filter((n) => n.tag === tag), [tag]);

    return (
        <BookmarksProvider>

            <div>
                <SEO title="Trending Sports News" description="The most-read, most-shared sports stories on Pulse right now."
                    jsonLd={breadcrumbJsonLd([{ name: "Trending", href: "/trending" }])} />
                <Breadcrumbs items={[{ name: "Trending", href: "/trending" }]} />
                <PageHeader eyebrow="Hot Right Now" title="Trending News" subtitle="The stories everyone is reading, sharing, and arguing about — right this minute." />
                <section className="container py-12 mx-auto">
                    <div className="mb-8">
                        <FilterChips label="Sport" options={TAGS.map((t) => ({ value: t, label: t === "all" ? "All sports" : t }))} value={tag} onChange={setTag} />
                    </div>
                    <div className="grid gap-4 ">
                        {items.map((n, i) => (
                            <article key={n.id} style={{ animationDelay: `${i * 70}ms` }} className="group flex items-center gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-slide-in-right">
                                <div className="text-5xl md:text-6xl font-black text-gradient-primary tabular-nums w-16 text-center">
                                    {String(n.rank).padStart(2, "0")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-bold uppercase tracking-wider">{n.tag}</span>
                                        <span className="inline-flex items-center gap-1 text-xs text-primary font-bold"><Flame className="w-3 h-3" /> Trending</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-smooth">{n.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {n.views}</span>
                                        <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {n.comments}</span>
                                    </div>
                                </div>
                                <BookmarkButton item={{ id: n.id, title: n.title, href: `/trending#${n.id}`, sport: n.tag }} />
                            </article>
                        ))}
                        {items.length === 0 && <p className="text-muted-foreground text-center py-12">No trending stories in this sport.</p>}
                    </div>
                </section>
            </div>
        </BookmarksProvider>
    );
};

export default Trending;
