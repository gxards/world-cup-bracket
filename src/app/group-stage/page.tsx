import Link from "next/link";
import { Footer } from "@/components/Footer";
import { GroupStageClient } from "@/components/group-stage/GroupStageClient";
import { Navbar } from "@/components/Navbar";

export default function GroupStagePage() {
  return (
    <>
      <Navbar />
      <div className="hero-gradient pitch-lines border-b border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground"
          >
            <span aria-hidden>←</span> Back to home
          </Link>
          <h1 className="font-display mt-4 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Group Stage{" "}
            <span className="text-gold">Predictions</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            All 12 groups from the official 2026 draw. Rank every team from
            first to fourth — your knockout bracket starts here.
          </p>
        </div>
      </div>

      <main>
        <GroupStageClient />
      </main>
      <Footer />
    </>
  );
}
