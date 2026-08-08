import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db, workspaceId } from '@/src/lib/firebase';
import type { JobApplication } from '@/src/types/application';

function removeUndefinedFields(application: JobApplication) {
  return Object.fromEntries(
    Object.entries(application).filter(([, value]) => value !== undefined),
  ) as JobApplication;
}

function getApplicationsCollectionRef() {
  return collection(db, 'workspaces', workspaceId, 'applications');
}

export async function getApplications() {
  const applicationsQuery = query(
    getApplicationsCollectionRef(),
    orderBy('appliedAt', 'desc'),
  );

  const snapshot = await getDocs(applicationsQuery);

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  })) as JobApplication[];
}

export async function createApplication(application: JobApplication) {
  const applicationRef = doc(getApplicationsCollectionRef(), application.id);

  await setDoc(applicationRef, removeUndefinedFields(application));
}

export async function updateApplication(application: JobApplication) {
  const applicationRef = doc(getApplicationsCollectionRef(), application.id);

  await setDoc(applicationRef, removeUndefinedFields(application));
}

export async function deleteApplication(applicationId: string) {
  const applicationRef = doc(getApplicationsCollectionRef(), applicationId);

  await deleteDoc(applicationRef);
}
