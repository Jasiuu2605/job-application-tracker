import type { JobApplication } from "@/src/types/application";

export type ApplicationStats = {
  total: number;
  interviews: number;
  rejected: number;
  offers: number;
};

export function calculateApplicationStats(applications: JobApplication[]): ApplicationStats {
  return applications.reduce<ApplicationStats>(
    (stats, application) => {
      stats.total += 1;

      if (application.status === "interview") {
        stats.interviews += 1;
      }

      if (application.status === "rejected") {
        stats.rejected += 1;
      }

      if (application.status === "offer") {
        stats.offers += 1;
      }

      return stats;
    },
    {
      total: 0,
      interviews: 0,
      rejected: 0,
      offers: 0,
    },
  );
}
