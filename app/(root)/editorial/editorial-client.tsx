'use client'
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarClock, FileEdit, CheckCircle2, AlertCircle, PenLine, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import type { EditorialRow } from "@/lib/actions/story.actions";
import { deleteStory, publishStory, setStoryInReview, unpublishStory } from "@/lib/actions/story.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Status = "draft" | "review" | "scheduled" | "published";

const statusConfig: Record<Status, { label: string; icon: typeof FileEdit; tone: string }> = {
    draft: { label: "Draft", icon: FileEdit, tone: "bg-muted text-muted-foreground" },
    review: { label: "In Review", icon: AlertCircle, tone: "bg-amber-500/15 text-amber-500" },
    scheduled: { label: "Scheduled", icon: CalendarClock, tone: "bg-blue-500/15 text-blue-400" },
    published: { label: "Published", icon: CheckCircle2, tone: "bg-emerald-500/15 text-emerald-400" },
};

type Access = "ok" | "signedOut" | "forbidden";

export default function EditorialClient({
    items,
    access,
}: {
    items: EditorialRow[];
    access: Access;
}) {
    const [tab, setTab] = useState<Status | "all">("all");
    const [busyId, setBusyId] = useState<string | null>(null);
    const router = useRouter();

    if (access !== "ok") {
        return (
            <div className="container py-32 text-center">
                <SEO title="Editorial — Access Denied" noIndex />
                <h1 className="text-3xl font-black mb-4">Editor access required</h1>
                <p className="text-muted-foreground mb-6">
                    {access === "signedOut"
                        ? "Sign in to access the newsroom."
                        : "Sign in with an editor or admin account to access the newsroom."}
                </p>
                <Button asChild><Link href="/auth">Sign in</Link></Button>
            </div>
        );
    }

    const filtered = tab === "all" ? items : items.filter((i) => i.status === tab);
    const counts = items.reduce<Record<string, number>>((a, i) => ({ ...a, [i.status]: (a[i.status] || 0) + 1 }), {});

    const doDelete = async (id: string) => {
        setBusyId(id);
        try {
            const res = await deleteStory(id);
            if (!res.success) toast.error(res.message);
            else {
                toast.success("Deleted");
                router.refresh();
            }
        } finally {
            setBusyId(null);
        }
    };

    const doTogglePublish = async (row: EditorialRow) => {
        setBusyId(row.id);
        try {
            const res = row.status === "published" ? await unpublishStory(row.id) : await publishStory(row.id);
            if (!res.success) toast.error(res.message);
            else {
                toast.success(res.message);
                router.refresh();
            }
        } finally {
            setBusyId(null);
        }
    };

    const doToggleReview = async (row: EditorialRow) => {
        setBusyId(row.id);
        try {
            const next = row.status !== "review";
            const res = await setStoryInReview(row.id, next);
            if (!res.success) toast.error(res.message);
            else {
                toast.success(next ? "Sent to review" : "Moved to draft");
                router.refresh();
            }
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div>
            <SEO title="Editorial Workflow" description="Pulse newsroom — manage drafts, reviews, scheduled and published stories." noIndex
                jsonLd={breadcrumbJsonLd([{ name: "Editorial", href: "/editorial" }])} />
            <Breadcrumbs items={[{ name: "Editorial", href: "/editorial" }]} />
            <PageHeader eyebrow="Newsroom" title="Editorial Workflow" subtitle="Drafts, reviews, schedules and live stories — all in one calm place." />

            <section className="container py-12 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {(["draft", "review", "scheduled", "published"] as Status[]).map((s) => {
                        const cfg = statusConfig[s];
                        return (
                            <Card key={s} className="p-5 border-border/50">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.tone}`}>
                                    <cfg.icon className="w-3.5 h-3.5" /> {cfg.label}
                                </div>
                                <div className="mt-3 text-3xl font-black tabular-nums">{counts[s] ?? 0}</div>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <Tabs value={tab} onValueChange={(v) => setTab(v as Status | "all")}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="draft">Drafts</TabsTrigger>
                            <TabsTrigger value="review">Review</TabsTrigger>
                            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                        </TabsList>
                        <TabsContent value={tab} />
                    </Tabs>
                    <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow gap-1.5">
                        <Link href="/create"><PenLine className="w-4 h-4" /> New story</Link>
                    </Button>
                </div>

                <Card className="overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="col-span-5">Title</div>
                        <div className="col-span-2">Author</div>
                        <div className="col-span-2">Sport</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    {filtered.map((it) => {
                        const cfg = statusConfig[it.status];
                        return (
                            <div key={it.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-t border-border hover:bg-muted/20 transition-smooth">
                                <div className="col-span-12 md:col-span-5">
                                    <div className="font-bold">{it.title}</div>
                                    <div className="text-xs text-muted-foreground">Updated {it.updated}</div>
                                </div>
                                <div className="col-span-4 md:col-span-2 text-sm">{it.author}</div>
                                <div className="col-span-4 md:col-span-2 text-sm text-muted-foreground">{it.sport}</div>
                                <div className="col-span-4 md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={(e) => (e.shiftKey ? doToggleReview(it) : doTogglePublish(it))}
                                        disabled={busyId === it.id}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.tone} disabled:opacity-60`}
                                        title={it.status === "published" ? "Unpublish" : "Publish now (Shift: review)"}
                                    >
                                        <cfg.icon className="w-3 h-3" /> {cfg.label}
                                    </button>
                                </div>
                                <div className="col-span-12 md:col-span-1 flex justify-end gap-1">
                                    <Button size="icon" variant="ghost" aria-label="Preview" asChild>
                                        <Link href={`/article/${it.slug}`}><Eye className="w-4 h-4" /></Link>
                                    </Button>
                                    <Button size="icon" variant="ghost" aria-label="Edit" asChild>
                                        <Link href={`/create?edit=${it.id}`}><PenLine className="w-4 h-4" /></Link>
                                    </Button>
                                    <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => doDelete(it.id)} disabled={busyId === it.id}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground text-sm">Nothing here yet.</div>
                    )}
                </Card>
            </section>
        </div>
    );
}
