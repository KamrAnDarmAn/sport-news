'use client'
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, User as UserIcon } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
import { SEO, breadcrumbJsonLd, newsArticleJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookmarkButton } from "@/components/BookMarkButton";
import { track } from "@/lib/analytics";
import Image from "next/image";
import Link from "next/link";
import { BookmarksProvider } from "@/hooks/use-bookmarks";

interface Post {
    id: string; title: string; excerpt: string | null; content: string;
    cover_image_url: string | null; sport: string | null; type: string;
    created_at: string; updated_at?: string; author_id: string; slug: string;
}
interface Profile { display_name: string | null; avatar_url: string | null; }

const post: Post = {
    id: '234',
    author_id: "234234",
    content: "The quick brown fox jumps, over the lazy dog",
    cover_image_url: '',
    created_at: Date.now().toString(),
    excerpt: "Hello world",
    slug: '21312',
    sport: ' foodball',
    title: "Hello world",
    type: 'Articale',
    updated_at: Date.now().toString()

}

const author: Profile = {
    avatar_url: '',
    display_name: "KamrAn"
}


export default function ArticleDetail() {
    const loading = false;


    if (loading) return <div className="container py-20 text-muted-foreground">Loading…</div>;
    if (!post) return (
        <div className="container py-20 text-center">
            <SEO title="Article not found" noIndex />
            <h1 className="text-3xl font-bold mb-4">Article not found</h1>
            <Link href="/news" className="text-primary hover:underline">← Back to news</Link>
        </div>
    );

    const url = typeof window !== "undefined" ? `${window.location.origin}/article/${post.slug}` : `/article/${post.slug}`;
    const parent = post.type === "news" ? { name: "News", href: "/news" } : { name: "Articles", href: "/articles" };

    return (
        <BookmarksProvider>
            <article>
                <SEO
                    title={post.title}
                    description={post.excerpt ?? undefined}
                    image={post.cover_image_url ?? undefined}
                    type="article"
                    canonical={url}
                    jsonLd={[
                        breadcrumbJsonLd([parent, { name: post.title, href: `/article/${post.slug}` }]),
                        newsArticleJsonLd({
                            title: post.title,
                            description: post.excerpt ?? undefined,
                            image: post.cover_image_url ?? undefined,
                            datePublished: post.created_at,
                            dateModified: post.updated_at,
                            authorName: author?.display_name ?? undefined,
                            url,
                        }),
                    ]}
                />

                <Breadcrumbs items={[parent, { name: post.title, href: `/article/${post.slug}` }]} />

                {post.cover_image_url && (
                    <div className="relative h-[50vh] overflow-hidden mt-4">
                        <Image src={post.cover_image_url} width={40} alt={post.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
                    </div>
                )}
                <div className="container max-w-3xl py-12 mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Link href={post.type === "news" ? "/news" : "/articles"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                        <BookmarkButton
                            variant="labeled"
                            item={{ id: post.id, title: post.title, href: `/article/${post.slug}`, sport: post.sport ?? undefined, image: post.cover_image_url ?? undefined, excerpt: post.excerpt ?? undefined }}
                        />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        {post.sport && <span className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">{post.sport}</span>}
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{post.type}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 animate-fade-in">{post.title}</h1>
                    {post.excerpt && <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>}

                    <Card className="flex items-center gap-4 p-4 mb-10 border-border/50">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
                            {author?.avatar_url ? <Image height={20} src={author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold">{author?.display_name ?? "Editor"}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                {/* <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(post.created_at).toString(), { addSuffix: true })} */}
                            </div>
                        </div>
                    </Card>

                    <div className="prose prose-invert max-w-none prose-p:text-foreground/90 prose-headings:text-foreground prose-a:text-primary whitespace-pre-wrap">
                        {post.content}
                    </div>
                </div>
            </article>
        </BookmarksProvider>
    );
}
