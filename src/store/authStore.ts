import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';

import type { AppRole, UserProfile } from '../types/auth';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (params: {
    firebaseUser: FirebaseUser | null;
    profile: UserProfile | null;
    status: AuthState['status'];
  }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  profile: null,
  status: 'loading',
  setSession: ({ firebaseUser, profile, status }) =>
    set({
      firebaseUser,
      profile,
      status,
    }),
}));

export function selectRole(state: AuthState): AppRole | null {
  return state.profile?.role ?? null;
}
