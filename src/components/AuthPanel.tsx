import { signInWithGoogle, signOutUser } from '@/src/services/auth.service';
import { useAuth } from '../hooks/useAuth';

export function AuthPanel() {
  const { user, isAuthLoading } = useAuth();
  if (isAuthLoading) {
    return (
      <div className='rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted shadow-sm'>
        Checking session...
      </div>
    );
  }

  if (!user) {
    return (
      <button
        type='button'
        onClick={() => void signInWithGoogle()}
        className='rounded-md bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover'
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className='flex flex-col gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm shadow-sm sm:flex-row sm:items-center'>
      <div>
        <p className='font-medium text-ink'>
          {user.displayName || 'Signed in'}
        </p>
        <p className='text-muted'>{user.email}</p>
      </div>

      <button
        type='button'
        onClick={() => void signOutUser()}
        className='rounded-md border border-line-strong px-3 py-2 text-sm font-medium text-secondary transition hover:bg-canvas'
      >
        Sign out
      </button>
    </div>
  );
}
