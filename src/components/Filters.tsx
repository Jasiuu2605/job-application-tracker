import {
  applicationStatuses,
  statusLabels,
  workModeLabels,
  workModes,
  type ApplicationStatus,
  type WorkMode,
} from "@/src/types/application";

type StatusFilter = ApplicationStatus | "all";
type WorkModeFilter = WorkMode | "all";

type FiltersProps = {
  searchQuery: string;
  statusFilter: StatusFilter;
  workModeFilter: WorkModeFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onWorkModeChange: (value: WorkModeFilter) => void;
};

export function Filters({
  searchQuery,
  statusFilter,
  workModeFilter,
  onSearchChange,
  onStatusChange,
  onWorkModeChange,
}: FiltersProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Search
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Company or position"
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Status
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">All statuses</option>
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Work mode
          <select
            value={workModeFilter}
            onChange={(event) => onWorkModeChange(event.target.value as WorkModeFilter)}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">All modes</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {workModeLabels[mode]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
