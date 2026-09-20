import { type FormEvent, useEffect, useState } from 'react';
import {
  applicationStatuses,
  statusLabels,
  workModeLabels,
  workModes,
  type ApplicationStatus,
  type JobApplication,
  type WorkMode,
} from '@/src/types/application';

type ApplicationFormProps = {
  editingApplication: JobApplication | null;
  onAddApplication: (application: JobApplication) => void;
  onUpdateApplication: (application: JobApplication) => void;
  onCancelEdit: () => void;
};

type FormState = {
  company: string;
  position: string;
  location: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  appliedAt: string;
  salaryRange: string;
  source: string;
  notes: string;
  followUpAt: string;
};

const initialFormState: FormState = {
  company: '',
  position: '',
  location: '',
  workMode: 'remote',
  status: 'applied',
  appliedAt: '',
  salaryRange: '',
  source: '',
  notes: '',
  followUpAt: '',
};

function getFormStateFromApplication(application: JobApplication): FormState {
  return {
    company: application.company,
    position: application.position,
    location:
      application.location === 'Not specified' ? '' : application.location,
    workMode: application.workMode,
    status: application.status,
    appliedAt: application.appliedAt,
    salaryRange: application.salaryRange ?? '',
    source: application.source ?? '',
    notes: application.notes ?? '',
    followUpAt: application.followUpAt ?? '',
  };
}

export function ApplicationForm({
  editingApplication,
  onAddApplication,
  onUpdateApplication,
  onCancelEdit,
}: ApplicationFormProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState('');
  const isEditing = Boolean(editingApplication);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (editingApplication) {
        setFormState(getFormStateFromApplication(editingApplication));
        setError('');
        return;
      }

      setFormState(initialFormState);
      setError('');
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [editingApplication]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !formState.company.trim() ||
      !formState.position.trim() ||
      !formState.status
    ) {
      setError('Company, position and status are required.');
      return;
    }

    const now = new Date().toISOString();

    const application: JobApplication = {
      id: editingApplication?.id ?? createApplicationId(),
      company: formState.company.trim(),
      position: formState.position.trim(),
      location: formState.location.trim() || 'Not specified',
      workMode: formState.workMode,
      status: formState.status,
      appliedAt: formState.appliedAt || new Date().toISOString().slice(0, 10),
      createdAt: editingApplication?.createdAt ?? now,
      updatedAt: now,
      salaryRange: formState.salaryRange.trim() || undefined,
      source: formState.source.trim() || undefined,
      notes: formState.notes.trim() || undefined,
      followUpAt: formState.followUpAt || undefined,
    };

    if (editingApplication) {
      onUpdateApplication(application);
    } else {
      onAddApplication(application);
    }

    setFormState(initialFormState);
    setError('');
  }

  function updateField<Field extends keyof FormState>(
    field: Field,
    value: FormState[Field],
  ) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  return (
    <aside className='bg-white px-6 pb-6 pt-2'>
      <h2 className='text-xl font-semibold text-slate-950'>
        {isEditing ? 'Edit application' : 'Add application'}
      </h2>
      <p className='mt-2 text-sm leading-6 text-slate-500'>
        {isEditing
          ? 'Update the details and save your changes.'
          : 'Keep the essential details in one place so every next step is visible.'}
      </p>

      <form onSubmit={handleSubmit} className='mt-5 grid gap-4'>
        <TextField
          label='Company name'
          value={formState.company}
          onChange={(value) => updateField('company', value)}
          required
        />
        <TextField
          label='Position'
          value={formState.position}
          onChange={(value) => updateField('position', value)}
          required
        />
        <TextField
          label='Location'
          value={formState.location}
          onChange={(value) => updateField('location', value)}
        />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
          <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            Work mode
            <select
              value={formState.workMode}
              onChange={(event) =>
                updateField('workMode', event.target.value as WorkMode)
              }
              className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            >
              {workModes.map((mode) => (
                <option key={mode} value={mode}>
                  {workModeLabels[mode]}
                </option>
              ))}
            </select>
          </label>

          <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            Status
            <select
              value={formState.status}
              onChange={(event) =>
                updateField('status', event.target.value as ApplicationStatus)
              }
              className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              required
            >
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <TextField
            label='Applied date'
            type='date'
            value={formState.appliedAt}
            onChange={(value) => updateField('appliedAt', value)}
          />
          <TextField
            label='Follow-up date'
            type='date'
            value={formState.followUpAt}
            onChange={(value) => updateField('followUpAt', value)}
          />
        </div>
        <TextField
          label='Salary range'
          value={formState.salaryRange}
          onChange={(value) => updateField('salaryRange', value)}
          placeholder='12k-16k PLN'
        />
        <TextField
          label='Source'
          value={formState.source}
          onChange={(value) => updateField('source', value)}
          placeholder='LinkedIn, referral, company page'
        />

        <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
          Notes
          <textarea
            value={formState.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            rows={4}
            className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            placeholder='Response details, follow-up date, next steps'
          />
        </label>

        {error ? (
          <p className='text-sm font-medium text-rose-600'>{error}</p>
        ) : null}

        <div className='mt-1 flex flex-col gap-2 sm:flex-row'>
          <button
            type='submit'
            className='rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-200'
          >
            {isEditing ? 'Save changes' : 'Add application'}
          </button>

          {isEditing ? (
            <button
              type='button'
              onClick={onCancelEdit}
              className='rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50'
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </aside>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
      />
    </label>
  );
}

function createApplicationId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `application-${Date.now()}`;
}
