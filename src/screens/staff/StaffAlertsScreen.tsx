import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedCard } from '../../components/AnimatedCard';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useBinStore } from '../../store/binStore';
import { formatTimestamp } from '../../utils/formatters';

export function StaffAlertsScreen() {
  const theme = useAppTheme();
  const allEvents = useBinStore((state) => state.events);
  const events = useMemo(
    () =>
      allEvents.filter(
        (event) => event.type === 'FIRE' || event.type === 'GAS' || event.type === 'TAMPERING'
      ),
    [allEvents]
  );

  return (
    <Screen>
      <SectionHeader
        title="Alert center"
        subtitle="Fire, gas leak, and tampering events are surfaced here with the latest activity first."
      />

      {events.length === 0 ? (
        <EmptyState title="No active alerts" message="Safety alerts will appear here as soon as the sensors publish them." />
      ) : (
        events.map((event, index) => (
          <AnimatedCard key={event.id} delay={index * 30}>
            <View
              style={[
                styles.alertCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.title, { color: theme.colors.text }]}>{event.title}</Text>
              <Text style={[styles.body, { color: theme.colors.textMuted }]}>{event.body}</Text>
              <Text style={[styles.timestamp, { color: theme.colors.accent }]}>
                {formatTimestamp(event.createdAt)}
              </Text>
            </View>
          </AnimatedCard>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  alertCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '700',
  },
});
