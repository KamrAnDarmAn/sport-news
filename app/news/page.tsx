'use client'
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { Pager } from "@/components/Pager";
import { BookmarkButton } from "@/components/BookMarkButton";
import { Card } from "@/components/ui/card";
import { Newspaper, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { track } from "@/lib/analytics";

interface Post {
    id: string; title: string; slug: string; excerpt: string | null;
    cover_image_url: string | null; sport: string | null; type: "news" | "article"; created_at: string;
}

const SPORTS = ["all", "football", "basketball", "tennis", "f1-racing", "cricket", "esports"];
const PAGE_SIZE = 9;

export default function News() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [sport, setSport] = useState("all");
    const [page, setPage] = useState(1);



    useEffect(() => { setPage(1); }, [q, sport]);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        return posts.filter((p) => {
            if (sport !== "all" && p.sport?.toLowerCase() !== sport) return false;
            if (!needle) return true;
            return p.title.toLowerCase().includes(needle) || p.excerpt?.toLowerCase().includes(needle);
        });
    }, [posts, q, sport]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <SEO
                title="Breaking Sports News"
                description="Live, breaking sports news as it happens. Football, basketball, tennis, F1, cricket and more on Pulse."
                jsonLd={breadcrumbJsonLd([{ name: "News", href: "/news" }])}
            />
            <Breadcrumbs items={[{ name: "News", href: "/news" }]} />
            <PageHeader eyebrow="Live Wire" title="Breaking News" subtitle="Every story as it happens — straight from the touchline." />

            <section className="container py-12">
                <div className="grid gap-4 mb-8">
                    <SearchBar value={q} onChange={(v) => { setQ(v); if (v.length > 2) track("search", { q: v, scope: "news" }); }} placeholder="Search breaking news…" />
                    <FilterChips
                        label="Sport"
                        options={SPORTS.map((s) => ({ value: s, label: s === "all" ? "All sports" : s.replace("-", " ") }))}
                        value={sport}
                        onChange={(v) => { setSport(v); track("filter_change", { sport: v, scope: "news" }); }}
                    />
                    {!loading && (
                        <p className="text-xs text-muted-foreground">
                            {filtered.length} {filtered.length === 1 ? "story" : "stories"}
                            {q && <> matching "<span className="text-foreground font-semibold">{q}</span>"</>}
                        </p>
                    )}
                </div>

                {loading ? (
                    <p className="text-muted-foreground">Loading…</p>
                ) : filtered.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-bold mb-2">No stories match</h3>
                        <p className="text-muted-foreground">Try a different search term or filter.</p>
                    </Card>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paged.map((p, i) => (
                                <div key={p.id} className="group relative animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                                    <Link to={`/article/${p.slug}`} onClick={() => track("article_open", { id: p.id, scope: "news" })}>
                                        <Card className="overflow-hidden h-full hover:shadow-glow transition-smooth border-border/50">
                                            {p.cover_image_url ? (
                                                <img src={p.cover_image_url} alt={p.title} className="w-full h-48 object-cover group-hover:scale-105 transition-smooth" />
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-primary opacity-80" />
                                            )}
                                            <div className="p-5">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                    {p.sport && <span className="px-2 py-0.5 rounded-full bg-muted font-semibold uppercase tracking-wider">{p.sport}</span>}
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
                                                </div>
                                                <h3 className="text-lg font-bold mb-2 group-hover:text-gradient-primary transition-smooth line-clamp-2">{p.title}</h3>
                                                {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                                            </div>
                                        </Card>
                                    </Link>
                                    <div className="absolute top-3 right-3">
                                        <BookmarkButton item={{ id: p.id, title: p.title, href: `/article/${p.slug}`, sport: p.sport ?? undefined, image: p.cover_image_url ?? undefined, excerpt: p.excerpt ?? undefined }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pager page={page} total={totalPages} onChange={(p) => { setPage(p); track("paginate", { page: p, scope: "news" }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                    </>
                )}
            </section>
        </div>
    );
}
