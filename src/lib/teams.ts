export type Confederation =
  | "UEFA"
  | "CONMEBOL"
  | "CONCACAF"
  | "CAF"
  | "AFC"
  | "OFC";

export type FormResult = "W" | "D" | "L";

export type Team = {
  id: string;
  name: string;
  flagCode: string;
  fifaRanking: number;
  confederation: Confederation;
  form: FormResult[];
};

export type Group = {
  id: string;
  letter: string;
  teams: Team[];
};

const f = (...results: FormResult[]) => results;

export const GROUPS: Group[] = [
  {
    id: "A",
    letter: "A",
    teams: [
      { id: "mexico", name: "Mexico", flagCode: "mx", fifaRanking: 14, confederation: "CONCACAF", form: f("W", "W", "D", "W", "L") },
      { id: "south-africa", name: "South Africa", flagCode: "za", fifaRanking: 59, confederation: "CAF", form: f("D", "W", "L", "W", "D") },
      { id: "south-korea", name: "South Korea", flagCode: "kr", fifaRanking: 23, confederation: "AFC", form: f("W", "D", "W", "L", "W") },
      { id: "czechia", name: "Czechia", flagCode: "cz", fifaRanking: 31, confederation: "UEFA", form: f("W", "L", "W", "D", "W") },
    ],
  },
  {
    id: "B",
    letter: "B",
    teams: [
      { id: "canada", name: "Canada", flagCode: "ca", fifaRanking: 27, confederation: "CONCACAF", form: f("W", "D", "W", "W", "D") },
      { id: "switzerland", name: "Switzerland", flagCode: "ch", fifaRanking: 17, confederation: "UEFA", form: f("D", "W", "D", "W", "L") },
      { id: "qatar", name: "Qatar", flagCode: "qa", fifaRanking: 35, confederation: "AFC", form: f("L", "D", "W", "D", "W") },
      { id: "bosnia", name: "Bosnia & Herzegovina", flagCode: "ba", fifaRanking: 62, confederation: "UEFA", form: f("W", "W", "L", "D", "W") },
    ],
  },
  {
    id: "C",
    letter: "C",
    teams: [
      { id: "brazil", name: "Brazil", flagCode: "br", fifaRanking: 5, confederation: "CONMEBOL", form: f("W", "W", "D", "W", "W") },
      { id: "morocco", name: "Morocco", flagCode: "ma", fifaRanking: 11, confederation: "CAF", form: f("W", "D", "W", "W", "D") },
      { id: "scotland", name: "Scotland", flagCode: "gb-sct", fifaRanking: 36, confederation: "UEFA", form: f("W", "L", "W", "D", "W") },
      { id: "haiti", name: "Haiti", flagCode: "ht", fifaRanking: 87, confederation: "CONCACAF", form: f("D", "W", "L", "W", "D") },
    ],
  },
  {
    id: "D",
    letter: "D",
    teams: [
      { id: "usa", name: "United States", flagCode: "us", fifaRanking: 15, confederation: "CONCACAF", form: f("W", "W", "L", "W", "D") },
      { id: "paraguay", name: "Paraguay", flagCode: "py", fifaRanking: 52, confederation: "CONMEBOL", form: f("D", "W", "W", "L", "W") },
      { id: "australia", name: "Australia", flagCode: "au", fifaRanking: 24, confederation: "AFC", form: f("W", "D", "L", "W", "W") },
      { id: "turkiye", name: "Türkiye", flagCode: "tr", fifaRanking: 32, confederation: "UEFA", form: f("W", "W", "D", "L", "W") },
    ],
  },
  {
    id: "E",
    letter: "E",
    teams: [
      { id: "germany", name: "Germany", flagCode: "de", fifaRanking: 9, confederation: "UEFA", form: f("W", "W", "W", "D", "W") },
      { id: "curacao", name: "Curaçao", flagCode: "cw", fifaRanking: 88, confederation: "CONCACAF", form: f("W", "D", "W", "L", "W") },
      { id: "ivory-coast", name: "Côte d'Ivoire", flagCode: "ci", fifaRanking: 33, confederation: "CAF", form: f("D", "W", "W", "L", "D") },
      { id: "ecuador", name: "Ecuador", flagCode: "ec", fifaRanking: 28, confederation: "CONMEBOL", form: f("W", "L", "W", "D", "W") },
    ],
  },
  {
    id: "F",
    letter: "F",
    teams: [
      { id: "netherlands", name: "Netherlands", flagCode: "nl", fifaRanking: 7, confederation: "UEFA", form: f("W", "D", "W", "W", "L") },
      { id: "japan", name: "Japan", flagCode: "jp", fifaRanking: 18, confederation: "AFC", form: f("W", "W", "D", "W", "W") },
      { id: "tunisia", name: "Tunisia", flagCode: "tn", fifaRanking: 41, confederation: "CAF", form: f("D", "L", "W", "D", "W") },
      { id: "sweden", name: "Sweden", flagCode: "se", fifaRanking: 26, confederation: "UEFA", form: f("W", "W", "L", "W", "D") },
    ],
  },
  {
    id: "G",
    letter: "G",
    teams: [
      { id: "belgium", name: "Belgium", flagCode: "be", fifaRanking: 8, confederation: "UEFA", form: f("D", "W", "W", "L", "W") },
      { id: "egypt", name: "Egypt", flagCode: "eg", fifaRanking: 34, confederation: "CAF", form: f("W", "D", "W", "W", "L") },
      { id: "iran", name: "IR Iran", flagCode: "ir", fifaRanking: 21, confederation: "AFC", form: f("W", "W", "D", "L", "W") },
      { id: "new-zealand", name: "New Zealand", flagCode: "nz", fifaRanking: 94, confederation: "OFC", form: f("D", "W", "L", "W", "D") },
    ],
  },
  {
    id: "H",
    letter: "H",
    teams: [
      { id: "spain", name: "Spain", flagCode: "es", fifaRanking: 1, confederation: "UEFA", form: f("W", "W", "W", "D", "W") },
      { id: "uruguay", name: "Uruguay", flagCode: "uy", fifaRanking: 12, confederation: "CONMEBOL", form: f("W", "D", "W", "W", "L") },
      { id: "saudi-arabia", name: "Saudi Arabia", flagCode: "sa", fifaRanking: 56, confederation: "AFC", form: f("L", "W", "D", "W", "D") },
      { id: "cape-verde", name: "Cabo Verde", flagCode: "cv", fifaRanking: 65, confederation: "CAF", form: f("W", "W", "D", "L", "W") },
    ],
  },
  {
    id: "I",
    letter: "I",
    teams: [
      { id: "france", name: "France", flagCode: "fr", fifaRanking: 3, confederation: "UEFA", form: f("W", "W", "D", "W", "W") },
      { id: "senegal", name: "Senegal", flagCode: "sn", fifaRanking: 16, confederation: "CAF", form: f("D", "W", "W", "L", "W") },
      { id: "norway", name: "Norway", flagCode: "no", fifaRanking: 45, confederation: "UEFA", form: f("W", "W", "W", "D", "L") },
      { id: "iraq", name: "Iraq", flagCode: "iq", fifaRanking: 58, confederation: "AFC", form: f("W", "D", "L", "W", "D") },
    ],
  },
  {
    id: "J",
    letter: "J",
    teams: [
      { id: "argentina", name: "Argentina", flagCode: "ar", fifaRanking: 2, confederation: "CONMEBOL", form: f("W", "D", "W", "W", "W") },
      { id: "algeria", name: "Algeria", flagCode: "dz", fifaRanking: 37, confederation: "CAF", form: f("W", "L", "W", "D", "W") },
      { id: "austria", name: "Austria", flagCode: "at", fifaRanking: 22, confederation: "UEFA", form: f("W", "W", "D", "W", "L") },
      { id: "jordan", name: "Jordan", flagCode: "jo", fifaRanking: 70, confederation: "AFC", form: f("D", "W", "W", "L", "D") },
    ],
  },
  {
    id: "K",
    letter: "K",
    teams: [
      { id: "portugal", name: "Portugal", flagCode: "pt", fifaRanking: 6, confederation: "UEFA", form: f("W", "W", "W", "L", "W") },
      { id: "colombia", name: "Colombia", flagCode: "co", fifaRanking: 13, confederation: "CONMEBOL", form: f("W", "D", "W", "W", "D") },
      { id: "uzbekistan", name: "Uzbekistan", flagCode: "uz", fifaRanking: 64, confederation: "AFC", form: f("W", "W", "L", "D", "W") },
      { id: "dr-congo", name: "DR Congo", flagCode: "cd", fifaRanking: 54, confederation: "CAF", form: f("D", "W", "L", "W", "W") },
    ],
  },
  {
    id: "L",
    letter: "L",
    teams: [
      { id: "england", name: "England", flagCode: "gb-eng", fifaRanking: 4, confederation: "UEFA", form: f("W", "W", "D", "W", "W") },
      { id: "croatia", name: "Croatia", flagCode: "hr", fifaRanking: 10, confederation: "UEFA", form: f("D", "W", "W", "L", "W") },
      { id: "ghana", name: "Ghana", flagCode: "gh", fifaRanking: 68, confederation: "CAF", form: f("W", "D", "L", "W", "D") },
      { id: "panama", name: "Panama", flagCode: "pa", fifaRanking: 44, confederation: "CONCACAF", form: f("L", "W", "D", "W", "W") },
    ],
  },
];

export const TEAM_MAP = new Map(
  GROUPS.flatMap((g) => g.teams.map((t) => [t.id, t] as const))
);

export function getTeam(id: string): Team | undefined {
  return TEAM_MAP.get(id);
}

export function flagUrl(code: string): string {
  return `https://flagcdn.com/w80/${code}.png`;
}
