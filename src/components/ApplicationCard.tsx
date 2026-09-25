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
  saved: 'bg-subtle text-secondary ring-line',
  applied: 'bg-info-soft text-info-text ring-info-line',
  interview: 'bg-interview-soft text-interview-text ring-interview-line',
  rejected: 'bg-danger-soft text-danger-text ring-danger-line',
  offer: 'bg-success-soft text-success-text ring-success-line',
};

export function ApplicationCard({
  application,
  onDelete,
  onEdit,
}: ApplicationCardProps) {
  const followUpDue = isFollowUpDue(application.followUpAt);

  return (
    <article className='min-w-0 rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong focus-within:border-accent sm:px-5'>
      <div className='grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:gap-x-6'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='min-w-0 text-base font-semibold text-ink [overflow-wrap:anywhere]'>
              {application.company}
            </h3>
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[application.status]}`}
            >
              {statusLabels[application.status]}
            </span>
          </div>
          <p className='mt-1 text-sm text-muted [overflow-wrap:anywhere]'>
            {application.position}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5 text-muted lg:flex-col lg:items-end'>
          <p>
            <span>Applied {formatDate(application.appliedAt)}</span>
            <span aria-hidden='true' className='mx-2 text-faint'>
              /
            </span>
            <span>{workModeLabels[application.workMode]}</span>
          </p>
          {application.followUpAt ? (
            <p
              className={
                followUpDue
                  ? 'rounded bg-warning-soft px-2 font-medium text-warning-text'
                  : ''
              }
            >
              Follow-up: {formatFollowUp(application.followUpAt)}
              {followUpDue ? ' · Due' : ''}
            </p>
          ) : null}
        </div>
        <div className='flex items-center gap-2 lg:border-l lg:border-line lg:pl-5'>
          <button
            type='button'
            aria-label={`Edit application for ${application.company}`}
            onClick={() => onEdit(application)}
            className='min-h-11 rounded-md border border-line px-3 text-sm font-medium text-secondary transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          >
            Edit
          </button>
          <button
            type='button'
            aria-label={`Delete application for ${application.company}`}
            onClick={() => onDelete(application.id)}
            className='min-h-11 rounded-md px-3 text-sm font-medium text-muted transition-colors hover:bg-danger-soft hover:text-danger-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger-text'
          >
            Delete
          </button>
        </div>
      </div>

      <details className='application-details group mt-1'>
        <summary className='w-fit cursor-pointer rounded py-2 text-xs font-medium text-muted transition-colors marker:text-faint hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-open:text-accent'>
          Application details
        </summary>

        <dl className='mt-1 grid gap-x-6 gap-y-4 border-t border-line-soft pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          <Detail
            label='Location'
            value={application.location || 'Not specified'}
          />
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
          <div className='mt-4 border-t border-line-soft pb-2 pt-4'>
            <h4 className='text-xs font-medium text-muted'>Notes</h4>
            <p className='mt-1 whitespace-pre-wrap text-sm leading-6 text-secondary [overflow-wrap:anywhere]'>
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
      <dt className='text-xs font-medium text-muted'>{label}</dt>
      <dd className='mt-1 text-secondary [overflow-wrap:anywhere]'>{value}</dd>
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
