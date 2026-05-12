import { PageHeader } from "@/components/PageHeader";
import { getStories } from "@/lib/actions/story.actions";
import { Clock } from "lucide-react";
import Link from "next/link";

// const items = [
//     { time: "2 min ago", tag: "Football", title: "Manager confirms star striker fit for weekend clash", excerpt: "After two weeks on the sidelines, the talisman returns to full training..." },
//     { time: "18 min ago", tag: "NBA", title: "Trade deadline shake-up: three teams, six picks involved", excerpt: "A late-night blockbuster reshapes the playoff picture..." },
//     { time: "47 min ago", tag: "Tennis", title: "Wildcard upset rocks Madrid Open day one", excerpt: "Qualifier sends seeded star packing in straight sets..." },
//     { time: "1 hr ago", tag: "F1", title: "Team unveils radical aero package ahead of Imola", excerpt: "Engineers chase tenths with bold sidepod redesign..." },
//     { time: "2 hr ago", tag: "Cricket", title: "Young opener smashes maiden double-century", excerpt: "A breakthrough innings that signals a new era..." },
//     { time: "3 hr ago", tag: "Esports", title: "Worlds qualifier: underdog roster shocks favorites", excerpt: "An unranked squad punches their ticket to the main event..." },
// ];

const Recent = async () => {
    const recent = await getStories();
    if (!(recent).success)
        return <p>Stories not found</p>


    const items = recent.data?.items

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
            </section>
        </div>
    )
}

export default Recent;
