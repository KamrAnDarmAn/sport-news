export interface SportInfo {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  count: number;
  gradient: string;
  topNews: { title: string; excerpt: string; time: string }[];
  topPlayers: { name: string; team: string; stat: string }[];
}

export const SPORTS: Record<string, SportInfo> = {
  football: {
    slug: "football",
    name: "Football",
    icon: "⚽",
    tagline: "The Beautiful Game",
    description:
      "From Premier League thrillers to Champions League nights — the deepest coverage of world football.",
    count: 248,
    gradient: "from-orange-500 to-red-500",
    topNews: [
      {
        title: "Madrid stuns Barcelona in 92nd-minute Clásico thriller",
        excerpt: "A late winner sends the Bernabéu into delirium...",
        time: "2h ago",
      },
      {
        title: "Manager confirms star striker fit for weekend clash",
        excerpt: "Two weeks of rehab pay off ahead of a six-pointer...",
        time: "4h ago",
      },
      {
        title: "Transfer window: three blockbusters in 24 hours",
        excerpt: "Europe's biggest clubs reshape their squads...",
        time: "8h ago",
      },
    ],
    topPlayers: [
      { name: "L. Mbappé", team: "Real Madrid", stat: "24 goals" },
      { name: "E. Haaland", team: "Man City", stat: "22 goals" },
      { name: "J. Bellingham", team: "Real Madrid", stat: "18 assists" },
    ],
  },
  basketball: {
    slug: "basketball",
    name: "Basketball",
    icon: "🏀",
    tagline: "Court Kings",
    description:
      "NBA, EuroLeague, NCAA and beyond — every dunk, dish, and dagger.",
    count: 184,
    gradient: "from-amber-500 to-orange-600",
    topNews: [
      {
        title: "Lakers complete historic 4-1 comeback in West",
        excerpt: "An all-time playoff turnaround...",
        time: "1h ago",
      },
      {
        title: "Trade deadline shake-up: six picks involved",
        excerpt: "A late-night blockbuster reshapes the conference...",
        time: "5h ago",
      },
      {
        title: "Rookie of the Year race tightens",
        excerpt: "Three names, one trophy, twelve games left...",
        time: "12h ago",
      },
    ],
    topPlayers: [
      { name: "L. Dončić", team: "Lakers", stat: "33.4 PPG" },
      { name: "S. Curry", team: "Warriors", stat: "29.1 PPG" },
      { name: "N. Jokić", team: "Nuggets", stat: "12.6 RPG" },
    ],
  },
  tennis: {
    slug: "tennis",
    name: "Tennis",
    icon: "🎾",
    tagline: "Grand Slam Coverage",
    description: "From hard courts to clay — every break point that matters.",
    count: 96,
    gradient: "from-lime-400 to-green-600",
    topNews: [
      {
        title: "Sinner powers into French Open final after epic semi",
        excerpt: "Five sets, four hours, one place in history...",
        time: "3h ago",
      },
      {
        title: "Wildcard upset rocks Madrid Open day one",
        excerpt: "Qualifier sends seeded star packing...",
        time: "6h ago",
      },
      {
        title: "Comeback queen closes in on first slam",
        excerpt: "Two years off-tour, one shot at glory...",
        time: "1d ago",
      },
    ],
    topPlayers: [
      { name: "J. Sinner", team: "ITA", stat: "9,200 pts" },
      { name: "C. Alcaraz", team: "ESP", stat: "8,800 pts" },
      { name: "I. Świątek", team: "POL", stat: "10,400 pts" },
    ],
  },
  "f1-racing": {
    slug: "f1-racing",
    name: "F1 Racing",
    icon: "🏎️",
    tagline: "Pole to Podium",
    description:
      "Lights out and away we go — paddock secrets, race recaps & tech deep-dives.",
    count: 72,
    gradient: "from-red-500 to-pink-600",
    topNews: [
      {
        title: "Verstappen secures 6th consecutive pole at Monaco",
        excerpt: "Untouchable in qualifying once again...",
        time: "2h ago",
      },
      {
        title: "Team unveils radical aero package ahead of Imola",
        excerpt: "Engineers chase tenths with bold sidepod redesign...",
        time: "9h ago",
      },
      {
        title: "Driver market: 2027 silly season starts early",
        excerpt: "Three top seats already in play...",
        time: "1d ago",
      },
    ],
    topPlayers: [
      { name: "M. Verstappen", team: "Red Bull", stat: "312 pts" },
      { name: "L. Norris", team: "McLaren", stat: "276 pts" },
      { name: "C. Leclerc", team: "Ferrari", stat: "248 pts" },
    ],
  },
  cricket: {
    slug: "cricket",
    name: "Cricket",
    icon: "🏏",
    tagline: "Tests, T20s & More",
    description:
      "Five-day epics to T20 fireworks — every format, every ground.",
    count: 138,
    gradient: "from-blue-500 to-indigo-600",
    topNews: [
      {
        title: "India announces revolutionary squad for SA series",
        excerpt: "Selectors back youth in a bold reshuffle...",
        time: "1h ago",
      },
      {
        title: "Young opener smashes maiden double-century",
        excerpt: "A breakthrough innings that signals a new era...",
        time: "7h ago",
      },
      {
        title: "Ashes 2026: dates and venues confirmed",
        excerpt: "England and Australia lock in the schedule...",
        time: "1d ago",
      },
    ],
    topPlayers: [
      { name: "S. Gill", team: "India", stat: "812 runs" },
      { name: "J. Root", team: "England", stat: "9 centuries" },
      { name: "P. Cummins", team: "Australia", stat: "42 wickets" },
    ],
  },
  esports: {
    slug: "esports",
    name: "Esports",
    icon: "🎮",
    tagline: "Digital Arenas",
    description:
      "From LAN finals to ranked grind — the competitive scene in full.",
    count: 54,
    gradient: "from-purple-500 to-fuchsia-600",
    topNews: [
      {
        title: "Worlds qualifier: underdog roster shocks favorites",
        excerpt: "An unranked squad punches their ticket...",
        time: "30m ago",
      },
      {
        title: "Patch 14.9 turns the meta upside down",
        excerpt: "Three picks rise, two tier-S champs fall...",
        time: "5h ago",
      },
      {
        title: "Major sponsorship reshapes the league economy",
        excerpt: "A nine-figure deal lands in the LCS...",
        time: "1d ago",
      },
    ],
    topPlayers: [
      { name: "Faker", team: "T1", stat: "5x champion" },
      { name: "ZywOo", team: "Vitality", stat: "1.32 rating" },
      { name: "s1mple", team: "FaZe", stat: "1.28 rating" },
    ],
  },
  boxing: {
    slug: "boxing",
    name: "Boxing",
    icon: "🥊",
    tagline: "Heavyweight Nights",
    description:
      "Title bouts, undercards and the politics of the sweet science.",
    count: 41,
    gradient: "from-rose-500 to-red-700",
    topNews: [
      {
        title: "Heavyweight unification bout confirmed for September",
        excerpt: "Years of negotiation finally end with a contract...",
        time: "4h ago",
      },
      {
        title: "Rising prospect signs eight-fight promotional deal",
        excerpt: "The next big thing locks in his future...",
        time: "1d ago",
      },
      {
        title: "Judging controversy reignites scoring debate",
        excerpt: "Three cards, three different stories...",
        time: "2d ago",
      },
    ],
    topPlayers: [
      { name: "O. Usyk", team: "Heavyweight", stat: "22-0" },
      { name: "T. Crawford", team: "Welterweight", stat: "41-0" },
      { name: "N. Inoue", team: "Bantamweight", stat: "27-0" },
    ],
  },
  golf: {
    slug: "golf",
    name: "Golf",
    icon: "⛳",
    tagline: "Majors & Tours",
    description:
      "Augusta to St Andrews — every fairway, every putt that matters.",
    count: 38,
    gradient: "from-emerald-400 to-green-700",
    topNews: [
      {
        title: "Masters Sunday: a final-round duel for the ages",
        excerpt: "Two players, eighteen holes, one green jacket...",
        time: "1d ago",
      },
      {
        title: "Tour announces new global swing for 2027",
        excerpt: "Schedule reshuffle adds three flagship events...",
        time: "2d ago",
      },
      {
        title: "Equipment rules to change after long-driver debate",
        excerpt: "Governing bodies finally act on rollback...",
        time: "3d ago",
      },
    ],
    topPlayers: [
      { name: "S. Scheffler", team: "USA", stat: "World #1" },
      { name: "R. McIlroy", team: "NIR", stat: "5 wins" },
      { name: "L. Aberg", team: "SWE", stat: "Rising" },
    ],
  },
  athletics: {
    slug: "athletics",
    name: "Athletics",
    icon: "🏃",
    tagline: "Track & Field",
    description:
      "Sprints, jumps, throws and distance — the original sport, on the world stage.",
    count: 67,
    gradient: "from-cyan-400 to-blue-600",
    topNews: [
      {
        title: "World record falls in Eugene 1500m",
        excerpt: "A blistering kick and history is made...",
        time: "6h ago",
      },
      {
        title: "Olympic team trials produce shock 100m finalist",
        excerpt: "An unseeded sprinter books her ticket...",
        time: "1d ago",
      },
      {
        title: "Doping case overturned on appeal",
        excerpt: "Athlete cleared after two-year saga...",
        time: "3d ago",
      },
    ],
    topPlayers: [
      { name: "N. Lyles", team: "USA", stat: "9.79s 100m" },
      { name: "S. McLaughlin", team: "USA", stat: "WR 400mH" },
      { name: "M. Duplantis", team: "SWE", stat: "6.26m PV" },
    ],
  },
};

export const SPORT_LIST = Object.values(SPORTS);

/** Match grouped DB sport keys (lowercase) to a curated category slug/name. */
export function storyCountForSport(
  counts: Record<string, number>,
  slug: string,
  name: string,
): number {
  const candidates = [
    name.toLowerCase(),
    slug.toLowerCase(),
    slug.replace(/-/g, " ").toLowerCase(),
  ];
  let n = 0;
  for (const k of candidates) n = Math.max(n, counts[k] ?? 0);
  if (slug === "f1-racing") {
    n = Math.max(n, counts["f1"] ?? 0, counts["formula 1"] ?? 0);
  }
  return n;
}
