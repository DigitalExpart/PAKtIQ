import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, BarChart3, Plus, Calendar, User } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getIconSize, getSpacing } from '../utils/responsive';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'home', Icon: Home, route: '/dashboard' },
    { id: 'insight', Icon: BarChart3, route: '/insights' },
    { id: 'create', Icon: Plus, route: '/create-choice' },
    { id: 'daily', Icon: Calendar, route: '/daily' },
    { id: 'profile', Icon: User, route: '/profile' },
  ];

  const isActive = (route: string) => {
    if (route === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === route || pathname.startsWith(route + '/');
  };

  const iconSize = getIconSize(24);
  const horizontalPadding = getSpacing(16);
  const bottomPadding = Math.max(insets.bottom, getSpacing(8));

  return (
    <View style={[
      styles.container, 
      { 
        paddingBottom: bottomPadding,
        paddingHorizontal: horizontalPadding,
      }
    ]}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        const IconComponent = tab.Icon;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              active && styles.iconContainerActive
            ]}>
              <IconComponent 
                size={iconSize} 
                color="#FFFFFF"
                strokeWidth={active ? 2.5 : 2}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A', // Dark grey background
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: '#3A3A3A', // Lighter grey background for active tab
  },
});
