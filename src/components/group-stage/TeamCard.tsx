"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { FormGuide } from "./FormGuide";
import { flagUrl, type Team } from "@/lib/teams";

type TeamCardProps = {
  team: Team;
  compact?: boolean;
  isDragOverlay?: boolean;
};

export function TeamCard({ team, compact, isDragOverlay }: TeamCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: team.id,
      data: { teamId: team.id },
      disabled: isDragOverlay,
    });

  const style = isDragOverlay
    ? undefined
    : {
        transform: CSS.Translate.toString(transform),
      };

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      className={[
        "group/team relative flex cursor-grab touch-none select-none items-center gap-3 rounded-xl border bg-surface-elevated/90 transition-all duration-200 active:cursor-grabbing",
        compact ? "px-3 py-2.5" : "px-3.5 py-3",
        isDragOverlay
          ? "border-gold/50 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(232,197,71,0.2)] scale-[1.03]"
          : isDragging
            ? "opacity-30 border-white/5"
            : "border-white/10 hover:border-gold/30 hover:bg-surface-elevated hover:shadow-lg",
      ].join(" ")}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-md border border-white/10 bg-background ${compact ? "h-7 w-10" : "h-8 w-11"}`}
      >
        <Image
          src={flagUrl(team.flagCode)}
          alt=""
          fill
          className="object-cover"
          sizes="44px"
          unoptimized
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate font-semibold text-foreground ${compact ? "text-sm" : "text-sm"}`}
          >
            {team.name}
          </p>
          <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
            #{team.fifaRanking}
          </span>
        </div>

        {!compact && (
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {team.confederation}
            </span>
            <FormGuide form={team.form} />
          </div>
        )}
      </div>

      {!isDragOverlay && (
        <GripIcon className="h-4 w-4 shrink-0 text-white/20 transition group-hover/team:text-gold/60" />
      )}
    </div>
  );
}

function GripIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}
