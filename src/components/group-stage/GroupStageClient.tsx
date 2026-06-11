"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { GroupBoard } from "./GroupBoard";
import Link from "next/link";
import { TeamCard } from "./TeamCard";
import { useGroupPlacements } from "@/hooks/useGroupPlacements";
import {
  countCompletedGroups,
  findTeamGroup,
  findTeamSlot,
  parseDropTarget,
} from "@/lib/group-stage";
import { GROUPS, getTeam } from "@/lib/teams";

export function GroupStageClient() {
  const { placements, placeTeam, resetAll, resetGroup, hydrated } =
    useGroupPlacements();
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const completed = useMemo(
    () => countCompletedGroups(placements),
    [placements]
  );

  const activeTeam = activeTeamId ? getTeam(activeTeamId) : null;

  function handleDragStart({ active }: DragStartEvent) {
    setActiveTeamId(String(active.id));
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over ? String(over.id) : null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTeamId(null);
    setOverId(null);

    if (!over) return;

    const teamId = String(active.id);
    const target = parseDropTarget(String(over.id));
    if (!target) return;

    const teamGroup = findTeamGroup(teamId, placements);
    if (!teamGroup || teamGroup !== target.groupId) return;

    if (target.type === "pool") {
      placeTeam(target.groupId, teamId, { type: "pool" });
      return;
    }

    if (!target.position) return;

    const currentSlot = findTeamSlot(target.groupId, teamId, placements);
    if (currentSlot === target.position) return;

    placeTeam(target.groupId, teamId, {
      type: "slot",
      position: target.position,
    });
  }

  function handleDragCancel() {
    setActiveTeamId(null);
    setOverId(null);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted">Loading predictions…</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="sticky top-16 z-40 border-b border-white/8 bg-background/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Group Stage
            </p>
            <p className="mt-1 text-sm text-muted">
              Drag teams into 1st–4th place. No scores — final positions only.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-gold to-accent transition-all duration-500"
                  style={{ width: `${(completed / 12) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {completed}/12
              </span>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-muted transition hover:border-white/25 hover:text-foreground"
            >
              Reset all
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 xl:grid-cols-3">
        {GROUPS.map((group) => (
          <GroupBoard
            key={group.id}
            group={group}
            placements={placements}
            activeOverId={overId}
            onReset={() => resetGroup(group.id)}
          />
        ))}
      </div>

      <div className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/8 bg-card/70 p-6 backdrop-blur-xl md:flex-row">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Complete all 12 groups to continue.
            </p>
            <p className="mt-1 text-sm text-muted">
              Next step: Choose the 8 best third-place teams.
            </p>
          </div>

          <Link
            href="/third-place-teams"
            className={[
              "rounded-full px-6 py-3 text-sm font-semibold transition",
              completed === 12
                ? "bg-gold text-black hover:opacity-90"
                : "pointer-events-none bg-white/10 text-muted",
            ].join(" ")}
          >
            Continue to Third Place Teams →
          </Link>
        </div>
      </div>
      
      <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.18, 0.67, 0.6, 1)" }}>
        {activeTeam ? <TeamCard team={activeTeam} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
