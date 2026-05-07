import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { SPORTS } from "@/lib/sports-data";
import Image from "next/image";

interface Post {
    id: string; title: string; excerpt: string | null; content: string;
    cover_image_url: string | null; sport: string | null; type: string;
    created_at: string; author_id: string;
}
interface Profile { display_name: string | null; avatar_url: string | null; }

const post: Post = {
    id: "1",
    title: "The Thrilling Finale: Team A Clinches Victory in a Nail-Biting Match",
    author_id: "123",
    content: `In an electrifying showdown that had fans on the edge of their seats, Team A emerged victorious against Team B in a match that will be remembered for years to come. The game was a rollercoaster of emotions, with both teams showcasing incredible skill and determination.`,
    cover_image_url: 'https://source.unsplash.com/random/800x600?sports',
    created_at: new Date().toISOString(),
    excerpt: "Team A clinched a thrilling victory against Team B in a match filled with unforgettable moments and incredible skill.",
    sport: "Football",
    type: "news",
}

const author: Profile = {
    display_name: "John Doe",
    avatar_url: 'https://source.unsplash.com/random/100x100?face',
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const id = slug;
    const loading = false;


    if (loading) return <div className="container py-20 text-muted-foreground">Loading…</div>;
    if (!post) return (
        <div className="container py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Article not found</h1>
            <Link href="/news" className="text-primary hover:underline">← Back to news</Link>
        </div>
    );

    return (
        <article>
            {post.cover_image_url && (
                <div className="relative h-[50vh] overflow-hidden">
                    <Image src={post.cover_image_url} alt={post.title} height={200} width={40} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
                </div>
            )}
            <div className="container max-w-3xl py-12">
                <Link href={post.type === "news" ? "/news" : "/articles"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <div className="flex items-center gap-2 mb-4">
                    {post.sport && <span className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">{post.sport}</span>}
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{post.type}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 animate-fade-in">{post.title}</h1>
                {post.excerpt && <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>}

                <Card className="flex items-center gap-4 p-4 mb-10 border-border/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
                        {author?.avatar_url ? <Image src={author.avatar_url} height={40} width={40} alt="" className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">{author?.display_name ?? "Editor"}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
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
