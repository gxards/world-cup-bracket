import Link from "next/link";

const sections = [
  {
    id: "group-stage",
    title: "Group Stage",
    description:
      "Pick finishing positions across all twelve groups in the expanded 48-team format.",
    icon: GroupsIcon,
    accent: "from-accent-blue/30 to-accent-blue/5",
    badge: "12 Groups",
    href: "/group-stage",
    available: true,
  },
  {
    id: "awards",
    title: "Awards",
    description:
      "Golden Boot, Golden Ball, Golden Glove, and Young Player — call every winner.",
    icon: AwardsIcon,
    accent: "from-[#a855f7]/25 to-[#a855f7]/5",
    badge: "5 Awards",
    href: "/awards",
    available: true,
  },
  {
    id: "storylines",
    title: "Storylines",
    description:
      "Bold takes on upsets, dark horses, and the narratives that define 2026.",
    icon: StorylinesIcon,
    accent: "from-[#f97316]/25 to-[#f97316]/5",
    badge: "Your Takes",
    href: "/storylines",
    available: true,
  },
] as const;

export function NavCards() {
  return (
    <section id="predict" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Your Tournament Hub
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Build Every Prediction
          </h2>
          <p className="mt-3 text-muted">
            Three paths through the tournament. Group Stage, Awards, and Storylines are live.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <li key={section.id}>
              <NavCard {...section} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type Section = (typeof sections)[number];

function NavCard({
  title,
  description,
  icon: Icon,
  accent,
  badge,
  href,
  available,
}: Section) {
  const ctaClass =
    "relative mt-6 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition";

  return (
    <article className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition duration-300 hover:border-white/15 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br ${accent} blur-2xl transition group-hover:scale-110`}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-surface-elevated text-gold">
          <Icon />
        </span>
        <span className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs font-medium text-muted">
          {badge}
        </span>
      </div>

      <h3 className="font-display relative mt-5 text-xl font-semibold uppercase tracking-wide">
        {title}
      </h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">
        {description}
      </p>

      {available && href ? (
        <Link
          href={href}
          className={`${ctaClass} border-gold/20 bg-gold/10 text-gold group-hover:border-gold/40 group-hover:bg-gold/15`}
        >
          <span>Predict now</span>
          <ArrowIcon />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={`${ctaClass} border-white/10 bg-surface-elevated/80 text-muted group-hover:border-gold/30 group-hover:text-foreground disabled:cursor-not-allowed`}
          aria-disabled="true"
        >
          <span>Coming soon</span>
          <ArrowIcon />
        </button>
      )}
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function GroupsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function AwardsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 13L7 21l5-3 5 3-1.5-8" />
    </svg>
  );
}

function StorylinesIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M4 19h16M6 4h12v12H6z" />
      <path d="M8 8h8M8 12h5" />
    </svg>
  );
}