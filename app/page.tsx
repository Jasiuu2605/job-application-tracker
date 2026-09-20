'use client';

import { AuthPanel } from '@/src/components/AuthPanel';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useEffect, useMemo, useState, useRef } from 'react';
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
  const { user, isAuthLoading } = useAuthUser();

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
  const [applicationsSuccess, setApplicationsSuccess] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const formDialogRef = useRef<HTMLDialogElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const dialog = formDialogRef.current;

    if (!dialog) return;

    if (isFormOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isFormOpen && dialog.open) {
      dialog.close();
    }
  }, [isFormOpen]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      const timeoutId = window.setTimeout(() => {
        setApplications([]);
        setIsLoadingApplications(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const userId = user.uid;

    async function loadFirestoreApplications() {
      try {
        setIsLoadingApplications(true);
        setApplicationsError('');
        setApplicationsSuccess('');

        const firestoreApplications = await getApplications(userId);

        setApplications(firestoreApplications);
      } catch {
        setApplicationsError('Could not load applications from Firestore.');
        setApplications([]);
        setApplicationsSuccess('');
      } finally {
        setIsLoadingApplications(false);
      }
    }

    void loadFirestoreApplications();
  }, [isAuthLoading, user]);

  useEffect(() => {
    if (!applicationsSuccess) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setApplicationsSuccess('');
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [applicationsSuccess]);

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
      setApplicationsSuccess('');

      if (!user) {
        setApplicationsError('Sign in to save applications.');
        return;
      }

      await createApplication(user.uid, application);

      setApplications((currentApplications) => [
        application,
        ...currentApplications,
      ]);
      setApplicationsSuccess('Application saved to Firestore.');
      formDialogRef.current?.close();
    } catch {
      setApplicationsSuccess('');
      setApplicationsError('Could not save application to Firestore.');
    }
  }

  async function handleUpdateApplication(updatedApplication: JobApplication) {
    try {
      setApplicationsError('');
      setApplicationsSuccess('');

      if (!user) {
        setApplicationsError('Sign in to update applications.');
        return;
      }

      await updateApplication(user.uid, updatedApplication);

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === updatedApplication.id
            ? updatedApplication
            : application,
        ),
      );
      setEditingApplication(null);
      setApplicationsSuccess('Application updated in Firestore.');
      formDialogRef.current?.close();
    } catch {
      setApplicationsSuccess('');
      setApplicationsError('Could not update application in Firestore.');
    }
  }

  async function handleDeleteApplication(applicationId: string) {
    try {
      setApplicationsError('');
      setApplicationsSuccess('');

      if (!user) {
        setApplicationsError('Sign in to delete applications.');
        return;
      }

      await deleteApplication(user.uid, applicationId);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== applicationId,
        ),
      );

      setEditingApplication((currentApplication) =>
        currentApplication?.id === applicationId ? null : currentApplication,
      );
      setApplicationsSuccess('Application deleted from Firestore.');
    } catch {
      setApplicationsSuccess('');
      setApplicationsError('Could not delete application from Firestore.');
    }
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / pageSize),
  );

  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;

  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + pageSize,
  );

  const hasActiveFilters =
    statusFilter !== 'all' ||
    workModeFilter !== 'all' ||
    showDueFollowUps ||
    searchQuery.trim().length > 0;

  function handlePageChange(page: number) {
    setCurrentPage(page);

    document.getElementById('applications-heading')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

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
          <div className='flex flex-col gap-3 sm:items-end'>
            <AuthPanel user={user} isAuthLoading={isAuthLoading} />

            <div className='rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm'>
              <span className='font-semibold text-slate-950'>
                {applications.length}
              </span>{' '}
              saved applications
            </div>
          </div>
        </header>

        <DashboardStats stats={stats} />

        <section className='grid gap-6'>
          <div className='flex flex-col gap-5'>
            <Filters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              workModeFilter={workModeFilter}
              sortOption={sortOption}
              showDueFollowUps={showDueFollowUps}
              onSearchChange={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              onStatusChange={setStatusFilter}
              onWorkModeChange={(value) => {
                setWorkModeFilter(value);
                setCurrentPage(1);
              }}
              onSortChange={setSortOption}
              onShowDueFollowUpsChange={(value) => {
                setShowDueFollowUps(value);
                setCurrentPage(1);
              }}
            />

            <div className='flex items-center justify-between gap-4'>
              <h2
                id='applications-heading'
                className='scroll-mt-6 text-xl font-semibold text-slate-950'
              >
                Applications
              </h2>
              {user && (
                <button
                  type='button'
                  onClick={() => {
                    setEditingApplication(null);
                    setIsFormOpen(true);
                  }}
                  className='rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800'
                >
                  Add application
                </button>
              )}
              <p className='text-sm text-slate-500'>
                Showing {filteredApplications.length === 0 ? 0 : startIndex + 1}
                –{startIndex + paginatedApplications.length} of{' '}
                {filteredApplications.length}
              </p>
            </div>

            {applicationsError ? (
              <div className='rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700'>
                {applicationsError}
              </div>
            ) : null}

            {applicationsSuccess ? (
              <div className='rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'>
                {applicationsSuccess}
              </div>
            ) : null}

            {isLoadingApplications ? (
              <div className='rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm'>
                Loading applications...
              </div>
            ) : null}

            {!isAuthLoading && !user ? (
              <EmptyState
                title='Sign in to view applications'
                description='Use Google sign-in to load and manage your saved job applications.'
              />
            ) : !isLoadingApplications && applications.length === 0 ? (
              <EmptyState
                title='No applications in Firestore yet'
                description='Add your first job application and it will be saved to your Firebase workspace.'
              />
            ) : !isLoadingApplications && filteredApplications.length === 0 ? (
              <EmptyState
                title='No matches found'
                description='Try changing the filters or search text to see more applications.'
              />
            ) : !isLoadingApplications ? (
              <div className='grid gap-4'>
                {paginatedApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onDelete={handleDeleteApplication}
                    onEdit={(application) => {
                      setEditingApplication(application);
                      setIsFormOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : null}

            {!isLoadingApplications && totalPages > 1 && (
              <nav
                aria-label='Applications pagination'
                className='flex flex-wrap items-center justify-center gap-4'
              >
                <button
                  type='button'
                  aria-label='Go to first page'
                  title='First page'
                  disabled={activePage === 1}
                  onClick={() => handlePageChange(1)}
                  className='rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  &laquo;
                </button>
                <button
                  type='button'
                  disabled={activePage === 1}
                  onClick={() => handlePageChange(activePage - 1)}
                  className='rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Previous
                </button>

                <span className='text-sm text-slate-600'>
                  Page {activePage} of {totalPages}
                </span>

                <button
                  type='button'
                  disabled={activePage === totalPages}
                  onClick={() => handlePageChange(activePage + 1)}
                  className='rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Next
                </button>
                <button
                  type='button'
                  aria-label='Go to last page'
                  title='Last page'
                  disabled={activePage === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                  className='rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  &raquo;
                </button>
              </nav>
            )}

            {hasActiveFilters ? (
              <button
                type='button'
                onClick={() => {
                  setStatusFilter('all');
                  setWorkModeFilter('all');
                  setSearchQuery('');
                  setShowDueFollowUps(false);
                  setCurrentPage(1);
                }}
                className='w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100'
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {user ? (
            isFormOpen && (
              <dialog
                ref={formDialogRef}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingApplication(null);
                }}
                aria-label={
                  editingApplication ? 'Edit application' : 'Add application'
                }
                className='fixed inset-0 m-auto h-dvh max-h-dvh w-full max-w-none overflow-y-auto border-0 bg-white p-0 backdrop:bg-black/40 sm:h-auto sm:max-h-[90dvh] sm:max-w-[720px] sm:rounded-lg'
              >
                <div className='flex justify-end px-4 pt-4'>
                  <button
                    type='button'
                    aria-label='Close application form'
                    title='Close'
                    onClick={() => formDialogRef.current?.close()}
                    className='flex h-10 w-10 items-center justify-center rounded-md text-2xl text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
                  >
                    &times;
                  </button>
                </div>
                <ApplicationForm
                  editingApplication={editingApplication}
                  onAddApplication={handleAddApplication}
                  onUpdateApplication={handleUpdateApplication}
                  onCancelEdit={() => formDialogRef.current?.close()}
                />
              </dialog>
            )
          ) : (
            <aside className='rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-500 shadow-sm lg:sticky lg:top-6'>
              Sign in with Google to add and manage job applications.
            </aside>
          )}
        </section>
      </div>
    </main>
  );
}
