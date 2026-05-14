import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import Image from "next/image";
import { getStoryBySlug } from "@/lib/actions/story.actions";
import { redirect } from "next/navigation";
import { BookmarkButton } from "@/components/BookMarkButton";
import { StoryViewTracker } from "@/components/StoryViewTracker";
import { CommentsSection } from "@/components/CommentsSection";
import { auth } from "@/auth";
import { isStoryBookmarkedByUser } from "@/lib/actions/bookmark.actions";
import { getCommentsByStoryId } from "@/lib/actions/comment.actions";
import { StoryBody } from "@/components/editor/StoryBody";

const normalizeSportToSlug = (sport: string | null): string | undefined => {
  if (!sport) return undefined;
  const s = sport.toLowerCase().trim();

  if (s === "football") return "football";
  if (s === "basketball") return "basketball";
  if (s === "tennis") return "tennis";
  if (s.includes("f1") && s.includes("racing")) return "f1-racing";
  if (s === "cricket") return "cricket";
  if (s === "esports" || s.includes("esport")) return "esports";
  if (s === "boxing") return "boxing";
  if (s === "golf") return "golf";
  if (s === "athletics") return "athletics";

  return undefined;
};

export default async function NewsStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getStoryBySlug(slug);
  const post = data.data;

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <Link href="/news" className="text-primary hover:underline">
          ← Back to news
        </Link>
      </div>
    );
  }

  if (post.type === "ARTICLE") {
    redirect(`/articles/${post.slug}`);
  }

  const session = await auth();
  const userId = session?.user?.id;
  const initialSaved =
    userId != null
      ? await isStoryBookmarkedByUser(post.id, userId)
      : undefined;

  const commentsRes = await getCommentsByStoryId(post.id);
  const initialComments = commentsRes.success ? commentsRes.comments : [];

  const sportSlug = normalizeSportToSlug(post.sport);
  const sport = sportSlug ? SPORTS.find((s) => s.slug === sportSlug) : undefined;
  const trendingStories = sport?.trendingStories ?? [];

  const author = post.author;

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5 mx-auto px-8">
      <StoryViewTracker storyId={post.id} />

      <article className="relative col-span-2 min-h-[calc(100vh-8rem)] bg-background/50 before:absolute before:inset-0 before:grid-pattern before:opacity-20 mx-auto">
        <div className="container max-w-3xl py-12">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <BookmarkButton
              variant="labeled"
              initialSaved={initialSaved}
              item={{
                id: post.id,
                title: post.title,
                href: `/article/${post.slug}`,
                sport: post.sport ?? undefined,
                image: post.coverUrl ?? undefined,
                excerpt: post.excerpt ?? undefined,
              }}
            />
          </div>
          <div className="flex items-center gap-2 mb-4">
            {post.sport && (
              <span className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                {post.sport}
              </span>
            )}
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              news
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 animate-fade-in">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
          )}

          {post.coverUrl && (
            <div className="relative h-[50vh] overflow-hidden">
              <Image
                src={post.coverUrl}
                alt={post.title}
                height={600}
                width={1200}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
            </div>
          )}

          <Card className="flex flex-row items-center gap-4 p-4 mb-10 border-border/50 ">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{author?.fullName ?? "Editor"}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />{" "}
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </div>
            </div>
          </Card>

          <StoryBody content={post.content} />

          <CommentsSection storyId={post.id} initialComments={initialComments} />
        </div>
      </article>

      <section className="container max-w-3xl py-12 col-span-1 hidden lg:block">
        <div className="p-6 rounded-3xl bg-card border border-border">
          <h2 className="text-2xl font-bold mb-6">Trending in sport</h2>

          {trendingStories.length > 0 ? (
            <div className="space-y-4">
              {trendingStories.map((t, i) => (
                <Link
                  key={`${t.title}-${i}`}
                  href={sport ? `/categories/${sport.slug}` : "/trending"}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth"
                >
                  <div className="mt-0.5">
                    <div
                      className={[
                        "inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1",
                        t.heat === "High"
                          ? "bg-gradient-primary text-primary-foreground"
                          : t.heat === "Rising"
                            ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-primary-foreground"
                            : "bg-muted text-foreground",
                      ].join(" ")}
                    >
                      {t.heat}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold group-hover:text-primary transition-smooth line-clamp-2">
                      {t.title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {t.excerpt}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />{" "}
                        {t.time}
                      </span>
                      <span className="truncate">{t.source}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {sport && (
                <div className="pt-2">
                  <Link
                    href={`/categories/${sport.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline transition-smooth"
                  >
                    View more <span aria-hidden>→</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No trending stories available for this sport right now.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
