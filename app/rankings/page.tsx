import { PageHeader } from "@/components/PageHeader";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const clubs = [
    { rank: 1, name: "Manchester City", crest: "🔵", points: 89, change: 0, form: "WWWDW" },
    { rank: 2, name: "Real Madrid", crest: "⚪", points: 87, change: 1, form: "WWWWW" },
    { rank: 3, name: "Bayern Munich", crest: "🔴", points: 84, change: -1, form: "WWLWW" },
    { rank: 4, name: "PSG", crest: "🔷", points: 81, change: 2, form: "WWWWD" },
    { rank: 5, name: "Liverpool", crest: "🔻", points: 78, change: 0, form: "WDWWW" },
    { rank: 6, name: "Inter Milan", crest: "🔵", points: 75, change: -2, form: "DWWLW" },
    { rank: 7, name: "Arsenal", crest: "🔴", points: 73, change: 1, form: "WWLWD" },
    { rank: 8, name: "Barcelona", crest: "🟦", points: 71, change: -1, form: "WLWWW" },
];

const ChangeIcon = ({ c }: { c: number }) =>
    c > 0 ? <TrendingUp className="w-4 h-4 text-accent" /> :
        c < 0 ? <TrendingDown className="w-4 h-4 text-destructive" /> :
            <Minus className="w-4 h-4 text-muted-foreground" />;

const Rankings = () => (
    <div>
        <PageHeader eyebrow="Power Index" title="Clubs Rankings" subtitle="Live power rankings updated weekly using form, results, and our Pulse algorithm." />
        <section className="container py-16 mx-auto">
            <div className="rounded-3xl bg-card border border-border overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-5">Club</div>
                    <div className="col-span-2 text-center">Points</div>
                    <div className="col-span-2 text-center">Form</div>
                    <div className="col-span-2 text-center">Move</div>
                </div>
                {clubs.map((c, i) => (
                    <div key={c.rank} style={{ animationDelay: `${i * 50}ms` }} className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-t border-border hover:bg-muted/30 transition-smooth animate-fade-in">
                        <div className="col-span-2 md:col-span-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${c.rank <= 3 ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-muted"}`}>
                                {c.rank}
                            </div>
                        </div>
                        <div className="col-span-7 md:col-span-5 flex items-center gap-3">
                            <span className="text-2xl">{c.crest}</span>
                            <span className="font-bold">{c.name}</span>
                        </div>
                        <div className="col-span-3 md:col-span-2 text-center font-black text-xl tabular-nums">{c.points}</div>
                        <div className="hidden md:flex col-span-2 justify-center gap-1">
                            {c.form.split("").map((r, j) => (
                                <span key={j} className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${r === "W" ? "bg-accent/20 text-accent" : r === "L" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}>{r}</span>
                            ))}
                        </div>
                        <div className="hidden md:flex col-span-2 justify-center items-center gap-1 text-sm font-bold">
                            <ChangeIcon c={c.change} />
                            {c.change !== 0 && <span>{Math.abs(c.change)}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
);

export default Rankings;
