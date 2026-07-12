import type { ApplicationStats } from "@/src/utils/applicationStats";

type DashboardStatsProps = {
  stats: ApplicationStats;
};

const statCards = [
  {
    label: "Total applications",
    key: "total",
    tone: "border-slate-200 bg-white text-slate-950",
  },
  {
    label: "Interviews",
    key: "interviews",
    tone: "border-sky-200 bg-sky-50 text-sky-950",
  },
  {
    label: "Rejected",
    key: "rejected",
    tone: "border-rose-200 bg-rose-50 text-rose-950",
  },
  {
    label: "Offers",
    key: "offers",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
] as const;

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <article key={card.key} className={`rounded-lg border p-5 shadow-sm ${card.tone}`}>
          <p className="text-sm font-medium opacity-75">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{stats[card.key]}</p>
        </article>
      ))}
    </section>
  );
}
