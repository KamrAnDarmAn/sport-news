
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchParamsPager } from "@/components/SearchParamsPager";
import { getStories } from "@/lib/actions/story.actions";
import { Clock } from "lucide-react";
import Link from "next/link";

interface RecentProps {
    searchParams: Promise<{
        page?: string;
        pageSize?: string;
        query?: string;
        filter?: string;
    }>;
}

const Recent = async ({ searchParams }: RecentProps) => {
    const { page, pageSize, query, filter } = await searchParams;
    const pageNum = Number(page) || 1;
    const size = Number(pageSize) || 10;
    const sort = filter === "popular" ? "popular" : undefined;

    const { success, data } = await getStories({
        page: pageNum,
        pageSize: size,
        search: query?.trim() || undefined,
        sort,
        published: true,
    });

    if (!success || !data)
        return <p>Stories not found</p>;

    const { items, total, pageSize: ps } = data;
    const totalPages = Math.max(1, Math.ceil(total / ps));

    return (
        <div>
            <PageHeader
                eyebrow="Just In"
                title="Recent News"
                subtitle="The freshest drops from across the sporting world, updated by the minute."
                breadcrumbs={[{ name: "Recent News", href: "/recent" }]}

            />
            <section className="container py-16 max-w-4xl mx-auto">
                <div className="relative pl-8  border-l-2 border-border space-y-8">
                    {items.map((n, i) => (
                        <div key={n.id} style={{ animationDelay: `${i * 80}ms` }} className="relative animate-fade-in">
                            <div className="absolute -left-10.5 w-5 h-5 rounded-full bg-gradient-primary shadow-glow" />
                            <Link href={n.type === "NEWS" ? `/news/${n.slug}` : `/articles/${n.slug}`}>
                                <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-smooth cursor-pointer">
                                    <div className="flex items-center gap-3 mb-2 text-xs">
                                        <span className="inline-flex items-center gap-1 text-primary font-bold"><Clock className="w-3 h-3" /> {n.timeAgo}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-muted font-bold uppercase tracking-wider">{n.tag}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{n.title}</h3>
                                    <p className="text-sm text-muted-foreground">{n.excerpt}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <Suspense fallback={null}>
                    <SearchParamsPager page={pageNum} totalPages={totalPages} />
                </Suspense>
            </section>

        </div>
    );
};

export default Recent;
