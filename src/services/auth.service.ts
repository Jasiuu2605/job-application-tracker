import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/src/lib/firebase';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  await signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  await signOut(auth);
}
