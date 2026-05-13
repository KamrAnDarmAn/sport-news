import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { SEO, breadcrumbJsonLd, newsArticleJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookmarkButton } from "@/components/BookMarkButton";
import Image from "next/image";
import Link from "next/link";
import { getStoryBySlug } from "@/lib/actions/story.actions";

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const data = await getStoryBySlug(slug);
    const author = data.data?.author;
    const post = data.data;

    if (!post) return (
        <div className="container py-20 text-center">
            <SEO title="Article not found" noIndex />
            <h1 className="text-3xl font-bold mb-4">Article not found</h1>
            <Link href="/news" className="text-primary hover:underline">← Back to news</Link>
        </div>
    );

    const url = `/article/${post.slug}`;
    const parent = post.type === "NEWS" ? { name: "News", href: "/news" } : { name: "Articles", href: "/articles" };
    const typeLabel = post.type === "NEWS" ? "news" : "article";

    return (
        <article className="animate-fade-in">
            <SEO
                title={post.title}
                description={post.excerpt ?? undefined}
                image={post.coverUrl ?? undefined}
                type="article"
                canonical={url}
                jsonLd={[
                    // breadcrumbJsonLd([parent, { name: post.title, href: `/article/${post.slug}` }]),
                    // newsArticleJsonLd({
                    //     title: post.title,
                    //     description: post.excerpt ?? undefined,
                    //     image: post.coverUrl ?? undefined,
                    //     datePublished: post.createdAt.toISOString(),
                    //     authorName: author?.fullName ?? undefined,
                    //     url,
                    // }),
                ]}
            />

            <Breadcrumbs items={[parent, { name: post.title, href: `/article/${post.slug}` }]} />

            {post.coverUrl && (
                <div className="relative h-[50vh] overflow-hidden mt-4">
                    <Image src={post.coverUrl} width={1200} height={600} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
                </div>
            )}
            <div className="container max-w-3xl py-12 mx-auto ">
                <div className="flex items-center justify-between mb-6">
                    <Link href={post.type === "NEWS" ? "/news" : "/articles"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <BookmarkButton
                        variant="labeled"
                        item={{ id: post.id, title: post.title, href: `/article/${post.slug}`, sport: post.sport ?? undefined, image: post.coverUrl ?? undefined, excerpt: post.excerpt ?? undefined }}
                    />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    {post.sport && <span className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">{post.sport}</span>}
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{typeLabel}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 animate-fade-in">{post.title}</h1>
                {post.excerpt && <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>}

                <Card className="flex items-center gap-4 p-4 mb-10 border-border/50 flex-row">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">{author?.fullName ?? "Editor"}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                        </div>
                    </div>
                </Card>

                <div className="prose prose-invert max-w-none prose-p:text-foreground/90 prose-headings:text-foreground prose-a:text-primary whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>
        </article>
    );
}
