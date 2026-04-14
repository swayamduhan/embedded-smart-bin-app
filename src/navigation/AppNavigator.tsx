import { NavigationContainer } from '@react-navigation/native';

import { useAppTheme } from '../hooks/useAppTheme';
import { useAuthStore } from '../store/authStore';
import { AuthStack } from './AuthStack';
import { RoleTabs } from './RoleTabs';

export function AppNavigator() {
  const theme = useAppTheme();
  const status = useAuthStore((state) => state.status);

  return (
    <NavigationContainer theme={theme.navigation}>
      {status === 'authenticated' ? <RoleTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
