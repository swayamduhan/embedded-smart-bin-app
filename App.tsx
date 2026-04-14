import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';

import { Buffer } from 'buffer';
import process from 'process';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthProvider';
import { NotificationProvider } from './src/context/NotificationProvider';

global.Buffer = global.Buffer ?? Buffer;
global.process = global.process ?? process;

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}
