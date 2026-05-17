import { PageHeader } from "@/components/PageHeader";
import { SEO } from "@/components/SEO";
import { Bookmark as BIcon, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getUserBookmarks } from "@/lib/actions/bookmark.actions";
import { redirect } from "next/navigation";


const Bookmarks = async () => {
    const data = await getUserBookmarks()
    if (!data.success)
        redirect('/')

    const { bookmarks } = data || {}

    return (
        <div>
            <SEO
                title="Your Bookmarks"
                description="Stories you've saved on Pulse — your personal feed of breaking news, tactics, and long reads."
                noIndex
            // jsonLd={breadcrumbJsonLd([{ name: "Bookmarks", href: "/bookmarks" }])}
            />
            <PageHeader eyebrow="Your Library" title="Saved Stories" subtitle="Your personal feed — every story you've bookmarked, in one place."
                breadcrumbs={[{ name: "Bookmarks", href: "/bookmarks" }]} />

            <section className="container py-12 mx-auto">
                {bookmarks && bookmarks.length === 0 ? (
                    <Card className="p-16 text-center max-w-xl mx-auto">
                        <BIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-2xl font-bold mb-2">Nothing saved yet</h3>
                        <p className="text-muted-foreground mb-6">Tap the bookmark icon on any story to keep it for later.</p>
                        <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                            <Link href="/news">Browse the latest news</Link>
                        </Button>
                    </Card>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-muted-foreground">{bookmarks && bookmarks.length} saved {bookmarks && bookmarks.length === 1 ? "story" : "stories"}</p>
                            {/* <Button variant="ghost" size="sm" onClick={clear} className="gap-1.5">
                                <Trash2 className="w-4 h-4" /> Clear all
                            </Button> */}
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarks && bookmarks.map((b, i) => (
                                <Card key={b.id} className="group overflow-hidden border-border/50 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                                    <Link href={`/article/${b.slug}`}>
                                        {b.coverUrl ? (
                                            <Image height={176} width={400} src={b.coverUrl} alt={b.title} className="w-full h-44 object-cover group-hover:scale-105 transition-smooth" />
                                        ) : (
                                            <div className="w-full h-44 bg-gradient-primary opacity-80" />
                                        )}
                                    </Link>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            {b.sport && <span className="px-2 py-0.5 rounded-full bg-muted font-semibold uppercase tracking-wider">{b.sport}</span>}
                                            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />Saved {b.timeAgo}</span>
                                        </div>
                                        <Link href={`/article/${b.slug}`}><h3 className="text-lg font-bold mb-2 group-hover:text-gradient-primary transition-smooth line-clamp-2">{b.title}</h3></Link>
                                        {b.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{b.excerpt}</p>}
                                        {/* <button onClick={() => remove(b.id)} className="text-xs font-bold text-muted-foreground hover:text-destructive transition-smooth inline-flex items-center gap-1">
                                            <Trash2 className="w-3 h-3" /> Remove
                                        </button> */}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default Bookmarks;
