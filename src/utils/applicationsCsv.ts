import {
  statusLabels,
  workModeLabels,
  type JobApplication,
} from '@/src/types/application';

const csvHeaders = [
  'No.',
  'Company',
  'Position',
  'Location',
  'Work mode',
  'Status',
  'Applied date',
  'Salary range',
  'Source',
  'Notes',
  'Follow-up date',
];

function escapeCsvCell(value: string): string {
  const mayBeFormula =
    /^\s*[=+\-@\uFF1D\uFF0B\uFF0D\uFF20]/u.test(value) ||
    /^[\t\r\n]/.test(value);

  const safeValue = mayBeFormula ? `'${value}` : value;

  return `"${safeValue.replace(/"/g, '""')}"`;
}

function applicationToRow(application: JobApplication): string[] {
  return [
    application.company,
    application.position,
    application.location,
    workModeLabels[application.workMode],
    statusLabels[application.status],
    application.appliedAt,
    application.salaryRange ?? '',
    application.source ?? '',
    application.notes ?? '',
    application.followUpAt ?? '',
  ];
}

export function applicationsToCsv(applications: JobApplication[]): string {
  const rows = [
    csvHeaders,
    ...applications.map((application, index) => [
      String(index + 1),
      ...applicationToRow(application),
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}
