import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import { upsertUserProfile } from '@/src/services/user.service';

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        upsertUserProfile(currentUser).catch((error: unknown) => {
          console.error('Could not save user profile:', error);
        });
      }
    });

    return unsubscribe;
  }, []);

  return {
    user,
    isAuthLoading,
  };
}
