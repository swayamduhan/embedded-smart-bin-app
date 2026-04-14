import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedCard } from '../../components/AnimatedCard';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useAuth } from '../../context/AuthProvider';
import { useAppTheme } from '../../hooks/useAppTheme';
import { selectRole, useAuthStore } from '../../store/authStore';
import { useBinStore } from '../../store/binStore';

export function ProfileScreen() {
  const theme = useAppTheme();
  const { signOut, refreshProfile } = useAuth();
  const profile = useAuthStore((state) => state.profile);
  const role = useAuthStore(selectRole);
  const connectionState = useBinStore((state) => state.connectionState);

  return (
    <Screen>
      <SectionHeader title="Profile" subtitle="Account details, app health, and session controls." />

      <AnimatedCard>
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>{profile?.displayName ?? profile?.email}</Text>
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Role: {role}</Text>
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Green points: {profile?.points ?? 0}</Text>
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            MQTT connection: {connectionState}
          </Text>
        </View>
      </AnimatedCard>

      <Pressable style={[styles.secondaryButton, { borderColor: theme.colors.border }]} onPress={refreshProfile}>
        <Text style={[styles.secondaryLabel, { color: theme.colors.text }]}>Refresh profile</Text>
      </Pressable>

      <Pressable style={[styles.primaryButton, { backgroundColor: theme.colors.danger }]} onPress={signOut}>
        <Text style={styles.primaryLabel}>Sign out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
  },
  meta: {
    fontSize: 15,
  },
  secondaryButton: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
