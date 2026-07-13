import {
  applicationStatuses,
  statusLabels,
  workModeLabels,
  workModes,
  type ApplicationStatus,
  type WorkMode,
} from '@/src/types/application';

type StatusFilter = ApplicationStatus | 'all';
type WorkModeFilter = WorkMode | 'all';
type SortOption =
  | 'newest'
  | 'oldest'
  | 'company-asc'
  | 'company-desc'
  | 'status';

type FiltersProps = {
  searchQuery: string;
  statusFilter: StatusFilter;
  workModeFilter: WorkModeFilter;
  sortOption: SortOption;
  showDueFollowUps: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onWorkModeChange: (value: WorkModeFilter) => void;
  onSortChange: (value: SortOption) => void;
  onShowDueFollowUpsChange: (value: boolean) => void;
};

export function Filters({
  searchQuery,
  statusFilter,
  workModeFilter,
  sortOption,
  showDueFollowUps,
  onSearchChange,
  onStatusChange,
  onWorkModeChange,
  onSortChange,
  onShowDueFollowUpsChange,
}: FiltersProps) {
  return (
    <section className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]'>
        <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
          Search
          <input
            type='search'
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Company or position'
            className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
          />
        </label>

        <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
          Status
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value as StatusFilter)
            }
            className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
          >
            <option value='all'>All statuses</option>
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
          Work mode
          <select
            value={workModeFilter}
            onChange={(event) =>
              onWorkModeChange(event.target.value as WorkModeFilter)
            }
            className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
          >
            <option value='all'>All modes</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {workModeLabels[mode]}
              </option>
            ))}
          </select>
        </label>
        <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
          Sort by
          <select
            value={sortOption}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
          >
            <option value='newest'>Newest first</option>
            <option value='oldest'>Oldest first</option>
            <option value='company-asc'>Company A-Z</option>
            <option value='company-desc'>Company Z-A</option>
            <option value='status'>Status</option>
          </select>
        </label>
      </div>
      <label className='mt-4 flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700'>
        <input
          type='checkbox'
          checked={showDueFollowUps}
          onChange={(event) => onShowDueFollowUpsChange(event.target.checked)}
          className='h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600'
        />
        Show only due follow-ups
      </label>
    </section>
  );
}
