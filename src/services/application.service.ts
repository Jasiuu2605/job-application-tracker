import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import type { JobApplication } from '@/src/types/application';

function removeUndefinedFields(application: JobApplication) {
  return Object.fromEntries(
    Object.entries(application).filter(([, value]) => value !== undefined),
  ) as JobApplication;
}

function normalizeApplication(application: JobApplication): JobApplication {
  const now = new Date().toISOString();

  return {
    ...application,
    createdAt: application.createdAt ?? now,
    updatedAt: application.updatedAt ?? now,
  };
}

function getApplicationsCollectionRef(userId: string) {
  return collection(db, 'users', userId, 'applications');
}

export async function getApplications(userId: string) {
  const applicationsQuery = query(
    getApplicationsCollectionRef(userId),
    orderBy('appliedAt', 'desc'),
  );

  const snapshot = await getDocs(applicationsQuery);

  return snapshot.docs.map((documentSnapshot) =>
    normalizeApplication({
      id: documentSnapshot.id,
      ...documentSnapshot.data(),
    } as JobApplication),
  );
}

export async function createApplication(
  userId: string,
  application: JobApplication,
) {
  const applicationRef = doc(
    getApplicationsCollectionRef(userId),
    application.id,
  );

  await setDoc(applicationRef, removeUndefinedFields(application));
}

export async function updateApplication(
  userId: string,
  application: JobApplication,
) {
  const applicationRef = doc(
    getApplicationsCollectionRef(userId),
    application.id,
  );

  await setDoc(applicationRef, removeUndefinedFields(application));
}

export async function deleteApplication(userId: string, applicationId: string) {
  const applicationRef = doc(
    getApplicationsCollectionRef(userId),
    applicationId,
  );

  await deleteDoc(applicationRef);
}
