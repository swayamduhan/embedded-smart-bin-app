import { useEffect, useRef } from 'react';

import {
  configureNotificationsAsync,
  onForegroundPushMessage,
  onNotificationOpened,
  requestNotificationPermissionsAsync,
  showStaffEventNotification,
} from '../services/firebase/messaging';
import { updateStoredFcmToken } from '../services/firebase/auth';
import { selectRole, useAuthStore } from '../store/authStore';
import { useBinStore } from '../store/binStore';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const profile = useAuthStore((state) => state.profile);
  const role = useAuthStore(selectRole);
  const events = useBinStore((state) => state.events);
  const lastEventId = useRef<string | null>(null);

  useEffect(() => {
    configureNotificationsAsync();
  }, []);

  useEffect(() => {
    if (!profile || role !== 'STAFF') {
      return;
    }

    requestNotificationPermissionsAsync().then((token) => {
      if (token) {
        updateStoredFcmToken(profile.uid, token).catch(() => undefined);
      }
    });

    const unsubscribeForeground = onForegroundPushMessage(() => undefined);
    const unsubscribeOpened = onNotificationOpened(() => undefined);

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [profile, role]);

  useEffect(() => {
    if (role !== 'STAFF' || events.length === 0) {
      return;
    }

    const newestEvent = events[0];

    if (!newestEvent || newestEvent.id === lastEventId.current) {
      return;
    }

    lastEventId.current = newestEvent.id;
    showStaffEventNotification(newestEvent).catch(() => undefined);
  }, [events, role]);

  return children;
}
