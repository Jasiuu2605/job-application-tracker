'use cleint';

import { createContext } from 'react';

import type { User } from 'firebase/auth';

type AuthContextValue = {
  user: User | null;
  isAuthLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
