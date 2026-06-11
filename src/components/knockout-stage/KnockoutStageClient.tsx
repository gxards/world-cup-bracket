"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { useGroupPlacements } from "@/hooks/useGroupPlacements";
import { useThirdPlaceSelections } from "@/hooks/useThirdPlaceSelections";
import {
  buildRoundOf32,
  getMatchWinner,
  type BracketTeam,
  type KnockoutMatch,
  type KnockoutRound,
} from "@/lib/knockout-stage";
import { GROUPS, flagUrl } from "@/lib/teams";

const STORAGE_KEY = "wc26-knockout-winners";

const TEAM_ABBR: Record<string, string> = {
  mexico: "MEX",
  "south-africa": "RSA",
  "south-korea": "KOR",
  czechia: "CZE",
  canada: "CAN",
  switzerland: "SUI",
  qatar: "QAT",
  bosnia: "BIH",
  brazil: "BRA",
  morocco: "MAR",
  scotland: "SCO",
  haiti: "HTI",
  usa: "USA",
  paraguay: "PAR",
  australia: "AUS",
  turkiye: "TUR",
  germany: "GER",
  curacao: "CUW",
  "ivory-coast": "CIV",
  ecuador: "ECU",
  netherlands: "NED",
  japan: "JPN",
  tunisia: "TUN",
  sweden: "SWE",
  belgium: "BEL",
  egypt: "EGY",
  iran: "IRN",
  "new-zealand": "NZL",
  spain: "ESP",
  uruguay: "URU",
  "saudi-arabia": "KSA",
  "cape-verde": "CPV",
  france: "FRA",
  senegal: "SEN",
  norway: "NOR",
  iraq: "IRQ",
  argentina: "ARG",
  algeria: "ALG",
  austria: "AUT",
  jordan: "JOR",
  portugal: "POR",
  colombia: "COL",
  uzbekistan: "UZB",
  "dr-congo": "COD",
  england: "ENG",
  croatia: "CRO",
  ghana: "GHA",
  panama: "PAN",
};

const LEFT_X = [5.5, 16.7, 27.9, 39, 50] as const;

function teamAbbr(team: BracketTeam) {
  return (
    TEAM_ABBR[team.id] ??
    team.name.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X")
  );
}

function createMatch(
  id: string,
  round: KnockoutRound,
  teamA: BracketTeam | null,
  teamB: BracketTeam | null
): KnockoutMatch {
  return {
    id,
    round,
    title: id,
    teamA,
    teamB,
  };
}

function getLoser(match: KnockoutMatch | null, winnerMap: Record<string, string>) {
  if (!match) return null;
  const winner = getMatchWinner(match, winnerMap);
  if (!winner) return null;

  if (match.teamA?.id === winner.id) return match.teamB;
  if (match.teamB?.id === winner.id) return match.teamA;

  return null;
}

function buildSequentialRound(
  prev: KnockoutMatch[],
  round: KnockoutRound,
  prefix: string,
  winnerMap: Record<string, string>
): KnockoutMatch[] {
  const out: KnockoutMatch[] = [];

  for (let i = 0; i < prev.length; i += 2) {
    const matchA = prev[i] ?? null;
    const matchB = prev[i + 1] ?? null;

    out.push(
      createMatch(
        `${prefix}-${out.length + 1}`,
        round,
        matchA ? getMatchWinner(matchA, winnerMap) : null,
        matchB ? getMatchWinner(matchB, winnerMap) : null
      )
    );
  }

  return out;
}

function CompactRow({
  team,
  active,
  disabled,
  onClick,
}: {
  team: BracketTeam | null;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  if (!team) {
    return <div className="h-7 rounded-lg border border-dashed border-white/8 bg-white/3" />;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 rounded-lg border px-2 py-1 text-left transition",
        active
          ? "border-gold/40 bg-gold/10 ring-1 ring-gold/15"
          : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-black/20",
        disabled ? "cursor-not-allowed opacity-75" : "",
      ].join(" ")}
      aria-label={team.name}
    >
      <img
        src={flagUrl(team.flagCode)}
        alt={`${team.name} flag`}
        className="h-4.5 w-4.5 shrink-0 rounded-full object-cover ring-1 ring-white/10"
      />
      <span className="min-w-0 flex-1 truncate text-[10px] font-semibold tracking-[0.16em] text-foreground">
        {teamAbbr(team)}
      </span>
    </button>
  );
}

function MatchCard({
  match,
  winnerId,
  onPick,
}: {
  match: KnockoutMatch;
  winnerId?: string;
  onPick: (matchId: string, teamId: string) => void;
}) {
  const ready = Boolean(match.teamA && match.teamB);

  return (
    <div className="rounded-xl border border-white/8 bg-card/70 p-2 backdrop-blur-xl shadow-lg">
      <div className="grid gap-1">
        <CompactRow
          team={match.teamA}
          active={winnerId === match.teamA?.id}
          disabled={!ready}
          onClick={() => match.teamA && onPick(match.id, match.teamA.id)}
        />
        <CompactRow
          team={match.teamB}
          active={winnerId === match.teamB?.id}
          disabled={!ready}
          onClick={() => match.teamB && onPick(match.id, match.teamB.id)}
        />
      </div>
    </div>
  );
}

function PodiumCard({
  label,
  team,
  highlight = false,
}: {
  label: string;
  team: BracketTeam | null;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border bg-card/70 p-3 backdrop-blur-xl",
        highlight ? "border-gold/20" : "border-white/8",
      ].join(" ")}
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p
        className={[
          "mt-1 truncate text-sm font-bold",
          highlight ? "text-gold" : "text-foreground",
        ].join(" ")}
      >
        {team ? teamAbbr(team) : "TBD"}
      </p>
    </div>
  );
}

function BracketCell({
  col,
  row,
  rowSpan,
  side,
  children,
}: {
  col: number;
  row: number;
  rowSpan: number;
  side: "left" | "right" | "center";
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "flex min-h-0",
        side === "left"
          ? "justify-start pr-2"
          : side === "right"
            ? "justify-end pl-2"
            : "justify-center px-2",
      ].join(" ")}
      style={{
        gridColumn: col,
        gridRow: `${row} / span ${rowSpan}`,
      }}
    >
      <div className="flex h-full w-full items-center">{children}</div>
    </div>
  );
}

function ConnectorLayer() {
  const branchPath = (xOuter: number, xInner: number, y1: number, y2: number) => {
    const joinX = (xOuter + xInner) / 2;
    const joinY = (y1 + y2) / 2;

    return [
      `M ${xOuter} ${y1} H ${joinX}`,
      `M ${xOuter} ${y2} H ${joinX}`,
      `M ${joinX} ${y1} V ${joinY}`,
      `M ${joinX} ${y2} V ${joinY}`,
      `M ${joinX} ${joinY} H ${xInner}`,
    ].join(" ");
  };

  const leftPaths = [
    branchPath(LEFT_X[0], LEFT_X[1], 6.25, 18.75),
    branchPath(LEFT_X[0], LEFT_X[1], 31.25, 43.75),
    branchPath(LEFT_X[0], LEFT_X[1], 56.25, 68.75),
    branchPath(LEFT_X[0], LEFT_X[1], 81.25, 93.75),
    branchPath(LEFT_X[1], LEFT_X[2], 12.5, 37.5),
    branchPath(LEFT_X[1], LEFT_X[2], 62.5, 87.5),
    branchPath(LEFT_X[2], LEFT_X[3], 25, 75),
    `M ${LEFT_X[3]} 50 H ${LEFT_X[4]}`,
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g
        fill="none"
        stroke="#d8c47a"
        strokeWidth="0.18"
        strokeLinecap="round"
        opacity="0.7"
      >
        {leftPaths.map((d, index) => (
          <path key={`l-${index}`} d={d} />
        ))}
      </g>

      <g
        fill="none"
        stroke="#d8c47a"
        strokeWidth="0.18"
        strokeLinecap="round"
        opacity="0.7"
        style={{
          transform: "scaleX(-1)",
          transformOrigin: "center",
        }}
      >
        {leftPaths.map((d, index) => (
          <path key={`r-${index}`} d={d} />
        ))}
      </g>
    </svg>
  );
}

function BoardMatchCell({
  col,
  row,
  rowSpan,
  side,
  match,
  winnerMap,
  onPick,
}: {
  col: number;
  row: number;
  rowSpan: number;
  side: "left" | "right" | "center";
  match: KnockoutMatch;
  winnerMap: Record<string, string>;
  onPick: (matchId: string, teamId: string) => void;
}) {
  return (
    <BracketCell col={col} row={row} rowSpan={rowSpan} side={side}>
      <MatchCard match={match} winnerId={winnerMap[match.id]} onPick={onPick} />
    </BracketCell>
  );
}

export function KnockoutStageClient() {
  const { placements, hydrated: placementsHydrated } = useGroupPlacements();
  const [winnerMap, setWinnerMap] = useState<Record<string, string>>({});
  const [winnerHydrated, setWinnerHydrated] = useState(false);

  const candidateIds = useMemo(
    () =>
      GROUPS.flatMap((group) => {
        const third = placements[group.id]?.[3];
        return third ? [third] : [];
      }),
    [placements]
  );

  const { selectedIds, hydrated: thirdPlaceHydrated } =
    useThirdPlaceSelections(candidateIds);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>;
        if (parsed && typeof parsed === "object") {
          setWinnerMap(parsed);
        }
      }
    } catch {
      // ignore invalid storage
    } finally {
      setWinnerHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!winnerHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(winnerMap));
  }, [winnerHydrated, winnerMap]);

  const roundOf32 = useMemo(
    () => buildRoundOf32(placements, selectedIds),
    [placements, selectedIds]
  );

  const leftR32 = roundOf32.slice(0, 8);
  const rightR32 = roundOf32.slice(8, 16);

  const leftR16 = useMemo(
    () => buildSequentialRound(leftR32, "R16", "left-r16", winnerMap),
    [leftR32, winnerMap]
  );
  const rightR16 = useMemo(
    () => buildSequentialRound(rightR32, "R16", "right-r16", winnerMap),
    [rightR32, winnerMap]
  );

  const leftQF = useMemo(
    () => buildSequentialRound(leftR16, "QF", "left-qf", winnerMap),
    [leftR16, winnerMap]
  );
  const rightQF = useMemo(
    () => buildSequentialRound(rightR16, "QF", "right-qf", winnerMap),
    [rightR16, winnerMap]
  );

  const leftSF = useMemo(
    () => buildSequentialRound(leftQF, "SF", "left-sf", winnerMap),
    [leftQF, winnerMap]
  );
  const rightSF = useMemo(
    () => buildSequentialRound(rightQF, "SF", "right-sf", winnerMap),
    [rightQF, winnerMap]
  );

  const finalMatch = useMemo(
    () =>
      createMatch(
        "final",
        "F",
        leftSF[0] ? getMatchWinner(leftSF[0], winnerMap) : null,
        rightSF[0] ? getMatchWinner(rightSF[0], winnerMap) : null
      ),
    [leftSF, rightSF, winnerMap]
  );

  const thirdPlacePlayoff = useMemo(
    () =>
      createMatch(
        "third-place-playoff",
        "3P",
        getLoser(leftSF[0] ?? null, winnerMap),
        getLoser(rightSF[0] ?? null, winnerMap)
      ),
    [leftSF, rightSF, winnerMap]
  );

  useEffect(() => {
    if (!winnerHydrated) return;

    const allMatches = [
      ...leftR16,
      ...rightR16,
      ...leftQF,
      ...rightQF,
      ...leftSF,
      ...rightSF,
      finalMatch,
      thirdPlacePlayoff,
    ];

    setWinnerMap((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const match of allMatches) {
        const picked = next[match.id];
        if (picked && picked !== match.teamA?.id && picked !== match.teamB?.id) {
          delete next[match.id];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [
    winnerHydrated,
    leftR16,
    rightR16,
    leftQF,
    rightQF,
    leftSF,
    rightSF,
    finalMatch,
    thirdPlacePlayoff,
  ]);

  const champion = getMatchWinner(finalMatch, winnerMap);
  const runnerUp =
    champion && finalMatch.teamA?.id === champion.id
      ? finalMatch.teamB
      : champion && finalMatch.teamB?.id === champion.id
        ? finalMatch.teamA
        : null;
  const thirdPlaceWinner = getMatchWinner(thirdPlacePlayoff, winnerMap);

  function pickWinner(matchId: string, teamId: string) {
    setWinnerMap((prev) => ({
      ...prev,
      [matchId]: teamId,
    }));
  }

  function resetBracket() {
    setWinnerMap({});
    localStorage.removeItem(STORAGE_KEY);
  }

  if (!placementsHydrated || !thirdPlaceHydrated || !winnerHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted">Loading knockout bracket…</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="hero-gradient pitch-lines border-b border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <Link
            href="/third-place-teams"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground"
          >
            <span aria-hidden>←</span> Back to third-place teams
          </Link>

          <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-[1.9rem]">
                Knockout <span className="text-gold">Bracket</span>
              </h1>
              <p className="mt-0.5 max-w-2xl text-xs text-muted sm:text-sm">
                9-column tournament tree from the Round of 32 to the final.
              </p>
            </div>

            <div className="w-full max-w-[480px] rounded-xl border border-white/8 bg-card/70 p-2.5 backdrop-blur-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
                Podium
              </p>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                <PodiumCard label="Runner-up" team={runnerUp} />
                <PodiumCard label="Champion" team={champion} highlight />
                <PodiumCard label="Third Place" team={thirdPlaceWinner} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex h-[calc(100vh-112px)] flex-col overflow-hidden px-3 py-1 sm:px-6 lg:px-8">
        <div className="mx-auto mb-1 flex max-w-7xl justify-end">
          <button
            type="button"
            onClick={resetBracket}
            className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-muted transition hover:border-white/20 hover:text-foreground"
          >
            Reset bracket
          </button>
        </div>

        <div className="relative mx-auto min-h-0 flex-1 w-full max-w-[1700px] overflow-hidden rounded-[28px]">
          <ConnectorLayer />

          <div
            className="relative z-10 grid h-full gap-y-0.5"
            style={{
              gridTemplateColumns:
                "minmax(0,1.05fr) minmax(0,0.95fr) minmax(0,0.8fr) minmax(0,0.65fr) minmax(260px,0.9fr) minmax(0,0.65fr) minmax(0,0.8fr) minmax(0,0.95fr) minmax(0,1.05fr)",
              gridTemplateRows: "repeat(8, minmax(0, 1fr))",
            }}
          >
            {leftR32.map((match, index) => (
              <BoardMatchCell
                key={match.id}
                col={1}
                row={index + 1}
                rowSpan={1}
                side="left"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}

            {leftR16.map((match, index) => (
              <BoardMatchCell
                key={match.id}
                col={2}
                row={index * 2 + 1}
                rowSpan={2}
                side="left"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}

            {leftQF.map((match, index) => (
              <BoardMatchCell
                key={match.id}
                col={3}
                row={index * 4 + 1}
                rowSpan={4}
                side="left"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}

            {leftSF.map((match) => (
              <BoardMatchCell
                key={match.id}
                col={4}
                row={1}
                rowSpan={8}
                side="left"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}

            <BracketCell col={5} row={1} rowSpan={8} side="center">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-1">
                <div className="w-full max-w-[250px] rounded-2xl border border-gold/20 bg-card/80 p-2.5 backdrop-blur-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Final
                  </p>
                  <div className="mt-1.5">
                    <MatchCard
                      match={finalMatch}
                      winnerId={winnerMap[finalMatch.id]}
                      onPick={pickWinner}
                    />
                  </div>
                </div>

                <div className="w-full max-w-[210px] rounded-xl border border-white/8 bg-card/65 p-2 backdrop-blur-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    Third-place playoff
                  </p>
                  <div className="mt-1.5">
                    <MatchCard
                      match={thirdPlacePlayoff}
                      winnerId={winnerMap[thirdPlacePlayoff.id]}
                      onPick={pickWinner}
                    />
                  </div>
                </div>
              </div>
            </BracketCell>

            {rightSF.map((match) => (
              <BoardMatchCell
                key={match.id}
                col={6}
                row={1}
                rowSpan={8}
                side="right"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}

            {rightQF.map((match, index) => (
              <BoardMatchCell
                key={match.id}
                col={7}
                row={index * 4 + 1}
                rowSpan={4}
                side="right"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}

            {rightR16.map((match, index) => (
              <BoardMatchCell
                key={match.id}
                col={8}
                row={index * 2 + 1}
                rowSpan={2}
                side="right"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}

            {rightR32.map((match, index) => (
              <BoardMatchCell
                key={match.id}
                col={9}
                row={index + 1}
                rowSpan={1}
                side="right"
                match={match}
                winnerMap={winnerMap}
                onPick={pickWinner}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}