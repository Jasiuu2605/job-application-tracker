'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApplicationCard } from '@/src/components/ApplicationCard';
import { ApplicationForm } from '@/src/components/ApplicationForm';
import { DashboardStats } from '@/src/components/DashboardStats';
import { EmptyState } from '@/src/components/EmptyState';
import { Filters } from '@/src/components/Filters';
import { mockApplications } from '@/src/data/mockApplications';
import type {
  JobApplication,
  ApplicationStatus,
  WorkMode,
} from '@/src/types/application';
import { calculateApplicationStats } from '@/src/utils/applicationStats';
import { loadApplications, saveApplications } from '@/src/utils/localStorage';

type StatusFilter = ApplicationStatus | 'all';
type WorkModeFilter = WorkMode | 'all';

export default function Home() {
  const [applications, setApplications] =
    useState<JobApplication[]>(mockApplications);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [workModeFilter, setWorkModeFilter] = useState<WorkModeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setApplications(loadApplications(mockApplications));
      setHasLoadedStorage(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (hasLoadedStorage) {
      saveApplications(applications);
    }
  }, [applications, hasLoadedStorage]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === 'all' || application.status === statusFilter;
      const matchesWorkMode =
        workModeFilter === 'all' || application.workMode === workModeFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        application.company.toLowerCase().includes(normalizedSearch) ||
        application.position.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesWorkMode && matchesSearch;
    });
  }, [applications, searchQuery, statusFilter, workModeFilter]);

  const stats = useMemo(
    () => calculateApplicationStats(applications),
    [applications],
  );

  function handleAddApplication(application: JobApplication) {
    setApplications((currentApplications) => [
      application,
      ...currentApplications,
    ]);
  }

  function handleUpdateApplication(updatedApplication: JobApplication) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === updatedApplication.id
          ? updatedApplication
          : application,
      ),
    );
    setEditingApplication(null);
  }

  function handleDeleteApplication(applicationId: string) {
    setApplications((currentApplications) =>
      currentApplications.filter(
        (application) => application.id !== applicationId,
      ),
    );

    setEditingApplication((currentApplication) =>
      currentApplication?.id === applicationId ? null : currentApplication,
    );
  }

  const hasActiveFilters =
    statusFilter !== 'all' ||
    workModeFilter !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <main className='min-h-screen bg-slate-50 text-slate-950'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8'>
        <header className='flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-medium text-teal-700'>
              Portfolio project
            </p>
            <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
              Job Application Tracker
            </h1>
            <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600'>
              Track where you applied, what happened next, and which
              opportunities need follow-up.
            </p>
          </div>
          <div className='rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm'>
            <span className='font-semibold text-slate-950'>
              {applications.length}
            </span>{' '}
            saved applications
          </div>
        </header>

        <DashboardStats stats={stats} />

        <section className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start'>
          <div className='flex flex-col gap-5'>
            <Filters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              workModeFilter={workModeFilter}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              onWorkModeChange={setWorkModeFilter}
            />

            <div className='flex items-center justify-between gap-4'>
              <h2 className='text-xl font-semibold text-slate-950'>
                Applications
              </h2>
              <p className='text-sm text-slate-500'>
                Showing {filteredApplications.length} of {applications.length}
              </p>
            </div>

            {applications.length === 0 ? (
              <EmptyState
                title='No applications yet'
                description='Add your first job application to start tracking your search.'
              />
            ) : filteredApplications.length === 0 ? (
              <EmptyState
                title='No matches found'
                description='Try changing the filters or search text to see more applications.'
              />
            ) : (
              <div className='grid gap-4'>
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onDelete={handleDeleteApplication}
                    onEdit={setEditingApplication}
                  />
                ))}
              </div>
            )}

            {hasActiveFilters ? (
              <button
                type='button'
                onClick={() => {
                  setStatusFilter('all');
                  setWorkModeFilter('all');
                  setSearchQuery('');
                }}
                className='w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100'
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <ApplicationForm
            editingApplication={editingApplication}
            onAddApplication={handleAddApplication}
            onUpdateApplication={handleUpdateApplication}
            onCancelEdit={() => setEditingApplication(null)}
          />
        </section>
      </div>
    </main>
  );
}
