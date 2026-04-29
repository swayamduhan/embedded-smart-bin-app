import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedCard } from '../../components/AnimatedCard';
import { BinStatusBadge } from '../../components/BinStatusBadge';
import { DashboardStatCard } from '../../components/DashboardStatCard';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { openGoogleMapsRoute } from '../../services/maps/googleMaps';
import { useBinStore } from '../../store/binStore';
import { alertLabel, formatTimestamp } from '../../utils/formatters';

export function StaffDashboardScreen() {
  const theme = useAppTheme();
  const binsById = useBinStore((state) => state.binsById);
  const events = useBinStore((state) => state.events);
  const { location } = useCurrentLocation();
  const bins = useMemo(
    () => Object.values(binsById).sort((left, right) => right.updatedAt - left.updatedAt),
    [binsById]
  );

  return (
    <Screen>
      <SectionHeader
        title="Staff operations"
        subtitle="See every live bin, its current fill level, and jump straight to its location in Google Maps."
      />

      <View style={styles.statsGrid}>
        <DashboardStatCard
          label="Live bins"
          value={`${bins.length}`}
          helper="Every MQTT-connected bin currently visible in the system."
        />
        <DashboardStatCard
          label="Active alerts"
          value={`${events.filter((event) => event.type !== 'FULL').length}`}
          helper="Gas, fire, and tampering incidents from the live network."
        />
      </View>

      <SectionHeader title="All bins" subtitle="Real-time MQTT updates keep this list fresh." />

      {bins.length === 0 ? (
        <EmptyState
          title="No live bins yet"
          message="Once your hardware publishes retained payloads, each bin will show up here with fill level and map location."
        />
      ) : (
        bins.map((bin, index) => (
          <AnimatedCard key={bin.id} delay={index * 40}>
            <View
              style={[
                styles.binCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <View style={styles.headerRow}>
                <View style={styles.headerText}>
                  <Text style={[styles.binName, { color: theme.colors.text }]}>{bin.id}</Text>
                  <Text style={[styles.binMeta, { color: theme.colors.textMuted }]}>
                    Updated {formatTimestamp(bin.updatedAt)}
                  </Text>
                </View>
                <BinStatusBadge status={bin.status} />
              </View>

              <Text style={[styles.fillText, { color: theme.colors.text }]}>
                {bin.fill}% filled | {alertLabel(bin.alert)}
              </Text>
              <Text style={[styles.locationText, { color: theme.colors.textMuted }]}>
                Location {bin.lat.toFixed(6)}, {bin.lng.toFixed(6)}
              </Text>

              <Pressable
                style={[styles.routeButton, { backgroundColor: theme.colors.accent }]}
                onPress={() => openGoogleMapsRoute(bin, location)}
              >
                <Text style={styles.routeLabel}>Open Location in Google Maps</Text>
              </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-start',
  },
  headerText: {
    gap: 5,
    flex: 1,
  },
  binName: {
    fontSize: 20,
    fontWeight: '900',
  },
  binMeta: {
    fontSize: 13,
  },
  fillText: {
    fontSize: 15,
    fontWeight: '700',
  },
  locationText: {
    fontSize: 14,
  },
  routeButton: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLabel: {
    color: '#07131D',
    fontSize: 15,
    fontWeight: '900',
  },
});
