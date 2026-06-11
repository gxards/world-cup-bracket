import { GROUPS, getTeam, type Team } from "./teams";
import type { GroupPlacements } from "./group-stage";

export type KnockoutRound = "R32" | "R16" | "QF" | "SF" | "3P" | "F";

export type SeedLabel = "Winner" | "Runner-up" | "Third-place";

export type BracketTeam = Team & {
  groupId: string;
  groupLetter: string;
  seed: SeedLabel;
  source: string;
};

export type KnockoutMatch = {
  id: string;
  round: KnockoutRound;
  title: string;
  teamA: BracketTeam | null;
  teamB: BracketTeam | null;
};

const GROUP_INDEX = new Map(GROUPS.map((g, index) => [g.id, index] as const));

export const R16_PAIRINGS = [
  [2, 5],
  [1, 3],
  [4, 6],
  [7, 8],
  [11, 12],
  [9, 10],
  [14, 16],
  [13, 15],
] as const;

export const QF_PAIRINGS = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
] as const;

export const SF_PAIRINGS = [
  [1, 2],
  [3, 4],
] as const;

const THIRD_PLACE_SLOT_ORDER = [2, 5, 7, 8, 9, 10, 13, 15] as const;

const ROUND_TITLES: Record<KnockoutRound, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-finals",
  SF: "Semi-finals",
  "3P": "Third Place Playoff",
  F: "Final",
};

function makeBracketTeam(
  teamId: string,
  groupId: string,
  seed: SeedLabel,
  source: string
): BracketTeam | null {
  const team = getTeam(teamId);
  const group = GROUPS.find((g) => g.id === groupId);

  if (!team || !group) return null;

  return {
    ...team,
    groupId,
    groupLetter: group.letter,
    seed,
    source,
  };
}

function getTeamFromPlacement(
  placements: GroupPlacements,
  groupId: string,
  position: 1 | 2 | 3,
  seed: SeedLabel,
  source: string
): BracketTeam | null {
  const teamId = placements[groupId]?.[position];
  if (!teamId) return null;
  return makeBracketTeam(teamId, groupId, seed, source);
}

export function buildRoundOf32(
  placements: GroupPlacements,
  selectedThirdPlaceIds: string[]
): KnockoutMatch[] {
  const winners = GROUPS.map((group) =>
    getTeamFromPlacement(
      placements,
      group.id,
      1,
      "Winner",
      `Group ${group.letter} Winner`
    )
  );

  const runnersUp = GROUPS.map((group) =>
    getTeamFromPlacement(
      placements,
      group.id,
      2,
      "Runner-up",
      `Group ${group.letter} Runner-up`
    )
  );

  const thirdPlacers = GROUPS.map((group) =>
    getTeamFromPlacement(
      placements,
      group.id,
      3,
      "Third-place",
      `Group ${group.letter} Third-place`
    )
  ).filter((team): team is BracketTeam => Boolean(team));

  const selectedThirdPlacers = thirdPlacers
    .filter((team) => selectedThirdPlaceIds.includes(team.id))
    .sort((a, b) => {
      const ai = GROUP_INDEX.get(a.groupId) ?? 999;
      const bi = GROUP_INDEX.get(b.groupId) ?? 999;
      return ai - bi;
    });

  const thirdPlaceSlots = new Map<number, BracketTeam | null>();
  THIRD_PLACE_SLOT_ORDER.forEach((slot, index) => {
    thirdPlaceSlots.set(slot, selectedThirdPlacers[index] ?? null);
  });

  const third = (slot: (typeof THIRD_PLACE_SLOT_ORDER)[number]) =>
    thirdPlaceSlots.get(slot) ?? null;

  return [
    {
      id: "r32-1",
      round: "R32",
      title: "Match 1",
      teamA: runnersUp[0],
      teamB: runnersUp[1],
    },
    {
      id: "r32-2",
      round: "R32",
      title: "Match 2",
      teamA: winners[4],
      teamB: third(2),
    },
    {
      id: "r32-3",
      round: "R32",
      title: "Match 3",
      teamA: winners[5],
      teamB: runnersUp[2],
    },
    {
      id: "r32-4",
      round: "R32",
      title: "Match 4",
      teamA: winners[2],
      teamB: runnersUp[5],
    },
    {
      id: "r32-5",
      round: "R32",
      title: "Match 5",
      teamA: winners[8],
      teamB: third(5),
    },
    {
      id: "r32-6",
      round: "R32",
      title: "Match 6",
      teamA: runnersUp[4],
      teamB: runnersUp[8],
    },
    {
      id: "r32-7",
      round: "R32",
      title: "Match 7",
      teamA: winners[0],
      teamB: third(7),
    },
    {
      id: "r32-8",
      round: "R32",
      title: "Match 8",
      teamA: winners[11],
      teamB: third(8),
    },
    {
      id: "r32-9",
      round: "R32",
      title: "Match 9",
      teamA: winners[3],
      teamB: third(9),
    },
    {
      id: "r32-10",
      round: "R32",
      title: "Match 10",
      teamA: winners[6],
      teamB: third(10),
    },
    {
      id: "r32-11",
      round: "R32",
      title: "Match 11",
      teamA: runnersUp[10],
      teamB: runnersUp[11],
    },
    {
      id: "r32-12",
      round: "R32",
      title: "Match 12",
      teamA: winners[7],
      teamB: runnersUp[9],
    },
    {
      id: "r32-13",
      round: "R32",
      title: "Match 13",
      teamA: winners[1],
      teamB: third(13),
    },
    {
      id: "r32-14",
      round: "R32",
      title: "Match 14",
      teamA: winners[9],
      teamB: runnersUp[7],
    },
    {
      id: "r32-15",
      round: "R32",
      title: "Match 15",
      teamA: winners[10],
      teamB: third(15),
    },
    {
      id: "r32-16",
      round: "R32",
      title: "Match 16",
      teamA: runnersUp[3],
      teamB: runnersUp[6],
    },
  ];
}

export function getMatchWinner(
  match: KnockoutMatch,
  winnerMap: Record<string, string>
): BracketTeam | null {
  const winnerId = winnerMap[match.id];
  if (!winnerId) return null;

  if (match.teamA?.id === winnerId) return match.teamA;
  if (match.teamB?.id === winnerId) return match.teamB;

  return null;
}

export function getMatchLoser(
  match: KnockoutMatch,
  winnerMap: Record<string, string>
): BracketTeam | null {
  const winnerId = winnerMap[match.id];
  if (!winnerId) return null;

  if (match.teamA?.id === winnerId) return match.teamB;
  if (match.teamB?.id === winnerId) return match.teamA;

  return null;
}

export function buildRoundFromPairings(
  prevMatches: KnockoutMatch[],
  pairings: readonly (readonly [number, number])[],
  round: Exclude<KnockoutRound, "R32" | "3P">,
  winnerMap: Record<string, string>
): KnockoutMatch[] {
  return pairings.map(([left, right], index) => {
    const leftMatch = prevMatches[left - 1];
    const rightMatch = prevMatches[right - 1];

    return {
      id: `${round.toLowerCase()}-${index + 1}`,
      round,
      title: `${ROUND_TITLES[round]} ${index + 1}`,
      teamA: leftMatch ? getMatchWinner(leftMatch, winnerMap) : null,
      teamB: rightMatch ? getMatchWinner(rightMatch, winnerMap) : null,
    };
  });
}

export function buildThirdPlacePlayoff(
  semifinals: KnockoutMatch[],
  winnerMap: Record<string, string>
): KnockoutMatch {
  return {
    id: "third-place-playoff",
    round: "3P",
    title: ROUND_TITLES["3P"],
    teamA: semifinals[0] ? getMatchLoser(semifinals[0], winnerMap) : null,
    teamB: semifinals[1] ? getMatchLoser(semifinals[1], winnerMap) : null,
  };
}

export function buildFinalMatch(
  semifinals: KnockoutMatch[],
  winnerMap: Record<string, string>
): KnockoutMatch {
  return {
    id: "final-1",
    round: "F",
    title: ROUND_TITLES.F,
    teamA: semifinals[0] ? getMatchWinner(semifinals[0], winnerMap) : null,
    teamB: semifinals[1] ? getMatchWinner(semifinals[1], winnerMap) : null,
  };
}

export function roundIsReady(match: KnockoutMatch): boolean {
  return Boolean(match.teamA && match.teamB);
}

export function roundTitle(round: KnockoutRound): string {
  return ROUND_TITLES[round];
}