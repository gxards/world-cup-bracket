"use client";

import { useEffect, useMemo, useState } from "react";
import { GROUPS, flagUrl } from "@/lib/teams";
import {
  STORYLINES,
  STORYLINES_STORAGE_KEY,
  type StorylineCountry,
  type StorylineKey,
  type StorylineSelections,
} from "@/lib/storylines";

const emptySelections: StorylineSelections = {
  tournamentWinner: null,
  runnerUp: null,
  darkHorse: null,
  underachievers: null,
  groupStageFlop: null,
  perfectRecord: null,
};

function buildCountryOptions(): StorylineCountry[] {
  return GROUPS.flatMap((group) =>
    group.teams.map((team) => ({
      countryId: team.id,
      countryName: team.name,
      flagCode: team.flagCode,
      groupLetter: group.letter,
    }))
  );
}

export function StorylinesPrediction() {
  const countries = useMemo(() => buildCountryOptions(), []);
  const [selections, setSelections] =
    useState<StorylineSelections>(emptySelections);
  const [resetTick, setResetTick] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORYLINES_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StorylineSelections;
      if (parsed && typeof parsed === "object") {
        setSelections({ ...emptySelections, ...parsed });
      }
    } catch {
      // ignore broken storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORYLINES_STORAGE_KEY, JSON.stringify(selections));
  }, [selections]);

  const filledCount = useMemo(
    () => Object.values(selections).filter(Boolean).length,
    [selections]
  );

  function setPick(key: StorylineKey, country: StorylineCountry | null) {
    setSelections((prev) => ({ ...prev, [key]: country }));
  }

  function clearAll() {
    setSelections(emptySelections);
    setResetTick((v) => v + 1);
    localStorage.removeItem(STORYLINES_STORAGE_KEY);
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
                Storylines
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
                Prediction Board
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Pick a country for every storyline and keep your takes saved locally.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:min-w-[320px] lg:justify-end">
              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Locked Takes
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {filledCount}/6
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

        <div className="relative mt-6 grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {STORYLINES.map((storyline) => (
            <StorylinePicker
              key={storyline.key}
              storyKey={storyline.key}
              label={storyline.label}
              description={storyline.description}
              helper={storyline.helper}
              countries={countries}
              selection={selections[storyline.key]}
              onSelect={(country) => setPick(storyline.key, country)}
              onClear={() => setPick(storyline.key, null)}
              resetTick={resetTick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StorylinePicker({
  storyKey,
  label,
  description,
  helper,
  countries,
  selection,
  onSelect,
  onClear,
  resetTick,
}: {
  storyKey: StorylineKey;
  label: string;
  description: string;
  helper: string;
  countries: StorylineCountry[];
  selection: StorylineCountry | null;
  onSelect: (country: StorylineCountry) => void;
  onClear: () => void;
  resetTick: number;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;

    return countries.filter(
      (country) =>
        country.countryName.toLowerCase().includes(q) ||
        country.groupLetter.toLowerCase().includes(q)
    );
  }, [countries, query]);

  useEffect(() => {
    if (selection) {
      setQuery(selection.countryName);
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
      className={`group relative flex h-full flex-col overflow-visible rounded-[1.75rem]
      border border-white/10 bg-linear-to-b from-white/[0.08] to-white/[0.03]
      p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl
      transition duration-300 hover:-translate-y-0.5
      hover:border-white/15 hover:shadow-[0_24px_80px_rgba(0,0,0,0.28)]
      ${open ? "z-[999]" : "z-0"}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold via-white/25 to-accent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl transition group-hover:scale-110"
        aria-hidden
      />

      <div className="flex min-h-[150px] flex-col justify-start">
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

      <div className="flex-1" />

      <div className="relative mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Search country
        </label>

        <div className="relative">
          <input
            type="text"
            value={selection ? selection.countryName : query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            readOnly={Boolean(selection)}
            placeholder="Type a country..."
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
                    {results.map((country) => (
                      <li key={country.countryId}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(country);
                            setQuery(country.countryName);
                            setOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-white/5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={flagUrl(country.flagCode)}
                              alt={`${country.countryName} flag`}
                              className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {country.countryName}
                              </p>
                              <p className="mt-0.5 text-xs text-muted">
                                Group {country.groupLetter}
                              </p>
                            </div>
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
                    No matching countries.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {selection ? (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
            <img
              src={flagUrl(selection.flagCode)}
              alt={`${selection.countryName} flag`}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
            />
            <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Locked
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {selection.countryName}
              </p>
              <p className="text-xs text-muted">Group {selection.groupLetter}</p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted">
            Pick one country for this storyline.
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