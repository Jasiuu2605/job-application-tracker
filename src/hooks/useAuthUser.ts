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
        void upsertUserProfile(currentUser);
      }
    });

    return unsubscribe;
  }, []);

  return {
    user,
    isAuthLoading,
  };
}
