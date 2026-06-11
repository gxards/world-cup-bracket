import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Group Stage", href: "/group-stage" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-background/80 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-gold to-gold-dim text-background font-display text-lg font-bold"
            aria-hidden
          >
            26
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold tracking-widest text-gold uppercase">
              World Cup
            </span>
            <span className="text-xs font-medium text-muted">Predictor</span>
          </div>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/group-stage"
          className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold text-background transition hover:bg-[#f5d76a] sm:inline-block"
        >
          Start Predicting
        </Link>

        <Link
          href="/group-stage"
          className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-background sm:hidden"
        >
          Predict
        </Link>
      </nav>
    </header>
  );
}
