export const TOURNAMENT_KICKOFF = new Date("2026-06-11T17:00:00Z");

export type TimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export function getTimeRemaining(target: Date, nowMs = Date.now()): TimeRemaining {
  const totalMs = Math.max(0, target.getTime() - nowMs);
  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, totalMs };
}