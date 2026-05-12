
import { PageHeader } from "@/components/PageHeader";
import { Pager } from "@/components/Pager";
import { getStories } from "@/lib/actions/story.actions";
import { Clock } from "lucide-react";
import Link from "next/link";


const Recent = async ({ searchParams }: any) => {
    const { page, pageSize, query, filter } = await searchParams;
    const sort = filter === "popular" ? "popular" : "newest";
    const { success, data, error } = await getStories({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        search: query,
        sort: sort as any,
    });

    if (!success)
        return <p>Stories not found</p>


    const { items, total, hasMore } = data || {};


    return (
        <div>
            <PageHeader eyebrow="Just In" title="Recent News" subtitle="The freshest drops from across the sporting world, updated by the minute." />
            <section className="container py-16 max-w-4xl mx-auto">
                <div className="relative pl-8  border-l-2 border-border space-y-8">
                    {items && items.map((n, i) => (
                        <div key={i} style={{ animationDelay: `${i * 80}ms` }} className="relative animate-fade-in">
                            <div className="absolute -left-10.5 w-5 h-5 rounded-full bg-gradient-primary shadow-glow" />
                            <Link href={`news/${n.id}`}>
                                <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-smooth cursor-pointer">
                                    <div className="flex items-center gap-3 mb-2 text-xs">
                                        <span className="inline-flex items-center gap-1 text-primary font-bold"><Clock className="w-3 h-3" /> {n.time}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-muted font-bold uppercase tracking-wider">{n.tag}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{n.title}</h3>
                                    <p className="text-sm text-muted-foreground">{n.excerpt}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <Pager page={page || 1} total={pageSize} />
            </section>

        </div>
    )
}

export default Recent;
