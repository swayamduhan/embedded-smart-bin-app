import { createContext, useContext, useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useMqttConnection } from '../hooks/useMqttConnection';
import { useAppTheme } from '../hooks/useAppTheme';
import {
  getCachedProfile,
  loginWithEmail,
  logout,
  observeSession,
  refreshUserProfile,
  registerWithEmail,
} from '../services/firebase/auth';
import { useAuthStore } from '../store/authStore';
import { useBinStore } from '../store/binStore';
import type { RegisterUserInput } from '../types/auth';

interface AuthContextValue {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: RegisterUserInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme();
  const status = useAuthStore((state) => state.status);
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const profile = useAuthStore((state) => state.profile);
  const setSession = useAuthStore((state) => state.setSession);
  const resetBins = useBinStore((state) => state.reset);

  useMqttConnection(status === 'authenticated');

  useEffect(() => {
    let mounted = true;

    getCachedProfile().then((cachedProfile) => {
      if (!mounted || !cachedProfile) {
        return;
      }

      setSession({
        firebaseUser: null,
        profile: cachedProfile,
        status: 'loading',
      });
    });

    const unsubscribe = observeSession(({ firebaseUser: nextUser, profile: nextProfile }) => {
      setSession({
        firebaseUser: nextUser,
        profile: nextProfile,
        status: nextUser && nextProfile ? 'authenticated' : 'unauthenticated',
      });

      if (!nextUser) {
        resetBins();
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [resetBins, setSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      signIn: async (email, password) => {
        await loginWithEmail(email, password);
      },
      signUp: async (payload) => {
        await registerWithEmail(payload);
      },
      signOut: async () => {
        await logout();
      },
      refreshProfile: async () => {
        if (!firebaseUser) {
          return;
        }

        const nextProfile = await refreshUserProfile(firebaseUser);

        setSession({
          firebaseUser,
          profile: nextProfile,
          status: 'authenticated',
        });
      },
    }),
    [firebaseUser, setSession]
  );

  if (status === 'loading' && !profile) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading Smart Bin</Text>
        <Text style={[styles.loadingHint, { color: theme.colors.textMuted }]}>
          Restoring your session and bin network state.
        </Text>
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '900',
  },
  loadingHint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
