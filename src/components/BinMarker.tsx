import { memo } from 'react';
import { Marker } from 'react-native-maps';

import type { Dustbin } from '../types/bin';

interface BinMarkerProps {
  bin: Dustbin;
  onPress: (bin: Dustbin) => void;
}

function markerColor(bin: Dustbin) {
  if (bin.status === 'FULL') {
    return '#F45D48';
  }

  if (bin.status === 'ALMOST_FULL') {
    return '#F6C453';
  }

  return '#20C997';
}

function BinMarkerComponent({ bin, onPress }: BinMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: bin.lat,
        longitude: bin.lng,
      }}
      pinColor={markerColor(bin)}
      title={bin.id}
      description={`${bin.fill}% filled`}
      tracksViewChanges={false}
      onPress={() => onPress(bin)}
    />
  );
}

export const BinMarker = memo(
  BinMarkerComponent,
  (previous, next) =>
    previous.bin.id === next.bin.id &&
    previous.bin.lat === next.bin.lat &&
    previous.bin.lng === next.bin.lng &&
    previous.bin.fill === next.bin.fill &&
    previous.bin.status === next.bin.status &&
    previous.bin.alert === next.bin.alert
);
