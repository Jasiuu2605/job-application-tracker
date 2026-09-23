import {
  statusLabels,
  workModeLabels,
  type JobApplication,
  type ApplicationStatus,
} from '@/src/types/application';

import { isFollowUpDue } from '@/src/utils/followUp';

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
  const followUpDue = isFollowUpDue(application.followUpAt);

  return (
    <article className='min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 focus-within:border-teal-600 sm:px-5'>
      <div className='grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:gap-x-6'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='min-w-0 text-base font-semibold text-slate-950 [overflow-wrap:anywhere]'>
              {application.company}
            </h3>
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[application.status]}`}
            >
              {statusLabels[application.status]}
            </span>
          </div>
          <p className='mt-1 text-sm text-slate-600 [overflow-wrap:anywhere]'>
            {application.position}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5 text-slate-500 lg:flex-col lg:items-end'>
          <p>
            <span>Applied {formatDate(application.appliedAt)}</span>
            <span aria-hidden='true' className='mx-2 text-slate-300'>/</span>
            <span>{workModeLabels[application.workMode]}</span>
          </p>
          {application.followUpAt ? (
            <p
              className={
                followUpDue
                  ? 'rounded bg-amber-50 px-2 font-medium text-amber-800'
                  : ''
              }
            >
              Follow-up: {formatFollowUp(application.followUpAt)}
              {followUpDue ? ' · Due' : ''}
            </p>
          ) : null}
        </div>
        <div className='flex items-center gap-2 lg:border-l lg:border-slate-200 lg:pl-5'>
          <button
            type='button'
            aria-label={`Edit application for ${application.company}`}
            onClick={() => onEdit(application)}
            className='min-h-11 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
          >
            Edit
          </button>
          <button
            type='button'
            aria-label={`Delete application for ${application.company}`}
            onClick={() => {
              const shouldDelete = window.confirm(
                `Delete application for ${application.company}?`,
              );

              if (shouldDelete) {
                onDelete(application.id);
              }
            }}
            className='min-h-11 rounded-md px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600'
          >
            Delete
          </button>
        </div>
      </div>

      <details className='application-details group mt-1'>
        <summary className='w-fit cursor-pointer rounded py-2 text-xs font-medium text-slate-500 transition-colors marker:text-slate-400 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 group-open:text-teal-700'>
          Application details
        </summary>

        <dl className='mt-1 grid gap-x-6 gap-y-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          <Detail label='Location' value={application.location || 'Not specified'} />
          <Detail
            label='Salary'
            value={application.salaryRange || 'Not specified'}
          />

          <Detail
            label='Source'
            value={application.source || 'Not specified'}
          />
          <Detail label='Mode' value={workModeLabels[application.workMode]} />
        </dl>

        {application.notes ? (
          <div className='mt-4 border-t border-slate-100 pb-2 pt-4'>
            <h4 className='text-xs font-medium text-slate-500'>Notes</h4>
            <p className='mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700 [overflow-wrap:anywhere]'>
              {application.notes}
            </p>
          </div>
        ) : null}
      </details>

    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0'>
      <dt className='text-xs font-medium text-slate-500'>
        {label}
      </dt>
      <dd className='mt-1 text-slate-700 [overflow-wrap:anywhere]'>{value}</dd>
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

function formatFollowUp(dateValue?: string) {
  if (!dateValue) {
    return 'Not set';
  }

  return formatDate(dateValue);
}
