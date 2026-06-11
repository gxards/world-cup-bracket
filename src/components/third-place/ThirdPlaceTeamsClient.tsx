"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useGroupPlacements } from "@/hooks/useGroupPlacements";
import { useThirdPlaceSelections } from "@/hooks/useThirdPlaceSelections";
import { createEmptyPlacements } from "@/lib/group-stage";
import { GROUPS, getTeam, flagUrl } from "@/lib/teams";

type ThirdPlaceEntry = {
  groupId: string;
  groupLetter: string;
  teamId: string | null;
  team: ReturnType<typeof getTeam> | undefined;
};

function TeamFlag({ code, name }: { code: string; name: string }) {
  return (
    <img
      src={flagUrl(code)}
      alt={`${name} flag`}
      className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
    />
  );
}

function ThirdPlaceTeamCard({
  entry,
  selected,
  disabled,
  onClick,
}: {
  entry: ThirdPlaceEntry;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const team = entry.team;

  if (!team) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 opacity-60">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Group {entry.groupLetter}
          </p>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Pending
          </span>
        </div>
        <p className="mt-4 text-sm text-muted">
          Third-place team not available yet.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-full rounded-3xl border p-4 text-left transition duration-200",
        "bg-card/80 backdrop-blur-xl",
        selected
          ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
          : "border-red-500/20 bg-red-500/8 hover:border-red-400/35 hover:bg-red-500/12",
        disabled ? "cursor-not-allowed opacity-80" : "hover:-translate-y-0.5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <TeamFlag code={team.flagCode} name={team.name} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{team.name}</p>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Group {entry.groupLetter}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              FIFA Rank {team.fifaRanking} • {team.confederation}
            </p>
          </div>
        </div>

        <span
          className={[
            "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
            selected
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-red-500/15 text-red-300",
          ].join(" ")}
        >
          {selected ? "Qualified" : "Eliminated"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>Form</span>
        <span className="font-semibold tracking-[0.16em] text-foreground">
          {team.form.join(" • ")}
        </span>
      </div>
    </button>
  );
}

function TeamMiniCard({
  teamId,
  selected,
  onRemove,
}: {
  teamId: string;
  selected: boolean;
  onRemove?: () => void;
}) {
  const team = getTeam(teamId);
  if (!team) return null;

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border p-3",
        selected
          ? "border-emerald-400/30 bg-emerald-500/10"
          : "border-red-500/20 bg-red-500/8",
      ].join(" ")}
    >
      <img
        src={flagUrl(team.flagCode)}
        alt={`${team.name} flag`}
        className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{team.name}</p>
        <p className="text-xs text-muted">Group {GROUPS.find((g) => g.teams.some((t) => t.id === team.id))?.letter}</p>
      </div>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-muted transition hover:border-white/20 hover:text-foreground"
        >
          Remove
        </button>
      ) : null}
    </div>
  );
}

export function ThirdPlaceTeamsClient() {
  const router = useRouter();
  const { placements, hydrated } = useGroupPlacements();
  const [warning, setWarning] = useState<string | null>(null);

  const thirdPlaceEntries: ThirdPlaceEntry[] = useMemo(() => {
    return GROUPS.map((group) => {
      const teamId = placements[group.id]?.[3] ?? null;
      const team = teamId ? getTeam(teamId) : undefined;

      return {
        groupId: group.id,
        groupLetter: group.letter,
        teamId,
        team,
      };
    });
  }, [placements]);

  const candidateIds = useMemo(
    () => thirdPlaceEntries.flatMap((entry) => (entry.team ? [entry.team.id] : [])),
    [thirdPlaceEntries]
  );

  const {
    selectedIds,
    toggleSelection,
    resetSelections,
    hydrated: selectionsHydrated,
  } = useThirdPlaceSelections(candidateIds);

  const selectedEntries = useMemo(
    () =>
      thirdPlaceEntries.filter(
        (entry) => entry.team && selectedIds.includes(entry.team.id)
      ),
    [thirdPlaceEntries, selectedIds]
  );

  const eliminatedEntries = useMemo(
    () =>
      thirdPlaceEntries.filter(
        (entry) => entry.team && !selectedIds.includes(entry.team.id)
      ),
    [thirdPlaceEntries, selectedIds]
  );

  const selectedCount = selectedIds.length;
  const canContinue = selectedCount === 8;

  function handleToggle(teamId: string) {
    const isSelected = selectedIds.includes(teamId);

    if (!isSelected && selectedIds.length >= 8) {
      setWarning("You can only qualify exactly 8 third-place teams.");
      return;
    }

    setWarning(null);
    toggleSelection(teamId);
  }

  function handleContinue() {
    if (!canContinue) return;
    router.push("/knockout-stage");
  }

  if (!hydrated || !selectionsHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted">Loading third-place teams…</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="hero-gradient pitch-lines border-b border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/group-stage"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground"
          >
            <span aria-hidden>←</span> Back to group stage
          </Link>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                Best <span className="text-gold">Third Place</span> Teams
              </h1>
              <p className="mt-3 max-w-2xl text-muted">
                Choose exactly 8 teams to qualify for the knockout stage.
                No auto-ranking — this part is fully manual.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Selection Progress
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 w-40 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-gold to-accent transition-all duration-300"
                    style={{ width: `${(selectedCount / 8) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {selectedCount}/8
                </span>
              </div>
            </div>
          </div>

          {warning ? (
            <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {warning}
            </div>
          ) : null}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/8 bg-card/70 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Total third-place teams
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">12</p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-card/70 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Qualified teams
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{selectedCount}</p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-card/70 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Eliminated teams
            </p>
            <p className="mt-2 text-3xl font-bold text-red-300">{12 - selectedCount}</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {thirdPlaceEntries.map((entry) => (
            <ThirdPlaceTeamCard
              key={entry.groupId}
              entry={entry}
              selected={Boolean(entry.team && selectedIds.includes(entry.team.id))}
              disabled={!entry.team}
              onClick={entry.team ? () => handleToggle(entry.team!.id) : undefined}
            />
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-400/15 bg-card/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Qualified Teams (8)
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  Your knockout qualifiers
                </h2>
              </div>
              <button
                type="button"
                onClick={resetSelections}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-muted transition hover:border-white/20 hover:text-foreground"
              >
                Reset
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {selectedEntries.length > 0 ? (
                selectedEntries.map((entry) => (
                  <TeamMiniCard
                    key={entry.groupId}
                    teamId={entry.team!.id}
                    selected
                    onRemove={() => handleToggle(entry.team!.id)}
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-muted">
                  No teams selected yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-red-400/15 bg-card/70 p-6 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
              Eliminated Teams (4)
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              Left out of the knockout stage
            </h2>

            <div className="mt-5 grid gap-3">
              {eliminatedEntries.length > 0 ? (
                eliminatedEntries.map((entry) => (
                  <TeamMiniCard
                    key={entry.groupId}
                    teamId={entry.team!.id}
                    selected={false}
                    onRemove={() => handleToggle(entry.team!.id)}
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-muted">
                  All available third-place teams have been qualified.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/8 bg-card/70 p-6 backdrop-blur-xl md:flex-row">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Select exactly 8 teams to continue.
            </p>
            <p className="mt-1 text-sm text-muted">
              The button unlocks when your selection is complete.
            </p>
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className={[
              "rounded-full px-6 py-3 text-sm font-semibold transition",
              canContinue
                ? "bg-gold text-black hover:opacity-90"
                : "cursor-not-allowed bg-white/10 text-muted",
            ].join(" ")}
          >
            Continue to Knockout Stage
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
