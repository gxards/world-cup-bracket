"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AWARDS,
  filterPlayersForAward,
  type AwardKey,
  type AwardPlayer,
  type AwardSelections,
} from "@/lib/awards";

const STORAGE_KEY = "wc26-awards-predictions";

const emptySelections: AwardSelections = {
  goldenBoot: null,
  topAssister: null,
  goldenBall: null,
  goldenGlove: null,
  youngPlayer: null,
};

export function TournamentAwardsPrediction({
  players,
}: {
  players: AwardPlayer[];
}) {
  const [selections, setSelections] = useState<AwardSelections>(emptySelections);
  const [resetTick, setResetTick] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as AwardSelections;
      if (parsed && typeof parsed === "object") {
        setSelections({ ...emptySelections, ...parsed });
      }
    } catch {
      // ignore broken storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  }, [selections]);

  const filledCount = useMemo(
    () => Object.values(selections).filter(Boolean).length,
    [selections]
  );

  function setPick(award: AwardKey, player: AwardPlayer | null) {
    setSelections((prev) => ({ ...prev, [award]: player }));
  }

  function clearAll() {
    setSelections(emptySelections);
    setResetTick((v) => v + 1);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <section className="relative overflow-visible px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        aria-hidden
      >
        <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute right-[-40px] top-40 h-64 w-64 rounded-full bg-[#a855f7]/10 blur-3xl" />
        <div className="absolute left-[-40px] bottom-20 h-64 w-64 rounded-full bg-[#f97316]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/8 bg-linear-to-b from-white/5 to-white/[0.02] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Tournament Awards
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
                Prediction Board
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Search the full player pool, pick one player per award, and keep every choice saved locally.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:min-w-[320px] lg:justify-end">
              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Locked awards
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {filledCount}/5
                </p>
              </div>

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-background/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:border-white/20 hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {AWARDS.slice(0, 3).map((award) => (
            <AwardPicker
              key={award.key}
              award={award.key}
              label={award.label}
              description={award.description}
              helper={award.helper}
              players={players}
              selection={selections[award.key]}
              onSelect={(player) => setPick(award.key, player)}
              onClear={() => setPick(award.key, null)}
              resetTick={resetTick}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2">
            {AWARDS.slice(3).map((award) => (
              <AwardPicker
                key={award.key}
                award={award.key}
                label={award.label}
                description={award.description}
                helper={award.helper}
                players={players}
                selection={selections[award.key]}
                onSelect={(player) => setPick(award.key, player)}
                onClear={() => setPick(award.key, null)}
                resetTick={resetTick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardPicker({
  award,
  label,
  description,
  helper,
  players,
  selection,
  onSelect,
  onClear,
  resetTick,
}: {
  award: AwardKey;
  label: string;
  description: string;
  helper: string;
  players: AwardPlayer[];
  selection: AwardPlayer | null;
  onSelect: (player: AwardPlayer) => void;
  onClear: () => void;
  resetTick: number;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(
    () => filterPlayersForAward(players, award, query).slice(0, 20),
    [players, award, query]
  );

  useEffect(() => {
    if (selection) {
      setQuery(selection.name);
      setOpen(false);
    }
  }, [selection]);

  useEffect(() => {
    setQuery("");
    setOpen(false);
  }, [resetTick]);

  function handleFocus() {
    if (!selection) setOpen(true);
  }

  function handleChange(value: string) {
    setQuery(value);
    setOpen(true);
  }

  function handleClear() {
    setQuery("");
    setOpen(false);
    onClear();
  }

  return (
    <article
      className={`group relative flex h-full flex-col overflow-visible rounded-[1.75rem] border border-white/10 bg-linear-to-b from-white/[0.08] to-white/[0.03] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_24px_80px_rgba(0,0,0,0.28)] ${
        open ? "z-[999]" : "z-0"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold via-white/25 to-accent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl transition group-hover:scale-110"
        aria-hidden
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/90">
            {label}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {description}
          </h2>
          <p className="mt-1 text-sm text-muted">{helper}</p>
        </div>
      </div>

      <div className="relative mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Search player
        </label>

        <div className="relative">
          <input
            type="text"
            value={selection ? selection.name : query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            readOnly={Boolean(selection)}
            placeholder="Type a player or country..."
            className="w-full rounded-2xl border border-white/10 bg-background/80 px-4 py-3 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-gold/40 focus:bg-background"
          />

          {selection ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 p-1.5 text-muted transition hover:border-white/20 hover:text-foreground"
              aria-label={`Clear ${label} prediction`}
            >
              <CloseIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 p-1.5 text-muted transition hover:border-white/20 hover:text-foreground"
              aria-label="Toggle search results"
            >
              <ChevronIcon />
            </button>
          )}

          {!selection && open ? (
            <div className="absolute left-0 top-full z-[1000] mt-2 w-full rounded-2xl border border-white/10 bg-background/95 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="max-h-[18rem] overflow-y-auto">
                {results.length > 0 ? (
                  <ul className="divide-y divide-white/5 py-1">
                    {results.map((player) => (
                      <li key={`${player.country}-${player.name}`}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(player);
                            setQuery(player.name);
                            setOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-white/5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {player.name}
                            </p>
                            <p className="mt-0.5 text-xs text-muted">
                              {player.country} · {player.position}
                              {typeof player.age === "number"
                                ? ` · ${player.age}`
                                : ""}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                            Select
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-muted">
                    No matching eligible players.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {selection ? (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
            <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Locked
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {selection.name}
              </p>
              <p className="text-xs text-muted">
                {selection.country} · {selection.position}
                {typeof selection.age === "number" ? ` · ${selection.age}` : ""}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted">
            Only eligible players appear in the list.
          </p>
        )}
      </div>
    </article>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}