import Hero from "@/components/hero";
import Ticker from "@/components/ticker";
import { ArrowRight, TrendingUp, Trophy, Newspaper, Zap } from "lucide-react";

import Link from "next/link";
import { getPublishedStoryCountsBySport } from "@/lib/actions/story.actions";
import { storyCountForSport } from "@/lib/sports-data";

const categories = [
  { name: "Football", slug: "football", icon: "⚽", count: 248, gradient: "from-orange-500 to-red-500" },
  { name: "Basketball", slug: "basketball", icon: "🏀", count: 184, gradient: "from-amber-500 to-orange-600" },
  { name: "Tennis", slug: "tennis", icon: "🎾", count: 96, gradient: "from-lime-400 to-green-600" },
  { name: "F1 Racing", slug: "f1-racing", icon: "🏎️", count: 72, gradient: "from-red-500 to-pink-600" },
  { name: "Cricket", slug: "cricket", icon: "🏏", count: 138, gradient: "from-blue-500 to-indigo-600" },
  { name: "Esports", slug: "esports", icon: "🎮", count: 54, gradient: "from-purple-500 to-fuchsia-600" },
];

const Index = async () => {
  const res = await getPublishedStoryCountsBySport();
  const counts = res.success && res.data ? res.data : {};

  return (
    <div>
      <Hero />
      <Ticker />

      <section className="container py-24 mx-auto px-4 md:px-0">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Pick your sport</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2">Browse Categories</h2>
          </div>
          <Link href="/categories" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-smooth">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {categories.map((c, i) => {
            const liveCount = storyCountForSport(counts, c.slug, c.name);
            const displayCount = liveCount > 0 ? liveCount : c.count;
            return (
              <Link key={c.name} href={`/categories/${c.slug}`} style={{ animationDelay: `${i * 80}ms` }} className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary transition-smooth animate-fade-in">
                <div className={`absolute -inset-px bg-linear-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-smooth`} style={{ filter: "blur(20px)" }} />
                <div className="relative">
                  <div className="text-4xl mb-3">{c.icon}</div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{displayCount} stories</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container pb-24 mx-auto px-4 md:px-0">
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

      <section className="container pb-24 mx-auto px-4 md:px-0">
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
