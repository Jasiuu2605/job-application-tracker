import { useEffect, useState } from 'react';
import type { JobApplication } from '@/src/types/application';
import { getApplications } from '@/src/services/application.service';

export function useApplications(userId: string | null, isAuthLoading: boolean) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState('');
  const [applicationsSuccess, setApplicationsSuccess] = useState('');

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!userId) {
      const timeoutId = window.setTimeout(() => {
        setApplications([]);
        setIsLoadingApplications(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const currentUserId = userId;

    async function loadFirestoreApplications() {
      try {
        setIsLoadingApplications(true);
        setApplicationsError('');
        setApplicationsSuccess('');

        const firestoreApplications = await getApplications(currentUserId);
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
  }, [isAuthLoading, userId]);

  useEffect(() => {
    if (!applicationsSuccess) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setApplicationsSuccess('');
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [applicationsSuccess]);

  return {
    applications,
    setApplications,
    isLoadingApplications,
    setIsLoadingApplications,
    applicationsError,
    setApplicationsError,
    applicationsSuccess,
    setApplicationsSuccess,
  };
}
