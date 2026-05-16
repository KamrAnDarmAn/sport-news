import { PageHeader } from "@/components/PageHeader";
import { SEO } from "@/components/SEO";
import { SPORT_LIST, storyCountForSport } from "@/lib/sports-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPublishedStoryCountsBySport } from "@/lib/actions/story.actions";

const Category = async () => {
    const res = await getPublishedStoryCountsBySport();
    const counts = res.success && res.data ? res.data : {};

    return (
        <div>
            <SEO title="All Sports Categories" description="Browse every sport covered by Pulse — football, basketball, tennis, F1, cricket, esports and more."
            // jsonLd={breadcrumbJsonLd([{ name: "Category", href: "/category" }])}
            />
            {/* <Breadcrumbs items={[{ name: "Category", href: "/category" }]} /> */}
            <PageHeader breadcrumbs={[{ name: "Category", href: "/category" }]} eyebrow="All Sports" title="Explore Every Category" subtitle="Pick your passion. Dive into curated coverage across every major sport on the planet." />
            <section className="container py-16 mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SPORT_LIST.map((c, i) => {
                        const count = storyCountForSport(counts, c.slug, c.name);
                        return (
                            <Link
                                key={c.slug}
                                href={`/categories/${c.slug}`}
                                style={{ animationDelay: `${i * 60}ms` }}
                                className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-fade-in overflow-hidden"
                            >
                                <div className="absolute -top-10 -right-10 text-9xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-smooth">{c.icon}</div>
                                <div className={`absolute -inset-px bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-10 transition-smooth`} />
                                <div className="relative">
                                    <div className="text-5xl mb-4">{c.icon}</div>
                                    <h3 className="text-2xl font-black mb-1">{c.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{c.tagline}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-bold">{count} stories</span>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-smooth">
                                            Explore <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Category;
