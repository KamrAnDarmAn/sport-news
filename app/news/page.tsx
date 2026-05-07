import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
    id: string; title: string; excerpt: string | null; content: string;
    cover_image_url: string | null; sport: string | null; type: string;
    created_at: string; author_id: string;
}
interface Profile { display_name: string | null; avatar_url: string | null; }

export default function ArticleDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [author, setAuthor] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        (async () => {
            const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
            setPost((data as Post) ?? null);
            if (data) {
                const { data: prof } = await supabase.from("profiles").select("display_name,avatar_url").eq("id", data.author_id).maybeSingle();
                setAuthor(prof as Profile);
            }
            setLoading(false);
        })();
    }, [slug]);

    if (loading) return <div className="container py-20 text-muted-foreground">Loading…</div>;
    if (!post) return (
        <div className="container py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Article not found</h1>
            <Link to="/news" className="text-primary hover:underline">← Back to news</Link>
        </div>
    );

    return (
        <article>
            {post.cover_image_url && (
                <div className="relative h-[50vh] overflow-hidden">
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
            )}
            <div className="container max-w-3xl py-12">
                <Link to={post.type === "news" ? "/news" : "/articles"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
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
                        {author?.avatar_url ? <img src={author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-5 h-5" />}
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
