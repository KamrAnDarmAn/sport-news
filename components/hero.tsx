import { getTotalStories } from "@/lib/actions/story.actions";
import hero from "@/public/images/hero-sports.jpg";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const Hero = async () => {
    const storiesCount = await getTotalStories()
    return (
        <section className="relative min-h-[92vh]   flex items-center justify-center overflow-hidden text-white">

            <Image src={hero} alt="Football action" width={1600} height={900} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-50 from-black  via-background/60 to-background/30" />
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="container relative z-10 grid md:grid-cols-2 gap-12 items-center py-20">
                <div className="animate-fade-in">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-    /80 backdrop-blur border border-border text-xs font-bold uppercase tracking-widest mb-6">
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
                        {/* <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card/50 backdrop-blur font-bold hover:bg-muted transition-smooth">
                            <Play className="w-4 h-4 fill-current" /> Watch Highlights
                        </button> */}
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-12 max-w-md ">
                        {
                            // { n: "850+", l: "Clubs" },
                            [{ n: `${storiesCount.success ? storiesCount.total : '__'}+`, l: "Articles" }, { n: "24/7", l: "Live" }].map((s) => (
                                <div key={s.l}>
                                    <div className="text-4xl font-black text-gradient-primary ">{s.n}</div>
                                    <div className="text-sm  uppercase tracking-wider ">{s.l}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Currnet top rank match */}
                <div className="hidden md:block animate-scale-in">
                    <div className="relative animate-float">
                        <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30" />
                        <div className="relative bg-card/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-glow">
                            <div className="flex items-center justify-between mb-4">
                                {/* <span className="text-xs font-bold text-accent uppercase tracking-widest">● Live · 87'</span> */}
                                <span className="text-xs font-bold text-accent uppercase tracking-widest">● Live · <span className="font-extrabold text-lg">__</span> </span>
                                {/* <span className="text-xs text-muted-foreground">Champions League</span> */}
                                <span className="text-xs text-muted-foreground">__ League</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-center flex-1">
                                    {/* <div className="w-16 h-16 mx-auto rounded-full bg-linear-120-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl mb-2">🦅</div>
                                    <div className="font-bold">Eagles FC</div> */}
                                    <h1 className="text-3xl text-gradient-primary animate-bounce duration-1000 ">coming</h1>
                                </div>
                                {/* <div className="text-5xl font-black tabular-nums">3 <span className="text-muted-foreground">:</span> 1</div> */}
                                <div className="text-5xl font-black tabular-nums">_ <span className="text-muted-foreground">:</span> _</div>
                                <div className="text-center flex-1">
                                    {/* <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mb-2">🐺</div>
                                    <div className="font-bold">Wolves SC</div> */}
                                    <h1 className="text-3xl text-gradient-primary animate-bounce duration-1000 ">Soon</h1>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
                                {/* <span>Possession 62%</span><span>Shots 14</span><span>xG 2.8</span> */}
                                <span>Possession __%</span><span>Shots __</span><span>xG __</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Hero