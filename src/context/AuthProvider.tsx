'use client';

import type { ReactNode } from 'react';
import { useAuthUser } from '../hooks/useAuthUser';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthUser();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
