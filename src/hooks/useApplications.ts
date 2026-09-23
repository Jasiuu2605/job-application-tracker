import { useEffect, useState } from 'react';

import type { JobApplication } from '@/src/types/application';

import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from '@/src/services/application.service';

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

  async function addApplication(application: JobApplication): Promise<boolean> {
    setApplicationsError('');
    setApplicationsSuccess('');

    if (!userId) {
      setApplicationsError('Sign in to save applications.');
      return false;
    }

    try {
      await createApplication(userId, application);

      setApplications((currentApplications) => [
        application,
        ...currentApplications,
      ]);
      setApplicationsSuccess('Application saved to Firestore.');
      return true;
    } catch {
      setApplicationsError('Could not save application to Firestore.');
      return false;
    }
  }

  async function editApplication(
    updatedApplication: JobApplication,
  ): Promise<boolean> {
    setApplicationsError('');
    setApplicationsSuccess('');

    if (!userId) {
      setApplicationsError('Sign in to update applications.');
      return false;
    }

    try {
      await updateApplication(userId, updatedApplication);

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === updatedApplication.id
            ? updatedApplication
            : application,
        ),
      );

      setApplicationsSuccess('Application updated in Firestore.');
      return true;
    } catch {
      setApplicationsError('Could not update application in Firestore.');
      return false;
    }
  }

  async function removeApplication(applicationId: string): Promise<boolean> {
    setApplicationsError('');
    setApplicationsSuccess('');

    if (!userId) {
      setApplicationsError('Sign in to delete applications.');
      return false;
    }

    try {
      await deleteApplication(userId, applicationId);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== applicationId,
        ),
      );

      setApplicationsSuccess('Application deleted from Firestore.');
      return true;
    } catch {
      setApplicationsError('Could not delete application from Firestore.');
      return false;
    }
  }

  return {
    addApplication,
    editApplication,
    removeApplication,
    applications,
    isLoadingApplications,
    applicationsError,
    applicationsSuccess,
  };
}
