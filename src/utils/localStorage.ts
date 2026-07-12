import type { JobApplication } from "@/src/types/application";

const STORAGE_KEY = "job-application-tracker:applications";

export function loadApplications(fallbackApplications: JobApplication[]): JobApplication[] {
  if (typeof window === "undefined") {
    return fallbackApplications;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return fallbackApplications;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return fallbackApplications;
    }

    return parsedValue.filter(isJobApplication);
  } catch {
    return fallbackApplications;
  }
}

export function saveApplications(applications: JobApplication[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

function isJobApplication(value: unknown): value is JobApplication {
  if (!value || typeof value !== "object") {
    return false;
  }

  const application = value as Partial<Record<keyof JobApplication, unknown>>;

  return (
    typeof application.id === "string" &&
    typeof application.company === "string" &&
    typeof application.position === "string" &&
    typeof application.location === "string" &&
    typeof application.workMode === "string" &&
    ["remote", "hybrid", "onsite"].includes(application.workMode) &&
    typeof application.status === "string" &&
    ["saved", "applied", "interview", "rejected", "offer"].includes(application.status) &&
    typeof application.appliedAt === "string"
  );
}
