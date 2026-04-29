import { useEffect, useMemo, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { BinMarker } from '../../components/BinMarker';
import { BinStatusBadge } from '../../components/BinStatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useAppTheme } from '../../hooks/useAppTheme';
import { defaultRegion } from '../../services/location/locationService';
import { openGoogleMapsRoute } from '../../services/maps/googleMaps';
import { selectRole, useAuthStore } from '../../store/authStore';
import { useBinStore } from '../../store/binStore';
import { alertLabel, formatTimestamp } from '../../utils/formatters';

export function MapScreen() {
  const theme = useAppTheme();
  const role = useAuthStore(selectRole);
  const mapRef = useRef<MapView | null>(null);
  const binsById = useBinStore((state) => state.binsById);
  const selectedBinId = useBinStore((state) => state.selectedBinId);
  const selectBin = useBinStore((state) => state.selectBin);
  const connectionState = useBinStore((state) => state.connectionState);
  const { location } = useCurrentLocation();
  const bins = useMemo(
    () => Object.values(binsById).sort((left, right) => right.updatedAt - left.updatedAt),
    [binsById]
  );
  const debouncedBins = useDebouncedValue(bins, 250);
  const selectedBin = useMemo(
    () => bins.find((bin) => bin.id === selectedBinId) ?? bins[0] ?? null,
    [bins, selectedBinId]
  );

  useEffect(() => {
    if (debouncedBins.length === 0 || !mapRef.current) {
      return;
    }

    const coordinates = debouncedBins.map((bin) => ({
      latitude: bin.lat,
      longitude: bin.lng,
    }));

    if (location) {
      coordinates.push({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }

    mapRef.current.fitToCoordinates(coordinates, {
      animated: true,
      edgePadding: {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80,
      },
    });
  }, [debouncedBins, location]);

  if (bins.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="Waiting for MQTT data"
          message="Connect your broker and publish retained full payloads to dustbin/status, dustbin/location, and dustbin/alerts to populate the map."
        />
      </Screen>
    );
  }

  return (
    <Screen scrollable={false} contentStyle={styles.screenContent}>
      <View style={[styles.headerCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Live Dustbin Map</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          MQTT state: <Text style={{ color: theme.colors.accent }}>{connectionState}</Text>
        </Text>
      </View>

      <View style={[styles.mapContainer, { borderColor: theme.colors.border }]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.06,
                  longitudeDelta: 0.06,
                }
              : defaultRegion
          }
          showsUserLocation
          showsMyLocationButton
        >
          {debouncedBins.map((bin) => (
            <BinMarker key={bin.id} bin={bin} onPress={(pressedBin) => selectBin(pressedBin.id)} />
          ))}
        </MapView>
      </View>

      {selectedBin ? (
        <View
          style={[
            styles.detailCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.detailRow}>
            <Text style={[styles.binName, { color: theme.colors.text }]}>{selectedBin.id}</Text>
            <BinStatusBadge status={selectedBin.status} />
          </View>

          <Text style={[styles.detailMeta, { color: theme.colors.textMuted }]}>
            Fill level {selectedBin.fill}% | Alert {alertLabel(selectedBin.alert)}
          </Text>
          <Text style={[styles.detailMeta, { color: theme.colors.textMuted }]}>
            Updated {formatTimestamp(selectedBin.updatedAt)}
          </Text>
          <Text style={[styles.detailMeta, { color: theme.colors.textMuted }]}>
            Coordinates {selectedBin.lat.toFixed(6)}, {selectedBin.lng.toFixed(6)}
          </Text>

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
              onPress={() => selectBin(null)}
            >
              <Text style={[styles.secondaryLabel, { color: theme.colors.text }]}>Close</Text>
            </Pressable>

            {role === 'STAFF' ? (
              <Pressable
                style={[styles.primaryButton, { backgroundColor: theme.colors.accent }]}
                onPress={() =>
                  openGoogleMapsRoute(selectedBin, location).catch(() =>
                    Alert.alert('Unable to open route')
                  )
                }
              >
                <Text style={styles.primaryLabel}>Route in Google Maps</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    gap: 14,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    minHeight: 360,
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  binName: {
    fontSize: 22,
    fontWeight: '900',
  },
  detailMeta: {
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    color: '#07131D',
    fontWeight: '900',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontWeight: '800',
    fontSize: 15,
  },
});
