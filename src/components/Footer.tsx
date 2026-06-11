export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-surface/40 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-sm text-muted sm:flex-row sm:text-left">
        <p>
          <span className="font-display font-semibold text-foreground">
            WC26 Predictor
          </span>
          <span className="mx-2 text-white/20">·</span>
          Fan project — not affiliated with FIFA
        </p>
        <p className="text-xs">FIFA World Cup 2026™ · USA, Canada, Mexico</p>
      </div>
    </footer>
  );
}
