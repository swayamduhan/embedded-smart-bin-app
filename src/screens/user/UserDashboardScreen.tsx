import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedCard } from '../../components/AnimatedCard';
import { BinStatusBadge } from '../../components/BinStatusBadge';
import { DashboardStatCard } from '../../components/DashboardStatCard';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { fixedBin } from '../../config/staticBin';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { openGoogleMapsRoute } from '../../services/maps/googleMaps';
import { useAuthStore } from '../../store/authStore';
import { distanceInKm } from '../../utils/geo';
import { formatDistance } from '../../utils/formatters';

export function UserDashboardScreen() {
  const theme = useAppTheme();
  const profile = useAuthStore((state) => state.profile);
  const { location } = useCurrentLocation();
  const nearbyBins = useMemo(
    () => [
      {
        ...fixedBin,
        distanceKm: location
          ? distanceInKm(location, {
              latitude: fixedBin.lat,
              longitude: fixedBin.lng,
            })
          : 0,
      },
    ],
    [location]
  );

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
          value="1"
          helper="Hardcoded to the fixed demo dustbin for easy testing and routing."
        />
      </View>

      <SectionHeader title="Closest available bins" subtitle="Pinned demo location for quick navigation." />

      {nearbyBins.map((bin, index) => (
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
                  {location ? formatDistance(bin.distanceKm) : 'Pinned location'}
                </Text>
              </View>
              <BinStatusBadge status={bin.status} />
            </View>

            <View style={styles.binFooter}>
              <Text style={[styles.fillLabel, { color: theme.colors.textMuted }]}>
                Fill level {bin.fill}% | Coordinates {bin.lat.toFixed(6)}, {bin.lng.toFixed(6)}
              </Text>
              <Text style={[styles.fillValue, { color: theme.colors.text }]}>
                {bin.alert === 'NONE' ? 'Safe to use' : `Alert: ${bin.alert}`}
              </Text>
            </View>

            <Pressable
              style={[styles.routeButton, { backgroundColor: theme.colors.accent }]}
              onPress={() =>
                openGoogleMapsRoute(bin, location).catch(() =>
                  Alert.alert('Unable to open route')
                )
              }
            >
              <Text style={styles.routeLabel}>Route in Google Maps</Text>
            </Pressable>
          </View>
        </AnimatedCard>
      ))}
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
  routeButton: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  routeLabel: {
    color: '#07131D',
    fontSize: 15,
    fontWeight: '900',
  },
});
