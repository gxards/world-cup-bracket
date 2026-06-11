import { GROUPS } from "./teams";

export type Position = 1 | 2 | 3 | 4;

export type GroupPlacements = Record<string, Record<Position, string | null>>;

export const POSITIONS: Position[] = [1, 2, 3, 4];

export const POSITION_LABELS: Record<Position, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
};

export function slotId(groupId: string, position: Position): string {
  return `slot:${groupId}:${position}`;
}

export function poolId(groupId: string): string {
  return `pool:${groupId}`;
}

export function parseDropTarget(id: string): {
  type: "slot" | "pool";
  groupId: string;
  position?: Position;
} | null {
  if (id.startsWith("slot:")) {
    const [, groupId, pos] = id.split(":");
    const position = Number(pos) as Position;
    if (!groupId || position < 1 || position > 4) return null;
    return { type: "slot", groupId, position };
  }
  if (id.startsWith("pool:")) {
    const groupId = id.slice(5);
    if (!groupId) return null;
    return { type: "pool", groupId };
  }
  return null;
}

export function createEmptyPlacements(): GroupPlacements {
  return Object.fromEntries(
    GROUPS.map((g) => [
      g.id,
      { 1: null, 2: null, 3: null, 4: null } satisfies Record<Position, string | null>,
    ])
  );
}

export function getUnassignedTeamIds(
  groupId: string,
  placements: GroupPlacements
): string[] {
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) return [];

  const placed = new Set(
    POSITIONS.map((p) => placements[groupId]?.[p]).filter(Boolean)
  );

  return group.teams.map((t) => t.id).filter((id) => !placed.has(id));
}

export function countCompletedGroups(placements: GroupPlacements): number {
  return GROUPS.filter((g) =>
    POSITIONS.every((p) => placements[g.id]?.[p] != null)
  ).length;
}

export function findTeamSlot(
  groupId: string,
  teamId: string,
  placements: GroupPlacements
): Position | null {
  for (const position of POSITIONS) {
    if (placements[groupId]?.[position] === teamId) return position;
  }
  return null;
}

export function findTeamGroup(teamId: string, placements: GroupPlacements): string | null {
  for (const group of GROUPS) {
    if (findTeamSlot(group.id, teamId, placements) !== null) return group.id;
    if (group.teams.some((t) => t.id === teamId)) return group.id;
  }
  return null;
}
