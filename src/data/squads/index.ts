import { groupA } from "./group-a";
import { groupB } from "./group-b";
import { groupC } from "./group-c";
import { groupD } from "./group-d";
import { groupE } from "./group-e";
import { groupF } from "./group-f";
import { groupG } from "./group-g";
import { groupH } from "./group-h";
import { groupI } from "./group-i";
import { groupJ } from "./group-j";
import { groupK } from "./group-k";
import { groupL } from "./group-l";

export const squads = {
  A: groupA,
  B: groupB,
  C: groupC,
  D: groupD,
  E: groupE,
  F: groupF,
  G: groupG,
  H: groupH,
  I: groupI,
  J: groupJ,
  K: groupK,
  L: groupL,
} as const;

export const ALL_TEAMS = Object.values(squads).flat();

export const ALL_PLAYERS = ALL_TEAMS.flatMap((team) =>
  team.players.map((player) => ({
    ...player,
    teamId: team.teamId,
    teamName: team.teamName,
  }))
);