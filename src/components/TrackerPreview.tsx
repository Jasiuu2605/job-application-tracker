const examples = [
  {
    company: 'Northstar Studio',
    position: 'Frontend Developer',
    mode: 'Remote',
    status: 'Interview',
    tone: 'bg-interview-soft text-interview-text ring-interview-line',
    date: 'Sep 18',
    note: 'Technical interview scheduled. Review the team projects before the call.',
  },
  {
    company: 'Forma Digital',
    position: 'React Developer',
    mode: 'Hybrid',
    status: 'Applied',
    tone: 'bg-info-soft text-info-text ring-info-line',
    date: 'Sep 21',
    note: 'Application submitted through the company careers page.',
  },
  {
    company: 'Fieldwork Labs',
    position: 'UI Developer',
    mode: 'Remote',
    status: 'Offer',
    tone: 'bg-success-soft text-success-text ring-success-line',
    date: 'Sep 12',
    note: 'Offer received. Compare the responsibilities and benefits before replying.',
  },
];

export function TrackerPreview() {
  return (
    <div className='overflow-hidden rounded-lg border border-line bg-surface shadow-lg shadow-black/5'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-5 py-3'>
        <span className='text-sm font-semibold text-ink'>Your applications</span>
        <span className='text-xs text-muted'>Preview with fictional data</span>
      </div>

      <dl className='grid grid-cols-2 border-b border-line sm:grid-cols-4'>
        {[
          { label: 'Applications', value: '3', tone: 'text-ink' },
          { label: 'Interviews', value: '1', tone: 'text-interview-text' },
          { label: 'Rejected', value: '0', tone: 'text-danger-text' },
          { label: 'Offers', value: '1', tone: 'text-success-text' },
        ].map((stat) => (
          <div key={stat.label} className='px-5 py-5 sm:px-6'>
            <dt className='text-xs text-muted'>{stat.label}</dt>
            <dd className={`mt-2 text-2xl font-semibold tabular-nums ${stat.tone}`}>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className='divide-y divide-line'>
        {examples.map((application) => (
          <div key={application.company} className='px-5 py-4 sm:px-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h3 className='text-sm font-semibold text-ink'>{application.company}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${application.tone}`}>
                    {application.status}
                  </span>
                </div>
                <p className='mt-1 text-sm text-muted'>{application.position}</p>
              </div>
              <p className='shrink-0 text-xs text-muted'>
                {application.mode} <span aria-hidden='true' className='px-2'>/</span> Applied {application.date}
              </p>
            </div>
            <details className='application-details mt-1'>
              <summary className='w-fit cursor-pointer rounded py-2 text-xs font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>
                Application details
              </summary>
              <p className='pb-2 pt-1 text-sm leading-6 text-muted'>{application.note}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
