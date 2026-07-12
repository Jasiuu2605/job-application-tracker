export type ApplicationStatus = "saved" | "applied" | "interview" | "rejected" | "offer";

export type WorkMode = "remote" | "hybrid" | "onsite";

export type JobApplication = {
  id: string;
  company: string;
  position: string;
  location: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  appliedAt: string;
  salaryRange?: string;
  source?: string;
  notes?: string;
};

export const applicationStatuses: ApplicationStatus[] = [
  "saved",
  "applied",
  "interview",
  "rejected",
  "offer",
];

export const workModes: WorkMode[] = ["remote", "hybrid", "onsite"];

export const statusLabels: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
};

export const workModeLabels: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};
