export type SportKey =
  | "football"
  | "basketball"
  | "tennis"
  | "f1-racing"
  | "cricket"
  | "esports"
  | "boxing"
  | "golf"
  | "athletics";

export interface SportStory {
  title: string;
  excerpt: string;
  source: string;
  time: string;
  heat: "High" | "Medium" | "Rising";
}

export interface SportFixture {
  matchup: string;
  competition: string;
  kickoff: string;
}

export interface SportProfile {
  slug: SportKey;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  stories: number;
  activeEvents: number;
  followers: string;
  pulseScore: number;
  topLeagues: string[];
  upcoming: SportFixture[];
  trendingStories: SportStory[];
}

export const SPORTS: SportProfile[] = [
  {
    slug: "football",
    name: "Football",
    icon: "⚽",
    tagline: "The global game never sleeps.",
    description:
      "From title races to transfer sagas, get minute-by-minute football coverage across every major league and tournament.",
    stories: 248,
    activeEvents: 17,
    followers: "1.9M",
    pulseScore: 97,
    topLeagues: ["Premier League", "La Liga", "Champions League", "Serie A"],
    upcoming: [
      { matchup: "Arsenal vs Liverpool", competition: "Premier League", kickoff: "Today, 20:30" },
      { matchup: "Inter vs Juventus", competition: "Serie A", kickoff: "Tomorrow, 21:00" },
      { matchup: "PSG vs Marseille", competition: "Ligue 1", kickoff: "Fri, 19:45" },
    ],
    trendingStories: [
      {
        title: "Late winner decides thriller in the final seconds",
        excerpt: "A dramatic stoppage-time finish sends shockwaves through the title race.",
        source: "Pulse Live Desk",
        time: "14 min ago",
        heat: "High",
      },
      {
        title: "Manager confirms star playmaker returns to training",
        excerpt: "Medical staff green-light a possible comeback this weekend.",
        source: "Matchday Wire",
        time: "42 min ago",
        heat: "Rising",
      },
      {
        title: "Transfer battle heats up for breakout winger",
        excerpt: "Three European giants are preparing offers before the window opens.",
        source: "Transfer Central",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "basketball",
    name: "Basketball",
    icon: "🏀",
    tagline: "Playoff pressure and hardwood drama.",
    description:
      "Track every buzzer-beater, trade move, and tactical adjustment from pro basketball leagues around the world.",
    stories: 184,
    activeEvents: 9,
    followers: "1.3M",
    pulseScore: 92,
    topLeagues: ["NBA", "EuroLeague", "WNBA", "NCAA"],
    upcoming: [
      { matchup: "Celtics vs Bucks", competition: "NBA Playoffs", kickoff: "Tonight, 02:00" },
      { matchup: "Real Madrid vs Fenerbahce", competition: "EuroLeague", kickoff: "Thu, 19:00" },
      { matchup: "Aces vs Liberty", competition: "WNBA", kickoff: "Sat, 22:30" },
    ],
    trendingStories: [
      {
        title: "Historic comeback rewrites conference final narrative",
        excerpt: "A 21-point deficit erased behind elite defense and late-game shotmaking.",
        source: "Court Report",
        time: "11 min ago",
        heat: "High",
      },
      {
        title: "Trade rumor links all-star guard to title contender",
        excerpt: "Front offices are circling ahead of a potentially chaotic deadline.",
        source: "Insider Board",
        time: "35 min ago",
        heat: "Rising",
      },
      {
        title: "Rookie center posts another double-double streak",
        excerpt: "The first-year big continues to dominate in paint touches and rebounds.",
        source: "Numbers Lab",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "tennis",
    name: "Tennis",
    icon: "🎾",
    tagline: "Every rally, every surface, every slam.",
    description:
      "Stay locked into ATP, WTA, and Grand Slam headlines with deep match analysis and player insights.",
    stories: 96,
    activeEvents: 6,
    followers: "830K",
    pulseScore: 86,
    topLeagues: ["ATP Tour", "WTA Tour", "Grand Slams", "Davis Cup"],
    upcoming: [
      { matchup: "Sinner vs Alcaraz", competition: "French Open SF", kickoff: "Tomorrow, 16:00" },
      { matchup: "Swiatek vs Sabalenka", competition: "French Open SF", kickoff: "Tomorrow, 18:30" },
      { matchup: "Medvedev vs Zverev", competition: "ATP Masters", kickoff: "Sun, 15:00" },
    ],
    trendingStories: [
      {
        title: "Qualifier stuns seeded favorite in straight sets",
        excerpt: "A fearless baseline performance produces one of the season's biggest upsets.",
        source: "Baseline Beat",
        time: "27 min ago",
        heat: "High",
      },
      {
        title: "Coach change sparks immediate tactical shift",
        excerpt: "A more aggressive return position is already paying off in key points.",
        source: "Serve + Volley",
        time: "1 hr ago",
        heat: "Rising",
      },
      {
        title: "Injury update clears top contender for next round",
        excerpt: "Medical scans reveal no structural damage after yesterday's timeout.",
        source: "Tour Medical",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "f1-racing",
    name: "F1 Racing",
    icon: "🏎️",
    tagline: "Milliseconds decide everything.",
    description:
      "From pit wall strategy to qualifying chaos, follow Formula 1 with precision-driven race analysis.",
    stories: 72,
    activeEvents: 4,
    followers: "790K",
    pulseScore: 84,
    topLeagues: ["Formula 1", "Formula 2", "Formula E", "WEC"],
    upcoming: [
      { matchup: "Monaco Grand Prix", competition: "Formula 1", kickoff: "Sun, 14:00" },
      { matchup: "Barcelona Sprint", competition: "Formula 2", kickoff: "Sat, 12:20" },
      { matchup: "Berlin E-Prix", competition: "Formula E", kickoff: "Sat, 15:00" },
    ],
    trendingStories: [
      {
        title: "Pole fight decided by less than a tenth",
        excerpt: "A last-lap flyer changes the front row in the final sector.",
        source: "Paddock Feed",
        time: "19 min ago",
        heat: "High",
      },
      {
        title: "Team unveils aggressive aero upgrade package",
        excerpt: "New floor geometry targets more stability at medium-speed corners.",
        source: "Tech Notebook",
        time: "44 min ago",
        heat: "Rising",
      },
      {
        title: "Driver market rumor links veteran to surprise seat",
        excerpt: "Contract talks intensify before summer break decisions.",
        source: "Grid Insider",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "cricket",
    name: "Cricket",
    icon: "🏏",
    tagline: "From Tests to T20 fireworks.",
    description:
      "All-format cricket coverage featuring match reports, squad analysis, and player-performance breakdowns.",
    stories: 138,
    activeEvents: 8,
    followers: "1.1M",
    pulseScore: 90,
    topLeagues: ["ICC", "IPL", "The Ashes", "Big Bash"],
    upcoming: [
      { matchup: "India vs South Africa", competition: "ODI Series", kickoff: "Today, 17:00" },
      { matchup: "England vs Australia", competition: "The Ashes", kickoff: "Fri, 11:00" },
      { matchup: "Mumbai vs Chennai", competition: "IPL", kickoff: "Sat, 20:00" },
    ],
    trendingStories: [
      {
        title: "Young opener smashes career-best double century",
        excerpt: "A fearless innings lifts the hosts into a dominant match position.",
        source: "Pitch Report",
        time: "8 min ago",
        heat: "High",
      },
      {
        title: "Selectors announce bold squad for away tour",
        excerpt: "A new pace attack leads a transition-focused selection strategy.",
        source: "Selection Watch",
        time: "32 min ago",
        heat: "Rising",
      },
      {
        title: "Captain hints at batting order reshuffle",
        excerpt: "Team management considers promoting an in-form finisher.",
        source: "Dressing Room",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "esports",
    name: "Esports",
    icon: "🎮",
    tagline: "Digital arenas, real pressure.",
    description:
      "Follow major esports tournaments, roster moves, and strategy shifts from every top title.",
    stories: 54,
    activeEvents: 5,
    followers: "640K",
    pulseScore: 79,
    topLeagues: ["Valorant Champions", "LoL Worlds", "CS2 Majors", "Dota Pro Circuit"],
    upcoming: [
      { matchup: "Sentinels vs Fnatic", competition: "Valorant Masters", kickoff: "Tonight, 23:00" },
      { matchup: "T1 vs G2", competition: "MSI", kickoff: "Thu, 12:00" },
      { matchup: "Navi vs Vitality", competition: "CS2 Major", kickoff: "Sun, 18:00" },
    ],
    trendingStories: [
      {
        title: "Underdog roster upsets title favorites",
        excerpt: "A tactical masterclass sends a lower-seeded squad into the grand final.",
        source: "GG Desk",
        time: "13 min ago",
        heat: "High",
      },
      {
        title: "Star duelist signs long-term contract extension",
        excerpt: "The franchise centerpiece commits through the next competitive cycle.",
        source: "Roster Wire",
        time: "39 min ago",
        heat: "Rising",
      },
      {
        title: "Patch changes reshape meta before playoffs",
        excerpt: "Coaches scramble to adjust map pools and composition priorities.",
        source: "Meta Watch",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "boxing",
    name: "Boxing",
    icon: "🥊",
    tagline: "Big nights and bigger moments.",
    description:
      "Breaking coverage for title bouts, weigh-ins, undercards, and every punch that shifts a division.",
    stories: 41,
    activeEvents: 3,
    followers: "510K",
    pulseScore: 74,
    topLeagues: ["WBC", "WBA", "IBF", "WBO"],
    upcoming: [
      { matchup: "Usyk vs Fury", competition: "Heavyweight Unification", kickoff: "Sat, 22:00" },
      { matchup: "Canelo vs Benavidez", competition: "Super Middleweight", kickoff: "Next Wed, 21:30" },
      { matchup: "Taylor vs Serrano II", competition: "Women's Lightweight", kickoff: "Sun, 20:00" },
    ],
    trendingStories: [
      {
        title: "Unification clash officially confirmed for September",
        excerpt: "Promoters finalize venue and purse details after weeks of talks.",
        source: "Ring Bulletin",
        time: "16 min ago",
        heat: "High",
      },
      {
        title: "Camp footage reveals fighter's new defensive style",
        excerpt: "Analysts spot a shift toward tighter guard and counter setups.",
        source: "Tape Study",
        time: "51 min ago",
        heat: "Rising",
      },
      {
        title: "Top contender calls for mandatory title shot",
        excerpt: "Post-fight interview reignites debate over divisional hierarchy.",
        source: "Fight Night",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "golf",
    name: "Golf",
    icon: "⛳",
    tagline: "Majors, pressure putts, legacy swings.",
    description:
      "Comprehensive golf coverage from tour events and majors, including leaderboard shifts and player trends.",
    stories: 38,
    activeEvents: 2,
    followers: "470K",
    pulseScore: 70,
    topLeagues: ["PGA Tour", "LPGA", "The Masters", "The Open"],
    upcoming: [
      { matchup: "Final Round Pairings", competition: "PGA Championship", kickoff: "Sun, 13:15" },
      { matchup: "Women's Major Day 1", competition: "LPGA", kickoff: "Thu, 09:00" },
      { matchup: "Ryder Cup Announcement", competition: "Team Europe", kickoff: "Fri, 10:30" },
    ],
    trendingStories: [
      {
        title: "Leader drains eagle putt to seize solo lead",
        excerpt: "A clutch finish at 18 flips the leaderboard heading into Sunday.",
        source: "Fairway Feed",
        time: "22 min ago",
        heat: "High",
      },
      {
        title: "Rookie continues breakout run with low round",
        excerpt: "Consistent iron play keeps the newcomer inside top five.",
        source: "Tour Track",
        time: "49 min ago",
        heat: "Rising",
      },
      {
        title: "Veteran makes equipment switch before major",
        excerpt: "New driver setup focuses on control over raw distance.",
        source: "Clubhouse",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
  {
    slug: "athletics",
    name: "Athletics",
    icon: "🏃",
    tagline: "Speed, endurance, and world records.",
    description:
      "Track and field coverage from diamond leagues to global championships, with athlete-focused reporting.",
    stories: 67,
    activeEvents: 7,
    followers: "590K",
    pulseScore: 81,
    topLeagues: ["Diamond League", "World Athletics", "Olympics", "National Trials"],
    upcoming: [
      { matchup: "100m Final", competition: "Diamond League Rome", kickoff: "Fri, 20:10" },
      { matchup: "Women's 1500m", competition: "Diamond League Rome", kickoff: "Fri, 20:45" },
      { matchup: "Marathon Trials", competition: "National Championship", kickoff: "Sun, 08:00" },
    ],
    trendingStories: [
      {
        title: "Sprint sensation breaks meet record in 100m",
        excerpt: "A lightning start and flawless transition deliver a statement victory.",
        source: "Trackside",
        time: "12 min ago",
        heat: "High",
      },
      {
        title: "Distance star returns after injury layoff",
        excerpt: "Coach confirms athlete is ready for a controlled comeback race.",
        source: "Athlete Desk",
        time: "38 min ago",
        heat: "Rising",
      },
      {
        title: "Relay team posts season-best split data",
        excerpt: "Improved baton transitions push national squad into medal conversation.",
        source: "Performance Lab",
        time: "1 hr ago",
        heat: "Medium",
      },
    ],
  },
];

export const getSportBySlug = (slug: string) =>
  SPORTS.find((sport) => sport.slug === slug);
