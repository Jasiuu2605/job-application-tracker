'use client';

import { AuthPanel } from '@/src/components/AuthPanel';
import { ThemeSwitcher } from '@/src/components/ThemeSwitcher';
import { useAuth } from '@/src/hooks/useAuth';

import { useMemo, useState } from 'react';
import { ApplicationCard } from '@/src/components/ApplicationCard';
import { ApplicationForm } from '@/src/components/ApplicationForm';
import { ApplicationFormDialog } from '@/src/components/ApplicationFormDialog';
import { DashboardStats } from '@/src/components/DashboardStats';
import { EmptyState } from '@/src/components/EmptyState';
import { Filters } from '@/src/components/Filters';
import { Pagination } from '@/src/components/Pagination';

import type {
  JobApplication,
  ApplicationStatus,
  WorkMode,
} from '@/src/types/application';
import { calculateApplicationStats } from '@/src/utils/applicationStats';
import { isFollowUpDue } from '@/src/utils/followUp';

import { useApplications } from '@/src/hooks/useApplications';

type StatusFilter = ApplicationStatus | 'all';
type WorkModeFilter = WorkMode | 'all';
type SortOption =
  | 'newest'
  | 'oldest'
  | 'company-asc'
  | 'company-desc'
  | 'status';

export default function Home() {
  const { user, isAuthLoading } = useAuth();

  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [workModeFilter, setWorkModeFilter] = useState<WorkModeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showDueFollowUps, setShowDueFollowUps] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const {
    applications,
    isLoadingApplications,
    applicationsError,
    applicationsSuccess,
    addApplication,
    editApplication,
    removeApplication,
  } = useApplications(user?.uid ?? null, isAuthLoading);

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
    const wasSaved = await addApplication(application);

    if (wasSaved) {
      setIsFormOpen(false);
      setEditingApplication(null);
    }
  }

  async function handleUpdateApplication(updatedApplication: JobApplication) {
    const wasSaved = await editApplication(updatedApplication);

    if (wasSaved) {
      setIsFormOpen(false);
      setEditingApplication(null);
    }
  }

  async function handleDeleteApplication(applicationId: string) {
    const wasDeleted = await removeApplication(applicationId);

    if (wasDeleted) {
      setEditingApplication((currentApplication) =>
        currentApplication?.id === applicationId ? null : currentApplication,
      );
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
    <main className='min-h-screen bg-canvas text-ink'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8'>
        <header className='flex flex-col gap-6 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-accent'>Portfolio project</p>
            <h1 className='mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl'>
              Job Application Tracker
            </h1>
            <p className='mt-3 max-w-2xl text-base leading-7 text-muted'>
              Track where you applied, what happened next, and which
              opportunities need follow-up.
            </p>
          </div>
          <div className='flex min-w-0 flex-col items-start gap-3 lg:items-end'>
            <ThemeSwitcher />
            <AuthPanel />

            <div className='rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted shadow-sm'>
              <span className='font-semibold text-ink'>
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
                className='scroll-mt-6 text-xl font-semibold text-ink'
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
                  className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover'
                >
                  Add application
                </button>
              )}
              <p className='text-sm text-muted'>
                Showing {filteredApplications.length === 0 ? 0 : startIndex + 1}
                –{startIndex + paginatedApplications.length} of{' '}
                {filteredApplications.length}
              </p>
            </div>

            {applicationsError ? (
              <div className='rounded-md border border-danger-line bg-danger-soft px-4 py-3 text-sm font-medium text-danger-text'>
                {applicationsError}
              </div>
            ) : null}

            {applicationsSuccess ? (
              <div className='rounded-md border border-success-line bg-success-soft px-4 py-3 text-sm font-medium text-success-text'>
                {applicationsSuccess}
              </div>
            ) : null}

            {isLoadingApplications ? (
              <div className='rounded-lg border border-line bg-surface p-6 text-sm text-muted shadow-sm'>
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
              <Pagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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
                className='w-fit rounded-md border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-secondary shadow-sm transition hover:border-faint hover:bg-subtle'
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {user ? (
            isFormOpen && (
              <ApplicationFormDialog
                isOpen={isFormOpen}
                title={
                  editingApplication ? 'Edit application' : 'Add application'
                }
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingApplication(null);
                }}
              >
                <ApplicationForm
                  editingApplication={editingApplication}
                  onAddApplication={handleAddApplication}
                  onUpdateApplication={handleUpdateApplication}
                  onCancelEdit={() => {
                    setIsFormOpen(false);
                    setEditingApplication(null);
                  }}
                />
              </ApplicationFormDialog>
            )
          ) : (
            <aside className='rounded-lg border border-line bg-surface p-5 text-sm leading-6 text-muted shadow-sm lg:sticky lg:top-6'>
              Sign in with Google to add and manage job applications.
            </aside>
          )}
        </section>
      </div>
    </main>
  );
}
