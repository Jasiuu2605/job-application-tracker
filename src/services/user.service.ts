import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import type { UserProfile } from '@/src/types/userProfile';

function getUserDocRef(userId: string) {
  return doc(db, 'users', userId);
}

export async function upsertUserProfile(user: User) {
  const userRef = getUserDocRef(user.uid);
  const snapshot = await getDoc(userRef);
  const now = new Date().toISOString();

  const profile: UserProfile = {
    id: user.uid,
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    photoURL: user.photoURL ?? '',
    createdAt: snapshot.exists() ? (snapshot.data().createdAt as string) : now,
    updatedAt: now,
  };

  await setDoc(userRef, profile);
}
