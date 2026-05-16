'use client'
import { useEffect, useState } from "react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PenLine,
  Bookmark,
  Eye,
  FileText,
  Newspaper,
  TrendingUp,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getDashboardActivity, getStories } from "@/lib/actions/story.actions";
import { getUserBookmarks } from "@/lib/actions/bookmark.actions";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  slug: string;
  type: string;
  sport: string | null;
  published: boolean;
  created_at: string;
  cover_image_url: string | null;
}

const StatCard = ({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent?: string }) => (
  <Card className="p-5 border-border/50 hover:border-primary/40 transition-smooth">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ?? "bg-gradient-primary"} text-primary-foreground shadow-glow`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="text-3xl font-black tabular-nums">{value}</div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{label}</div>
  </Card>
);

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[] | undefined>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[] | null>(null);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const [activity, setActivity] = useState<{ icon: any; text: string; time: string }[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user ? session.user.role === 'ADMIN' : false;
  const loading = status === "loading";
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const mine = await getStories({
        authorId: user.id,
        pageSize: 50,
      });
      if (cancelled) return;
      if (mine.success && mine.data) {
        setMyPosts(
          mine.data.items.map((s) => ({
            id: s.id,
            title: s.title,
            slug: s.slug,
            type: s.type === "NEWS" ? "news" : "article",
            sport: s.sport,
            published: s.published,
            created_at: s.createdAt.toISOString(),
            cover_image_url: s.coverUrl,
          })),
        );
      } else setMyPosts([]);

      if (isAdmin) {
        const all = await getStories({ pageSize: 50 });
        if (cancelled) return;
        if (all.success && all.data) {
          setAllPosts(
            all.data.items.map((s) => ({
              id: s.id,
              title: s.title,
              slug: s.slug,
              type: s.type === "NEWS" ? "news" : "article",
              sport: s.sport,
              published: s.published,
              created_at: s.createdAt.toISOString(),
              cover_image_url: s.coverUrl,
            })),
          );
        } else setAllPosts([]);
      } else {
        setAllPosts(null);
      }

      // Get Book marks
      const data = await getUserBookmarks();
      if (!data.success)
        setBookmarks([])
      else {
        const { bookmarks } = data
        setBookmarks(bookmarks)
      }

    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, isAdmin]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const res = await getDashboardActivity();
      if (cancelled) return;
      if (!res.success || !res.data) {
        setActivity([]);
        return;
      }
      setActivity(
        res.data.map((a) => ({
          icon: a.kind === "bookmark" ? Bookmark : FileText,
          text: a.text,
          time: a.timeAgo,
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="container py-20 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user) return router.replace('/auth')

  const role = isAdmin ? "Admin" : myPosts && myPosts.length > 0 ? "Editor" : "Reader";
  const roleAccent =
    role === "Admin" ? "bg-gradient-to-br from-primary to-accent" : role === "Editor" ? "bg-blue-500" : "bg-emerald-500";
  const displayName = profile?.display_name || user.email?.split("@")[0] || "Friend";

  return (
    <div>
      <SEO
        title="Your Dashboard"
        description="Personal dashboard — track your bookmarks, drafts, and editorial activity on Pulse."
        noIndex
        jsonLd={breadcrumbJsonLd([{ name: "Dashboard", href: "/dashboard" }])}
      />
      <PageHeader
        eyebrow="Your space"
        title={`Welcome back, ${displayName}`}
        subtitle="Bookmarks, drafts and the stories that matter to you — all in one place."
        breadcrumbs={[{ name: "Dashboard", href: "/dashboard" }]}
      />

      <section className="container py-10 mx-auto">
        {/* Identity card */}
        <Card className="p-6 mb-8 flex flex-col md:flex-row md:items-center gap-5 border-border/60 bg-linear-to-br from-card to-muted/30">
          <div className={`w-16 h-16 rounded-2xl ${roleAccent} text-primary-foreground flex items-center justify-center text-2xl font-black shadow-glow`}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl font-black truncate">{displayName}</div>
            <div className="text-sm text-muted-foreground truncate">{user.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> {role}
            </span>
            {isAdmin && (
              <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-1.5">
                <Link href="/create"><PenLine className="w-4 h-4" /> New story</Link>
              </Button>
            )}
          </div>
        </Card>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Bookmark} label="Bookmarks" value={bookmarks.length} />
          {isAdmin ? (
            <>
              <StatCard icon={FileText} label="Your posts" value={myPosts.length} accent="bg-blue-500" />
              <StatCard icon={Newspaper} label="All posts" value={allPosts?.length ?? "—"} accent="bg-emerald-500" />
              <StatCard icon={Users} label="Team" value={3} accent="bg-amber-500" />
            </>
          ) : (
            <>
              <StatCard icon={Eye} label="Stories read" value={Math.max(bookmarks.length * 3, 12)} accent="bg-blue-500" />
              <StatCard icon={TrendingUp} label="Topics followed" value={new Set(bookmarks.map(b => b.sport).filter(Boolean)).size} accent="bg-emerald-500" />
              <StatCard icon={Sparkles} label="Streak (days)" value={4} accent="bg-amber-500" />
            </>
          )}
        </div>

        <Tabs defaultValue={isAdmin ? "all" : "bookmarks"}>
          <TabsList>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            {(isAdmin || (myPosts?.length ?? 0) > 0) && <TabsTrigger value="mine">My posts</TabsTrigger>}
            {isAdmin && <TabsTrigger value="all">All posts</TabsTrigger>}
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Bookmarks */}
          <TabsContent value="bookmarks" className="mt-6">
            {bookmarks.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Bookmark className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven&apos;t bookmarked anything yet.</p>
                <Button asChild variant="outline"><Link href="/news">Browse news</Link></Button>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks && bookmarks.length > 0 && bookmarks.slice(0, 9).map((b, i) => (

                  <Card key={b.id} className="group overflow-hidden border-border/50 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <Link href={`/article/${b.slug}`}>
                      {b.coverUrl ? (
                        <Image height={176} width={400} src={b.coverUrl} alt={b.title} className="w-full h-44 object-cover group-hover:scale-105 transition-smooth" />
                      ) : (
                        // <div className="w-full h-44 bg-gradient-primary opacity-80" />
                        <></>
                      )}
                    </Link>
                    <div className="px-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {b.sport && <span className="px-2 py-0.5 rounded-full bg-muted font-semibold uppercase tracking-wider">{b.sport}</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />Saved {b.timeAgo}</span>
                      </div>
                      <Link href={`/article/${b.slug}`}><h3 className="text-lg font-bold mb-2 group-hover:text-gradient-primary transition-smooth line-clamp-2">{b.title}</h3></Link>
                      {b.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{b.excerpt}</p>}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My posts */}
          <TabsContent value="mine" className="mt-6">
            {myPosts.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <PenLine className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven&apos;t published anything yet.</p>
                {isAdmin && <Button asChild><Link href="/create">Write your first story</Link></Button>}
              </Card>
            ) : (
              <PostsTable posts={myPosts} />
            )}
          </TabsContent>

          {/* All posts (admin) */}
          {isAdmin && (
            <TabsContent value="all" className="mt-6">
              {!allPosts ? <Skeleton className="h-40 w-full" /> : <PostsTable posts={allPosts} />}
            </TabsContent>
          )}

          {/* Activity feed (placeholder/local) */}
          <TabsContent value="activity" className="mt-6">
            <Card className="divide-y divide-border">
              {(activity.length > 0
                ? activity
                : [{ icon: Sparkles, text: "Welcome to Pulse — explore the editorial section", time: "today" }]
              ).map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <a.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-sm">{a.text}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.time}
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <QuickAction to="/news" icon={Newspaper} title="Latest news" desc="Catch up on today's headlines" />
          <QuickAction to="/category" icon={TrendingUp} title="Browse sports" desc="Find your favorite categories" />
          <QuickAction to="/bookmarks" icon={Bookmark} title="Saved stories" desc={`${bookmarks.length} saved`} />
        </div>
      </section>
    </div>
  );
}

const QuickAction = ({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) => (
  <Link href={to}>
    <Card className="p-5 h-full hover:border-primary/50 transition-smooth group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold flex items-center gap-1 group-hover:text-primary transition-smooth">
            {title} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        </div>
      </div>
    </Card>
  </Link>
);

const PostsTable = ({ posts }: { posts: Post[] }) => (
  <Card className="overflow-hidden">
    <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
      <div className="col-span-6">Title</div>
      <div className="col-span-2">Type</div>
      <div className="col-span-2">Status</div>
      <div className="col-span-2">Created</div>
    </div>
    {posts.map((p) => (
      <Link
        href={`/article/${p.slug}`}
        key={p.id}
        className="grid grid-cols-12 gap-4 items-center px-5 py-3 border-t border-border hover:bg-muted/20 transition-smooth"
      >
        <div className="col-span-12 md:col-span-6">
          <div className="font-semibold truncate">{p.title}</div>
          {p.sport && <div className="text-xs text-muted-foreground">{p.sport}</div>}
        </div>
        <div className="col-span-4 md:col-span-2 text-xs uppercase font-bold text-muted-foreground">{p.type}</div>
        <div className="col-span-4 md:col-span-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.published ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
            {p.published ? "Live" : "Draft"}
          </span>
        </div>
        <div className="col-span-4 md:col-span-2 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
        </div>
      </Link>
    ))}
  </Card>
);
