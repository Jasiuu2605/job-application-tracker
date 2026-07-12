import {
  statusLabels,
  workModeLabels,
  type JobApplication,
  type ApplicationStatus,
} from '@/src/types/application';

type ApplicationCardProps = {
  application: JobApplication;
  onDelete: (applicationId: string) => void;
  onEdit: (application: JobApplication) => void;
};

const statusStyles: Record<ApplicationStatus, string> = {
  saved: 'bg-slate-100 text-slate-700 ring-slate-200',
  applied: 'bg-blue-100 text-blue-700 ring-blue-200',
  interview: 'bg-sky-100 text-sky-700 ring-sky-200',
  rejected: 'bg-rose-100 text-rose-700 ring-rose-200',
  offer: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
};

export function ApplicationCard({
  application,
  onDelete,
  onEdit,
}: ApplicationCardProps) {
  return (
    <article className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='text-lg font-semibold text-slate-950'>
              {application.company}
            </h3>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[application.status]}`}
            >
              {statusLabels[application.status]}
            </span>
          </div>
          <p className='mt-1 text-base font-medium text-slate-700'>
            {application.position}
          </p>
        </div>
        <div className='text-left text-sm text-slate-500 sm:text-right'>
          <p>Applied {formatDate(application.appliedAt)}</p>
          <p>{workModeLabels[application.workMode]}</p>
        </div>
      </div>

      <dl className='mt-5 grid gap-3 text-sm sm:grid-cols-2'>
        <Detail label='Location' value={application.location} />
        <Detail
          label='Salary'
          value={application.salaryRange || 'Not specified'}
        />
        <Detail label='Source' value={application.source || 'Not specified'} />
        <Detail label='Mode' value={workModeLabels[application.workMode]} />
      </dl>

      {application.notes ? (
        <div className='mt-5 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600'>
          {application.notes}
        </div>
      ) : null}
      <div className='mt-5 flex justify-end gap-2'>
        <button
          type='button'
          onClick={() => onEdit(application)}
          className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
        >
          Edit
        </button>

        <button
          type='button'
          onClick={() => {
            const shouldDelete = window.confirm(
              `Delete application for ${application.company}?`,
            );

            if (shouldDelete) {
              onDelete(application.id);
            }
          }}
          className='rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50'
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-xs font-semibold uppercase tracking-wide text-slate-400'>
        {label}
      </dt>
      <dd className='mt-1 text-slate-700'>{value}</dd>
    </div>
  );
}

function formatDate(dateValue: string) {
  if (!dateValue) {
    return 'not set';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}
