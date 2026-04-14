import { Platform } from 'react-native';

import { getApp } from '@react-native-firebase/app';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  registerDeviceForRemoteMessages,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import type { BinSystemEvent } from '../../types/bin';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let notificationsReady = false;
const messagingInstance = getMessaging(getApp());

export async function configureNotificationsAsync() {
  if (notificationsReady) {
    return;
  }

  notificationsReady = true;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('smart-bin-alerts', {
      name: 'Smart Bin Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#F45D48',
    });
  }
}

export async function requestNotificationPermissionsAsync() {
  if (!Device.isDevice) {
    return null;
  }

  const settings = await Notifications.getPermissionsAsync();

  if (!settings.granted) {
    const request = await Notifications.requestPermissionsAsync();

    if (!request.granted) {
      return null;
    }
  }

  await registerDeviceForRemoteMessages(messagingInstance);
  return getToken(messagingInstance);
}

export function onForegroundPushMessage(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  return onMessage(messagingInstance, callback);
}

export function onNotificationOpened(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  return onNotificationOpenedApp(messagingInstance, callback);
}

export async function showStaffEventNotification(event: BinSystemEvent) {
  await configureNotificationsAsync();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: event.title,
      body: event.body,
      data: {
        binId: event.binId,
        type: event.type,
      },
      sound: true,
    },
    trigger: null,
  });
}
