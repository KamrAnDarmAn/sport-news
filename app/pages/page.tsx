import { ArrowRight, Play, TrendingUp, Trophy, Newspaper, Zap } from "lucide-react";
import Link from "next/link";
import hero from "@/public/images/hero-sports.jpg";

const tickerItems = ["⚽ Madrid 3-1 Barcelona", "🏀 Lakers clinch playoff spot", "🏈 Chiefs eyeing 3-peat", "🎾 Sinner advances to final", "🏏 India tour SA announced", "🏎️ Verstappen on pole"];

const categories = [
    { name: "Football", icon: "⚽", count: 248, gradient: "from-orange-500 to-red-500" },
    { name: "Basketball", icon: "🏀", count: 184, gradient: "from-amber-500 to-orange-600" },
    { name: "Tennis", icon: "🎾", count: 96, gradient: "from-lime-400 to-green-600" },
    { name: "F1 Racing", icon: "🏎️", count: 72, gradient: "from-red-500 to-pink-600" },
    { name: "Cricket", icon: "🏏", count: 138, gradient: "from-blue-500 to-indigo-600" },
    { name: "Esports", icon: "🎮", count: 54, gradient: "from-purple-500 to-fuchsia-600" },
];

const Index = () => {
    return (
        <div>
            {/* HERO */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden">
                <img src={hero.src} alt="Football action" width={1600} height={900} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
                <div className="absolute inset-0 grid-pattern opacity-20" />

                <div className="container relative z-10 grid md:grid-cols-2 gap-12 items-center py-20">
                    <div className="animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/80 backdrop-blur border border-border text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Live Now · Match Day
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-6">
                            Feel the <span className="text-gradient-primary">Pulse</span><br /> of the Game.
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-lg mb-8">
                            Real-time scores, deep-dive stories, and the rankings that decide legacy. One place for every fan.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/trending" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-glow hover:scale-105 transition-smooth">
                                Explore Trending <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                            </Link>
                            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card/50 backdrop-blur font-bold hover:bg-muted transition-smooth">
                                <Play className="w-4 h-4 fill-current" /> Watch Highlights
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-12 max-w-md">
                            {[{ n: "12K+", l: "Articles" }, { n: "850+", l: "Clubs" }, { n: "24/7", l: "Live" }].map((s) => (
                                <div key={s.l}>
                                    <div className="text-3xl font-black text-gradient-primary">{s.n}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block animate-scale-in">
                        <div className="relative animate-float">
                            <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30" />
                            <div className="relative bg-card/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-glow">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold text-accent uppercase tracking-widest">● Live · 87'</span>
                                    <span className="text-xs text-muted-foreground">Champions League</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-center flex-1">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl mb-2">🦅</div>
                                        <div className="font-bold">Eagles FC</div>
                                    </div>
                                    <div className="text-5xl font-black tabular-nums">3 <span className="text-muted-foreground">:</span> 1</div>
                                    <div className="text-center flex-1">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mb-2">🐺</div>
                                        <div className="font-bold">Wolves SC</div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
                                    <span>Possession 62%</span><span>Shots 14</span><span>xG 2.8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TICKER */}
            <div className="border-y border-border bg-card/50 overflow-hidden py-3">
                <div className="flex gap-12 animate-marquee whitespace-nowrap">
                    {[...tickerItems, ...tickerItems].map((t, i) => (
                        <span key={i} className="text-sm font-semibold text-muted-foreground">{t}</span>
                    ))}
                </div>
            </div>

            {/* CATEGORIES */}
            <section className="container py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Pick your sport</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-2">Browse Categories</h2>
                    </div>
                    <Link href="/category" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-smooth">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((c, i) => (
                        <Link key={c.name} href="/category" style={{ animationDelay: `${i * 80}ms` }} className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary transition-smooth animate-fade-in">
                            <div className={`absolute -inset-px bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-smooth`} style={{ filter: "blur(20px)" }} />
                            <div className="relative">
                                <div className="text-4xl mb-3">{c.icon}</div>
                                <div className="font-bold">{c.name}</div>
                                <div className="text-xs text-muted-foreground">{c.count} stories</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FEATURE GRID */}
            <section className="container pb-24">
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: TrendingUp, title: "Trending Now", desc: "What every fan is talking about right this minute.", to: "/trending" },
                        { icon: Trophy, title: "Club Rankings", desc: "Live tables, form guides & power rankings.", to: "/rankings" },
                        { icon: Newspaper, title: "Deep Articles", desc: "Long-reads, tactics & exclusive interviews.", to: "/articles" },
                    ].map((f, i) => (
                        <Link key={f.title} href={f.to} style={{ animationDelay: `${i * 120}ms` }} className="group relative p-8 rounded-3xl bg-card border border-border overflow-hidden hover:shadow-glow transition-smooth animate-fade-in">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 blur-3xl group-hover:opacity-30 transition-smooth" />
                            <f.icon className="w-10 h-10 mb-4 text-primary" />
                            <h3 className="text-2xl font-black mb-2">{f.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                                Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container pb-24">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-16 text-center">
                    <div className="absolute inset-0 grid-pattern opacity-20" />
                    <Zap className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
                    <h2 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">Never miss a moment.</h2>
                    <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">Join 200K fans getting daily highlights, rankings, and exclusives.</p>
                    <button className="px-8 py-4 rounded-full bg-background text-foreground font-bold hover:scale-105 transition-smooth shadow-2xl">Get Started Free</button>
                </div>
            </section>
        </div>
    );
};

export default Index;
