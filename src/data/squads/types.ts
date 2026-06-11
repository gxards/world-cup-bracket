export type PlayerPosition =
  | "Goalkeeper"
  | "Defender"
  | "Midfielder"
  | "Forward";

export type Player = {
  name: string;
  position: PlayerPosition;
};

export type TeamSquad = {
  teamId: string;
  teamName: string;
  players: Player[];
};

export type GroupSquad = TeamSquad[];