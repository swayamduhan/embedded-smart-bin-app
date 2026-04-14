import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedCard } from '../../components/AnimatedCard';
import { BinStatusBadge } from '../../components/BinStatusBadge';
import { DashboardStatCard } from '../../components/DashboardStatCard';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useNearbyBins } from '../../hooks/useNearbyBins';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuthStore } from '../../store/authStore';
import { useBinStore } from '../../store/binStore';
import { formatDistance } from '../../utils/formatters';

export function UserDashboardScreen() {
  const theme = useAppTheme();
  const profile = useAuthStore((state) => state.profile);
  const binsById = useBinStore((state) => state.binsById);
  const bins = useMemo(
    () => Object.values(binsById).sort((left, right) => right.updatedAt - left.updatedAt),
    [binsById]
  );
  const { location } = useCurrentLocation();
  const nearbyBins = useNearbyBins(bins, location, 5);

  return (
    <Screen>
      <SectionHeader
        title="Citizen dashboard"
        subtitle="Find nearby available bins and keep track of your green rewards in real time."
      />

      <View style={styles.statsGrid}>
        <DashboardStatCard
          label="Green points"
          value={`${profile?.points ?? 0}`}
          helper="Reward users for choosing clean, available smart bins."
        />
        <DashboardStatCard
          label="Nearby bins"
          value={`${nearbyBins.length}`}
          helper="Only bins with available capacity are surfaced here."
        />
      </View>

      <SectionHeader title="Closest available bins" subtitle="Sorted by your current location." />

      {nearbyBins.length === 0 ? (
        <EmptyState
          title="No nearby bins right now"
          message="Either location permission is off or every nearby bin is already full."
        />
      ) : (
        nearbyBins.map((bin, index) => (
          <AnimatedCard key={bin.id} delay={index * 50}>
            <View
              style={[
                styles.binCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <View style={styles.binHeader}>
                <View>
                  <Text style={[styles.binName, { color: theme.colors.text }]}>{bin.id}</Text>
                  <Text style={[styles.binMeta, { color: theme.colors.textMuted }]}>
                    {formatDistance(bin.distanceKm)} away
                  </Text>
                </View>
                <BinStatusBadge status={bin.status} />
              </View>

              <View style={styles.binFooter}>
                <Text style={[styles.fillLabel, { color: theme.colors.textMuted }]}>
                  Fill level {bin.fill}%
                </Text>
                <Text style={[styles.fillValue, { color: theme.colors.text }]}>
                  {bin.alert === 'NONE' ? 'Safe to use' : `Alert: ${bin.alert}`}
                </Text>
              </View>
            </View>
          </AnimatedCard>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    gap: 14,
  },
  binCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  binName: {
    fontSize: 20,
    fontWeight: '900',
  },
  binMeta: {
    fontSize: 14,
    marginTop: 4,
  },
  binFooter: {
    gap: 6,
  },
  fillLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  fillValue: {
    fontSize: 16,
    fontWeight: '800',
  },
});
