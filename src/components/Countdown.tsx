"use client";

import { useEffect, useMemo, useState } from "react";
import { getTimeRemaining } from "@/lib/tournament";

const WORLD_CUP_FINAL = new Date("2026-07-19T15:00:00-04:00");

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const isFinalDayOrLater = now >= WORLD_CUP_FINAL.getTime();

  const remaining = useMemo(
    () => getTimeRemaining(WORLD_CUP_FINAL, now),
    [now]
  );

  if (!mounted) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/8 bg-card/70 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted">Loading countdown…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/8 bg-card/70 p-6 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Countdown to the World Cup Final
        </p>

        {isFinalDayOrLater ? (
          <div className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 p-5 text-center">
            <p className="text-2xl font-bold text-gold sm:text-3xl">
              The World Cup Final is here.
            </p>
            <p className="mt-2 text-sm text-muted">
              July 19, 2026 • New York New Jersey Stadium
            </p>
          </div>
        ) : (
          <div
            aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds until the World Cup final`}
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <div className="rounded-2xl border border-white/8 bg-black/10 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{remaining.days}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                Days
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/10 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{remaining.hours}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                Hours
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/10 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">
                {remaining.minutes}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                Minutes
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/10 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">
                {remaining.seconds}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                Seconds
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}