import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAppTheme } from '../hooks/useAppTheme';
import { MapScreen } from '../screens/common/MapScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { StaffAlertsScreen } from '../screens/staff/StaffAlertsScreen';
import { StaffDashboardScreen } from '../screens/staff/StaffDashboardScreen';
import { UserDashboardScreen } from '../screens/user/UserDashboardScreen';
import { selectRole, useAuthStore } from '../store/authStore';
import type { SharedTabsParamList } from './types';

const Tab = createBottomTabNavigator<SharedTabsParamList>();

export function RoleTabs() {
  const theme = useAppTheme();
  const role = useAuthStore(selectRole);
  const isStaff = role === 'STAFF';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Dashboard'
              ? 'grid'
              : route.name === 'Map'
                ? 'map'
                : route.name === 'Alerts'
                  ? 'alert-circle'
                  : 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={isStaff ? StaffDashboardScreen : UserDashboardScreen}
      />
      <Tab.Screen name="Map" component={MapScreen} />
      {isStaff ? <Tab.Screen name="Alerts" component={StaffAlertsScreen} /> : null}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
