import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '../hooks/useAppTheme';

interface DashboardStatCardProps {
  label: string;
  value: string;
  helper: string;
}

export function DashboardStatCard({ label, value, helper }: DashboardStatCardProps) {
  const theme = useAppTheme();

  return (
    <LinearGradient colors={theme.colors.cardGradient} style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.helper}>{helper}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    padding: 18,
    gap: 8,
    minHeight: 132,
    justifyContent: 'space-between',
  },
  label: {
    color: '#CFDDE5',
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },
  helper: {
    color: '#CFDDE5',
    fontSize: 13,
    lineHeight: 18,
  },
});
