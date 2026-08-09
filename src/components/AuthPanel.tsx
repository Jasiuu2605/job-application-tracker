import type { User } from 'firebase/auth';
import { signInWithGoogle, signOutUser } from '@/src/services/auth.service';

type AuthPanelProps = {
  user: User | null;
  isAuthLoading: boolean;
};

export function AuthPanel({ user, isAuthLoading }: AuthPanelProps) {
  if (isAuthLoading) {
    return (
      <div className='rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm'>
        Checking session...
      </div>
    );
  }

  if (!user) {
    return (
      <button
        type='button'
        onClick={() => void signInWithGoogle()}
        className='rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800'
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className='flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm sm:flex-row sm:items-center'>
      <div>
        <p className='font-medium text-slate-950'>
          {user.displayName || 'Signed in'}
        </p>
        <p className='text-slate-500'>{user.email}</p>
      </div>

      <button
        type='button'
        onClick={() => void signOutUser()}
        className='rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
      >
        Sign out
      </button>
    </div>
  );
}
