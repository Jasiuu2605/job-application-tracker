import { useEffect, useState } from 'react';
import type { JobApplication } from '@/src/types/application';

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState('');
  const [applicationsSuccess, setApplicationsSuccess] = useState('');

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
