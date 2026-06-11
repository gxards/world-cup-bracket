export function Hero() {
  return (
    <section className="hero-gradient pitch-lines relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          USA · Canada · Mexico · 48 Teams
        </div>

        <h1 className="font-display mt-8 max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Predict the{" "}
          <span className="bg-linear-to-r from-gold via-[#f5e6a8] to-gold bg-clip-text text-transparent">
            Greatest Show
          </span>{" "}
          on Earth
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Build your World Cup 2026 bracket before kickoff. Groups, third-place
          ties, knockouts, awards, and the storylines that define the tournament.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/group-stage"
            className="gold-glow inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-background transition hover:bg-[#f5d76a] hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlayIcon />
            Start Predicting
          </a>
        </div>

        <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-white/8 pt-10 sm:max-w-lg">
          <Stat label="Hosts" value="3" />
          <Stat label="Teams" value="48" />
          <Stat label="Matches" value="104" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="font-display mt-1 text-3xl font-bold text-gold">{value}</dd>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}