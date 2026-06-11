"use client";

import { useDroppable } from "@dnd-kit/core";
import { TeamCard } from "./TeamCard";
import {
  POSITION_LABELS,
  slotId,
  type Position,
} from "@/lib/group-stage";
import { getTeam } from "@/lib/teams";

const positionStyles: Record<
  Position,
  { ring: string; badge: string; label: string }
> = {
  1: {
    ring: "border-gold/40 bg-gold/5",
    badge: "bg-gold text-background",
    label: "text-gold",
  },
  2: {
    ring: "border-slate-400/30 bg-slate-400/5",
    badge: "bg-slate-300 text-background",
    label: "text-slate-300",
  },
  3: {
    ring: "border-amber-700/35 bg-amber-700/5",
    badge: "bg-amber-700 text-white",
    label: "text-amber-600",
  },
  4: {
    ring: "border-white/10 bg-white/2",
    badge: "bg-white/15 text-muted",
    label: "text-muted",
  },
};

type PositionSlotProps = {
  groupId: string;
  position: Position;
  teamId: string | null;
  isOver?: boolean;
};

export function PositionSlot({
  groupId,
  position,
  teamId,
  isOver,
}: PositionSlotProps) {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({
    id: slotId(groupId, position),
    data: { groupId, position, type: "slot" },
  });

  const team = teamId ? getTeam(teamId) : null;
  const styles = positionStyles[position];
  const active = isOver || isDroppableOver;

  return (
    <div className="flex items-stretch gap-3">
      <div
        className={`flex w-12 shrink-0 flex-col items-center justify-center rounded-xl border ${styles.ring}`}
      >
        <span
          className={`font-display text-xs font-bold uppercase ${styles.label}`}
        >
          {POSITION_LABELS[position]}
        </span>
        <span
          className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${styles.badge}`}
        >
          {position}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={[
          "min-h-[52px] flex-1 rounded-xl border border-dashed transition-all duration-200",
          team ? "border-transparent bg-transparent p-0" : "p-2",
          team
            ? ""
            : active
              ? "border-gold/60 bg-gold/10 shadow-[inset_0_0_20px_rgba(232,197,71,0.1)]"
              : "border-white/12 bg-white/2",
        ].join(" ")}
      >
        {team ? (
          <TeamCard team={team} compact />
        ) : (
          <div className="flex h-full min-h-[44px] items-center justify-center">
            <p className="text-xs font-medium text-muted/70">
              {active ? "Release to place" : "Drop team here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
