import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { SPORTS } from "@/lib/sports";

const Category = () => (
    <div>
        <PageHeader eyebrow="All Sports" title="Explore Every Category" subtitle="Pick your passion. Dive into curated coverage across every major sport on the planet." />
        <section className="container py-16 mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {SPORTS.map((c, i) => (
                    <Link
                        key={c.slug}
                        href={`/sport/${c.slug}`}
                        style={{ animationDelay: `${i * 60}ms` }}
                        className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-fade-in overflow-hidden"
                    >
                        <div className="absolute -top-10 -right-10 text-9xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-smooth">{c.icon}</div>
                        <div className="relative">
                            <div className="text-5xl mb-4">{c.icon}</div>
                            <h3 className="text-2xl font-black mb-1">{c.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{c.tagline}</p>
                            <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-bold">{c.stories} stories</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    </div>
);

export default Category;
