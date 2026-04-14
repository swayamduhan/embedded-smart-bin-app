import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../hooks/useAppTheme';
import type { BinStatus } from '../types/bin';
import { statusLabel } from '../utils/formatters';

interface BinStatusBadgeProps {
  status: BinStatus;
}

export function BinStatusBadge({ status }: BinStatusBadgeProps) {
  const theme = useAppTheme();

  const backgroundColor =
    status === 'FULL'
      ? theme.colors.danger
      : status === 'ALMOST_FULL'
        ? theme.colors.warning
        : theme.colors.success;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.label}>{statusLabel(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#08131D',
    fontWeight: '800',
    fontSize: 12,
  },
});
