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
    <section className='rounded-lg border border-line bg-surface p-4 shadow-sm'>
      <div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]'>
        <label className='flex flex-col gap-2 text-sm font-medium text-secondary'>
          Search
          <input
            type='search'
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Company or position'
            className='h-11 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent-ring'
          />
        </label>

        <label className='flex flex-col gap-2 text-sm font-medium text-secondary'>
          Status
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value as StatusFilter)
            }
            className='h-11 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-ring'
          >
            <option value='all'>All statuses</option>
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className='flex flex-col gap-2 text-sm font-medium text-secondary'>
          Work mode
          <select
            value={workModeFilter}
            onChange={(event) =>
              onWorkModeChange(event.target.value as WorkModeFilter)
            }
            className='h-11 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-ring'
          >
            <option value='all'>All modes</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {workModeLabels[mode]}
              </option>
            ))}
          </select>
        </label>
        <label className='flex flex-col gap-2 text-sm font-medium text-secondary'>
          Sort by
          <select
            value={sortOption}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className='h-11 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-ring'
          >
            <option value='newest'>Newest first</option>
            <option value='oldest'>Oldest first</option>
            <option value='company-asc'>Company A-Z</option>
            <option value='company-desc'>Company Z-A</option>
            <option value='status'>Status</option>
          </select>
        </label>
      </div>
      <label className='mt-4 flex items-center gap-3 rounded-md border border-line bg-canvas px-3 py-3 text-sm font-medium text-secondary'>
        <input
          type='checkbox'
          checked={showDueFollowUps}
          onChange={(event) => onShowDueFollowUpsChange(event.target.checked)}
          className='h-4 w-4 rounded border-line-strong text-accent focus:ring-accent'
        />
        Show only due follow-ups
      </label>
    </section>
  );
}
