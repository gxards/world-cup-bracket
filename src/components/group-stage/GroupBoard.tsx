"use client";

import { useDroppable } from "@dnd-kit/core";
import { PositionSlot } from "./PositionSlot";
import { TeamCard } from "./TeamCard";
import {
  getUnassignedTeamIds,
  poolId,
  POSITIONS,
  type GroupPlacements,
} from "@/lib/group-stage";
import type { Group } from "@/lib/teams";

type GroupBoardProps = {
  group: Group;
  placements: GroupPlacements;
  activeOverId: string | null;
  onReset: () => void;
};

export function GroupBoard({
  group,
  placements,
  activeOverId,
  onReset,
}: GroupBoardProps) {
  const groupPlacements = placements[group.id];
  const unassigned = getUnassignedTeamIds(group.id, placements);
  const isComplete = unassigned.length === 0;

  const { setNodeRef, isOver: isPoolOver } = useDroppable({
    id: poolId(group.id),
    data: { groupId: group.id, type: "pool" },
  });

  return (
    <article
      className={[
        "glass-card flex flex-col overflow-hidden rounded-2xl transition duration-300",
        isComplete ? "ring-1 ring-gold/25" : "",
      ].join(" ")}
    >
      <header className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-accent-blue/30 to-accent-blue/10 text-xl font-bold text-accent-blue">
            {group.letter}
          </span>
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-wide">
              Group {group.letter}
            </h2>
            <p className="text-xs text-muted">
              {isComplete ? "Prediction complete" : `${unassigned.length} teams unplaced`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-muted transition hover:border-white/20 hover:text-foreground"
        >
          Reset
        </button>
      </header>

      <div className="flex flex-col gap-3 p-5">
        {POSITIONS.map((position) => (
          <PositionSlot
            key={position}
            groupId={group.id}
            position={position}
            teamId={groupPlacements[position]}
            isOver={activeOverId === `slot:${group.id}:${position}`}
          />
        ))}
      </div>

      <div
        ref={setNodeRef}
        className={[
          "border-t border-white/8 px-5 py-4 transition-colors",
          isPoolOver ? "bg-gold/5" : "bg-background/30",
        ].join(" ")}
      >
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          Unassigned teams
        </p>
        <div className="flex flex-col gap-2">
          {unassigned.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/10 py-6 text-center text-xs text-muted">
              All teams placed — drag between slots to reorder
            </p>
          ) : (
            unassigned.map((teamId) => {
              const team = group.teams.find((t) => t.id === teamId);
              if (!team) return null;
              return <TeamCard key={team.id} team={team} />;
            })
          )}
        </div>
      </div>
    </article>
  );
}
