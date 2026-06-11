export type AwardKey =
  | "goldenBoot"
  | "topAssister"
  | "goldenBall"
  | "goldenGlove"
  | "youngPlayer";

export type AwardPosition =
  | "Goalkeeper"
  | "Defender"
  | "Midfielder"
  | "Forward"
  | "Attacker";

export type AwardPlayer = {
  name: string;
  position: AwardPosition;
  age?: number;
  country: string;
};

export type AwardSelections = Record<AwardKey, AwardPlayer | null>;

export type AwardConfig = {
  key: AwardKey;
  label: string;
  description: string;
  helper: string;
};

export const AWARDS: AwardConfig[] = [
  {
    key: "goldenBoot",
    label: "Golden Boot",
    description: "Best scorer pick.",
    helper: "Midfielders and attackers only.",
  },
  {
    key: "topAssister",
    label: "Top Assister",
    description: "Best creator pick.",
    helper: "Any position except goalkeeper.",
  },
  {
    key: "goldenBall",
    label: "Golden Ball",
    description: "Best overall player pick.",
    helper: "Open to all players.",
  },
  {
    key: "goldenGlove",
    label: "Golden Glove",
    description: "Best goalkeeper pick.",
    helper: "Goalkeepers only.",
  },
  {
    key: "youngPlayer",
    label: "Young Player",
    description: "Best young player pick.",
    helper: "Open to all players.",
  },
] as const;

export function normalizePosition(position: AwardPosition) {
  return position === "Forward" ? "Attacker" : position;
}

export function isEligibleForAward(player: AwardPlayer, award: AwardKey) {
  const position = normalizePosition(player.position);

  switch (award) {
    case "goldenBoot":
      return position === "Midfielder" || position === "Attacker";
    case "topAssister":
      return position !== "Goalkeeper";
    case "goldenBall":
      return true;
    case "goldenGlove":
      return position === "Goalkeeper";
    case "youngPlayer":
      return true;
    default:
      return true;
  }
}

export function filterPlayersForAward(
  players: AwardPlayer[],
  award: AwardKey,
  query: string
) {
  const q = query.trim().toLowerCase();

  return players
    .filter((player) => isEligibleForAward(player, award))
    .filter((player) => {
      if (!q) return true;

      return (
        player.name.toLowerCase().includes(q) ||
        player.country.toLowerCase().includes(q) ||
        player.position.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const countryCompare = a.country.localeCompare(b.country);
      if (countryCompare !== 0) return countryCompare;
      return a.name.localeCompare(b.name);
    });
}