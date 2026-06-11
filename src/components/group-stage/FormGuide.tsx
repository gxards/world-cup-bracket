import type { FormResult } from "@/lib/teams";

const styles: Record<FormResult, string> = {
  W: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  D: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  L: "bg-red-500/15 text-red-400 border-red-500/25",
};

export function FormGuide({ form }: { form: FormResult[] }) {
  return (
    <div className="flex items-center gap-1" aria-label="Recent form">
      {form.map((result, i) => (
        <span
          key={i}
          className={`flex h-5 w-5 items-center justify-center rounded border text-[10px] font-bold ${styles[result]}`}
          title={result === "W" ? "Win" : result === "D" ? "Draw" : "Loss"}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
