import type { ApplicationStats } from "@/src/utils/applicationStats";

type DashboardStatsProps = {
  stats: ApplicationStats;
};

const statCards = [
  {
    label: "Total applications",
    key: "total",
    tone: "border-line bg-surface text-ink",
  },
  {
    label: "Interviews",
    key: "interviews",
    tone: "border-interview-line bg-interview-soft text-interview-text",
  },
  {
    label: "Rejected",
    key: "rejected",
    tone: "border-danger-line bg-danger-soft text-danger-text",
  },
  {
    label: "Offers",
    key: "offers",
    tone: "border-success-line bg-success-soft text-success-text",
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
