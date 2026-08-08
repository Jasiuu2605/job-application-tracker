'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApplicationCard } from '@/src/components/ApplicationCard';
import { ApplicationForm } from '@/src/components/ApplicationForm';
import { DashboardStats } from '@/src/components/DashboardStats';
import { EmptyState } from '@/src/components/EmptyState';
import { Filters } from '@/src/components/Filters';
import type {
  JobApplication,
  ApplicationStatus,
  WorkMode,
} from '@/src/types/application';
import { calculateApplicationStats } from '@/src/utils/applicationStats';
import { isFollowUpDue } from '@/src/utils/followUp';

import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from '@/src/services/application.service';

type StatusFilter = ApplicationStatus | 'all';
type WorkModeFilter = WorkMode | 'all';
type SortOption =
  | 'newest'
  | 'oldest'
  | 'company-asc'
  | 'company-desc'
  | 'status';

export default function Home() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [workModeFilter, setWorkModeFilter] = useState<WorkModeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showDueFollowUps, setShowDueFollowUps] = useState(false);

  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState('');

  useEffect(() => {
    async function loadFirestoreApplications() {
      try {
        setIsLoadingApplications(true);
        setApplicationsError('');

        const firestoreApplications = await getApplications();

        setApplications(firestoreApplications);
      } catch {
        setApplicationsError('Could not load applications from Firestore.');
        setApplications([]);
      } finally {
        setIsLoadingApplications(false);
      }
    }

    void loadFirestoreApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      const matchesStatus =
        statusFilter === 'all' || application.status === statusFilter;
      const matchesWorkMode =
        workModeFilter === 'all' || application.workMode === workModeFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        application.company.toLowerCase().includes(normalizedSearch) ||
        application.position.toLowerCase().includes(normalizedSearch);

      const matchesFollowUp =
        !showDueFollowUps || isFollowUpDue(application.followUpAt);

      return (
        matchesStatus && matchesWorkMode && matchesSearch && matchesFollowUp
      );
    });

    return [...filtered].sort((firstApplication, secondApplication) => {
      if (sortOption === 'newest') {
        return (
          new Date(secondApplication.appliedAt).getTime() -
          new Date(firstApplication.appliedAt).getTime()
        );
      }

      if (sortOption === 'oldest') {
        return (
          new Date(firstApplication.appliedAt).getTime() -
          new Date(secondApplication.appliedAt).getTime()
        );
      }

      if (sortOption === 'company-asc') {
        return firstApplication.company.localeCompare(
          secondApplication.company,
        );
      }

      if (sortOption === 'company-desc') {
        return secondApplication.company.localeCompare(
          firstApplication.company,
        );
      }

      return firstApplication.status.localeCompare(secondApplication.status);
    });
  }, [
    applications,
    searchQuery,
    showDueFollowUps,
    sortOption,
    statusFilter,
    workModeFilter,
  ]);

  const stats = useMemo(
    () => calculateApplicationStats(applications),
    [applications],
  );

  async function handleAddApplication(application: JobApplication) {
    try {
      setApplicationsError('');

      await createApplication(application);

      setApplications((currentApplications) => [
        application,
        ...currentApplications,
      ]);
    } catch (error) {
      setApplicationsError('Could not save application to Firestore.');
    }
  }

  async function handleUpdateApplication(updatedApplication: JobApplication) {
    try {
      setApplicationsError('');

      await updateApplication(updatedApplication);

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === updatedApplication.id
            ? updatedApplication
            : application,
        ),
      );
      setEditingApplication(null);
    } catch (error) {
      setApplicationsError('Could not update application in Firestore.');
    }
  }

  async function handleDeleteApplication(applicationId: string) {
    try {
      setApplicationsError('');

      await deleteApplication(applicationId);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== applicationId,
        ),
      );

      setEditingApplication((currentApplication) =>
        currentApplication?.id === applicationId ? null : currentApplication,
      );
    } catch (error) {
      setApplicationsError('Could not delete application from Firestore.');
    }
  }

  const hasActiveFilters =
    statusFilter !== 'all' ||
    workModeFilter !== 'all' ||
    showDueFollowUps ||
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
              sortOption={sortOption}
              showDueFollowUps={showDueFollowUps}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              onWorkModeChange={setWorkModeFilter}
              onSortChange={setSortOption}
              onShowDueFollowUpsChange={setShowDueFollowUps}
            />

            <div className='flex items-center justify-between gap-4'>
              <h2 className='text-xl font-semibold text-slate-950'>
                Applications
              </h2>
              <p className='text-sm text-slate-500'>
                Showing {filteredApplications.length} of {applications.length}
              </p>
            </div>

            {applicationsError ? (
              <div className='rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700'>
                {applicationsError}
              </div>
            ) : null}

            {isLoadingApplications ? (
              <div className='rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm'>
                Loading applications...
              </div>
            ) : null}

            {!isLoadingApplications && applications.length === 0 ? (
              <EmptyState
                title='No applications yet'
                description='Add your first job application to start tracking your search.'
              />
            ) : !isLoadingApplications && filteredApplications.length === 0 ? (
              <EmptyState
                title='No matches found'
                description='Try changing the filters or search text to see more applications.'
              />
            ) : !isLoadingApplications ? (
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
            ) : null}

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
