import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3, Flame, Radar, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SPORTS, getSportBySlug } from "@/lib/sports";

type SportPageProps = {
  params: Promise<{
    sport_name: string;
  }>;
};

const heatStyles = {
  High: "bg-gradient-primary text-primary-foreground",
  Medium: "bg-muted text-muted-foreground",
  Rising: "bg-gradient-electric text-primary-foreground",
} as const;

export async function generateStaticParams() {
  return SPORTS.map((sport) => ({
    sport_name: sport.slug,
  }));
}

export async function generateMetadata({
  params,
}: SportPageProps): Promise<Metadata> {
  const { sport_name } = await params;
  const sport = getSportBySlug(sport_name);

  if (!sport) {
    return {
      title: "Sport Not Found | Sport News",
    };
  }

  return {
    title: `${sport.name} News | Sport News`,
    description: sport.description,
  };
}

const SportPage = async ({ params }: SportPageProps) => {
  const { sport_name } = await params;
  const sport = getSportBySlug(sport_name);

  if (!sport) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        eyebrow={`${sport.icon} ${sport.name}`}
        title={`${sport.name} Coverage`}
        subtitle={sport.tagline}
      />

      <section className="container py-12 md:py-16 mx-auto px-4 md:px-0">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-border bg-card p-6 animate-fade-in">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Stories tracked
            </p>
            <p className="text-4xl font-black text-gradient-primary">{sport.stories}</p>
          </article>

          <article className="rounded-3xl border border-border bg-card p-6 animate-fade-in [animation-delay:70ms]">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Active events
            </p>
            <p className="text-4xl font-black">{sport.activeEvents}</p>
          </article>

          <article className="rounded-3xl border border-border bg-card p-6 animate-fade-in [animation-delay:140ms]">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Followers
            </p>
            <p className="text-4xl font-black">{sport.followers}</p>
          </article>

          <article className="rounded-3xl border border-border bg-card p-6 animate-fade-in [animation-delay:210ms]">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Pulse score
            </p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-black">{sport.pulseScore}</p>
              <span className="text-xs font-semibold text-accent mb-1">/100</span>
            </div>
          </article>
        </div>
      </section>

      <section className="container pb-16 grid gap-8 lg:grid-cols-3 mx-auto px-4 md:px-0">
        <article className="rounded-3xl border border-border bg-card p-7 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-primary" />
            <h2 className="text-2xl font-black">Trending in {sport.name}</h2>
          </div>

          <div className="space-y-4">
            {sport.trendingStories.map((story, index) => (
              <div
                key={story.title}
                style={{ animationDelay: `${index * 70}ms` }}
                className="rounded-2xl border border-border bg-background/40 p-5 animate-slide-in-right"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${heatStyles[story.heat]}`}
                  >
                    {story.heat}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="w-3 h-3" />
                    {story.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{story.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{story.excerpt}</p>
                <p className="text-xs font-semibold text-primary">{story.source}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-3xl border border-border bg-card p-7">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-primary" />
              <h2 className="text-xl font-black">Top Competitions</h2>
            </div>
            <div className="space-y-3">
              {sport.topLeagues.map((league, index) => (
                <div
                  key={league}
                  style={{ animationDelay: `${index * 65}ms` }}
                  className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3 animate-fade-in"
                >
                  <span className="font-semibold">{league}</span>
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-card p-7 ">
            <div className="flex items-center gap-2 mb-4">
              <Radar className="w-4 h-4 text-primary" />
              <h2 className="text-xl font-black">Upcoming</h2>
            </div>
            <div className="space-y-3">
              {sport.upcoming.map((fixture, index) => (
                <div
                  key={fixture.matchup}
                  style={{ animationDelay: `${index * 75}ms` }}
                  className="rounded-xl border border-border bg-background/40 p-4 animate-fade-in"
                >
                  <p className="font-bold">{fixture.matchup}</p>
                  <p className="text-xs text-muted-foreground">{fixture.competition}</p>
                  <p className="text-xs text-primary font-semibold mt-1">{fixture.kickoff}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="container pb-20 mx-auto px-4 md:px-0">
        <article className="rounded-3xl border border-border bg-card p-8">
          <h2 className="text-2xl font-black mb-3">About {sport.name}</h2>
          <p className="text-muted-foreground max-w-3xl">{sport.description}</p>
        </article>
      </section>
    </div>
  );
};

export default SportPage;
