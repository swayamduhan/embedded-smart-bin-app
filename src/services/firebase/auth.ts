import * as SecureStore from 'expo-secure-store';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { env } from '../../config/env';
import type { AppRole, RegisterUserInput, UserProfile } from '../../types/auth';
import { auth, db } from './config';

const profileCacheKey = 'smart-bin-profile';

function inferRoleFromEmail(email: string): AppRole {
  return env.staffEmails.includes(email.toLowerCase()) ? 'STAFF' : 'USER';
}

async function buildOrCreateProfile(firebaseUser: FirebaseUser): Promise<UserProfile> {
  const email = firebaseUser.email ?? '';
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const snapshot = await getDoc(userDocRef);

  if (snapshot.exists()) {
    const data = snapshot.data() as Partial<UserProfile>;

    const profile: UserProfile = {
      uid: firebaseUser.uid,
      email,
      role: data.role ?? inferRoleFromEmail(email),
      displayName: data.displayName ?? firebaseUser.displayName ?? undefined,
      points: data.points ?? 0,
      fcmTokens: data.fcmTokens ?? [],
    };

    await SecureStore.setItemAsync(profileCacheKey, JSON.stringify(profile));
    return profile;
  }

  const profile: UserProfile = {
    uid: firebaseUser.uid,
    email,
    role: inferRoleFromEmail(email),
    displayName: firebaseUser.displayName ?? undefined,
    points: 0,
    fcmTokens: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(userDocRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await SecureStore.setItemAsync(profileCacheKey, JSON.stringify(profile));

  return profile;
}

export function observeSession(
  callback: (payload: { firebaseUser: FirebaseUser | null; profile: UserProfile | null }) => void
) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      await SecureStore.deleteItemAsync(profileCacheKey);
      callback({ firebaseUser: null, profile: null });
      return;
    }

    const profile = await buildOrCreateProfile(firebaseUser);
    callback({ firebaseUser, profile });
  });
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerWithEmail({
  email,
  password,
  role,
  displayName,
}: RegisterUserInput) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const profile: UserProfile = {
    uid: credential.user.uid,
    email: credential.user.email ?? email.trim(),
    role,
    displayName: displayName?.trim() || undefined,
    points: 0,
    fcmTokens: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(doc(db, 'users', credential.user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await SecureStore.setItemAsync(profileCacheKey, JSON.stringify(profile));

  return credential;
}

export async function logout() {
  await SecureStore.deleteItemAsync(profileCacheKey);
  return signOut(auth);
}

export async function getCachedProfile() {
  const rawValue = await SecureStore.getItemAsync(profileCacheKey);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as UserProfile;
}

export async function refreshUserProfile(firebaseUser: FirebaseUser) {
  return buildOrCreateProfile(firebaseUser);
}

export async function updateStoredFcmToken(uid: string, token: string) {
  const userDocRef = doc(db, 'users', uid);

  await updateDoc(userDocRef, {
    fcmTokens: arrayUnion(token),
    updatedAt: serverTimestamp(),
  });
}
