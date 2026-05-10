'use client'
import { ArrowLeft, ArrowRight, Clock, Star, Trophy } from "lucide-react";
import { SPORTS, SPORT_LIST } from "@/lib/sports-data";
import { PageHeader } from "@/components/PageHeader";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useParams } from "next/navigation";
import Link from "next/link";

const SportDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const sportName = slug;
  const sport = sportName ? SPORTS[sportName.toLowerCase()] : undefined;

  if (!sport) {
    return (
      <div className="container py-32 text-center">
        <SEO title="Sport not found" noIndex />
        <div className="text-6xl mb-4">🤷</div>
        <h1 className="text-4xl font-black mb-3">Sport not found</h1>
        <p className="text-muted-foreground mb-8">We don't cover "{sportName}" yet.</p>
        <Link href="/category" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-glow">
          <ArrowLeft className="w-4 h-4" /> Browse all sports
        </Link>
      </div>
    );
  }

  const others = SPORT_LIST.filter((s) => s.slug !== sport.slug).slice(0, 5);
  const crumbs = [{ name: "Category", href: "/category" }, { name: sport.name, href: `/sport/${sport.slug}` }];

  return (
    <div className="mx-auto">
      <SEO
        title={`${sport.name} News & Coverage`}
        description={sport.description}
        canonical={typeof window !== "undefined" ? `${window.location.origin}/sport/${sport.slug}` : undefined}
        jsonLd={breadcrumbJsonLd(crumbs)}
      />
      <Breadcrumbs items={crumbs} />
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border mx-auto">
        <div className={`absolute inset-0 bg-gradient-to-br ${sport.gradient} opacity-20`} />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-primary blur-3xl opacity-20 animate-float" />
        <div className="container relative py-20 md:py-28 animate-fade-in">
          <Link href="/category" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-8">
            <ArrowLeft className="w-4 h-4" /> All categories
          </Link>
          <div className="flex items-start gap-6 flex-wrap">
            <div className="text-8xl md:text-9xl animate-float">{sport.icon}</div>
            <div className="flex-1 min-w-0">
              <span className="inline-block px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-bold uppercase tracking-widest mb-4">
                {sport.tagline}
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mb-4">
                {sport.name.split(" ").map((w, i, arr) => (
                  <span key={i} className={i === arr.length - 1 ? "text-gradient-primary" : ""}>
                    {w}{i < arr.length - 1 ? " " : ""}
                  </span>
                ))}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-6">{sport.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-bold">{sport.count} stories</span>
                <span className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-bold">Live coverage</span>
                <span className="px-3 py-1.5 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold">Editor's pick</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container py-16 grid lg:grid-cols-3 gap-10">
        {/* News */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">Top {sport.name} News</h2>
            <Link href="/trending" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {sport.topNews.map((n, i) => (
              <article key={i} style={{ animationDelay: `${i * 80}ms` }} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-fade-in">
                <div className="flex items-center gap-3 mb-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-primary font-bold"><Clock className="w-3 h-3" /> {n.time}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted font-bold uppercase tracking-wider">{sport.name}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-gradient-primary transition-smooth">{n.title}</h3>
                <p className="text-sm text-muted-foreground">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="p-6 rounded-3xl bg-card border border-border">
            <h3 className="text-lg font-black mb-4 inline-flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Top Performers</h3>
            <ul className="space-y-3">
              {sport.topPlayers.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${i === 0 ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-muted"}`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.team}</div>
                  </div>
                  <div className="text-xs font-bold text-primary tabular-nums">{p.stat}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <Trophy className="w-8 h-8 mb-3 relative" />
            <h3 className="text-xl font-black mb-2 relative">Follow {sport.name}</h3>
            <p className="text-sm opacity-90 mb-4 relative">Get instant alerts for every {sport.name.toLowerCase()} story that matters.</p>
            <button className="relative px-5 py-2.5 rounded-full bg-background text-foreground font-bold text-sm hover:scale-105 transition-smooth">Subscribe Free</button>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border">
            <h3 className="text-lg font-black mb-4">Other Sports</h3>
            <div className="space-y-2">
              {others.map((o) => (
                <Link key={o.slug} href={`/sport/${o.slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-smooth group">
                  <span className="text-2xl">{o.icon}</span>
                  <span className="font-semibold text-sm flex-1 group-hover:text-primary transition-smooth">{o.name}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default SportDetail;
