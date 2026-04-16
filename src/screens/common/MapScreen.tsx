import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { BinMarker } from '../../components/BinMarker';
import { BinStatusBadge } from '../../components/BinStatusBadge';
import { Screen } from '../../components/Screen';
import { fixedBin, fixedBinRegion } from '../../config/staticBin';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { openGoogleMapsRoute } from '../../services/maps/googleMaps';
import { alertLabel, formatTimestamp } from '../../utils/formatters';

export function MapScreen() {
  const theme = useAppTheme();
  const { location } = useCurrentLocation();

  return (
    <Screen scrollable={false} contentStyle={styles.screenContent}>
      <View style={[styles.headerCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Pinned Dustbin Map</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Fixed bin location at 12.974970, 79.165385 with direct Google Maps routing.
        </Text>
      </View>

      <View style={[styles.mapContainer, { borderColor: theme.colors.border }]}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={fixedBinRegion}
          showsUserLocation
          showsMyLocationButton
        >
          <BinMarker bin={fixedBin} onPress={() => undefined} />
        </MapView>
      </View>

      <View
        style={[
          styles.detailCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <View style={styles.detailRow}>
          <Text style={[styles.binName, { color: theme.colors.text }]}>{fixedBin.id}</Text>
          <BinStatusBadge status={fixedBin.status} />
        </View>

        <Text style={[styles.detailMeta, { color: theme.colors.textMuted }]}>
          Fill level {fixedBin.fill}% | Alert {alertLabel(fixedBin.alert)}
        </Text>
        <Text style={[styles.detailMeta, { color: theme.colors.textMuted }]}>
          Updated {formatTimestamp(fixedBin.updatedAt)}
        </Text>
        <Text style={[styles.detailMeta, { color: theme.colors.textMuted }]}>
          Coordinates {fixedBin.lat.toFixed(6)}, {fixedBin.lng.toFixed(6)}
        </Text>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: theme.colors.accent }]}
            onPress={() =>
              openGoogleMapsRoute(fixedBin, location).catch(() =>
                Alert.alert('Unable to open route')
              )
            }
          >
            <Text style={styles.primaryLabel}>Route in Google Maps</Text>
          </Pressable>
        </View>
      </View>
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
});
