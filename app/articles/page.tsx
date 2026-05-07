import { PageHeader } from "@/components/PageHeader";
import { ArrowUpRight, BookOpen } from "lucide-react";

const articles = [
  { tag: "Tactics", read: "12 min", title: "The False 9 Renaissance: How modern teams are reinventing Cruyff's idea", author: "M. Calvo" },
  { tag: "Long Read", read: "18 min", title: "Inside the academy that quietly produces half of Europe's top defenders", author: "S. Okafor" },
  { tag: "Interview", read: "8 min", title: "On burnout, comebacks, and what's next: a candid sit-down", author: "L. Tanaka" },
  { tag: "Data", read: "10 min", title: "xG isn't enough anymore — meet the metrics shaping 2026", author: "R. Patel" },
  { tag: "Culture", read: "15 min", title: "Ultras 2.0: how fan culture is being rewritten by Gen Z", author: "A. Nowak" },
  { tag: "Opinion", read: "6 min", title: "Why the salary cap conversation is finally serious", author: "J. Brooks" },
];

const Articles = () => (
  <div>
    <PageHeader eyebrow="Long Reads" title="Sports Articles" subtitle="Tactics, culture, data and stories — written by reporters who actually love the sport." />
    <section className="container py-16 mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((a, i) => (
          <article key={i} style={{ animationDelay: `${i * 80}ms` }} className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary hover:shadow-glow transition-smooth cursor-pointer animate-scale-in overflow-hidden">
            <div className="absolute top-6 right-6">
              <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-smooth" />
            </div>
            <div className="flex items-center gap-3 mb-4 text-xs">
              <span className="px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground font-bold uppercase tracking-wider">{a.tag}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><BookOpen className="w-3 h-3" /> {a.read} read</span>
            </div>
            <h3 className="text-2xl font-black leading-tight mb-4 group-hover:text-gradient-primary transition-smooth">{a.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-7 h-7 rounded-full bg-gradient-electric" />
              <span>By <span className="font-semibold text-foreground">{a.author}</span></span>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default Articles;
