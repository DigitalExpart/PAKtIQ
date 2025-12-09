import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTabBarHeight, getIconSize, getSpacing, isSmallScreen, wp } from '../utils/responsive';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'home', label: t('navigation.home'), icon: '🏠', route: '/dashboard' },
    { id: 'insights', label: t('navigation.insights'), icon: '📊', route: '/insights' },
    { id: 'add', label: '', icon: '+', route: '/create-choice' },
    { id: 'daily', label: t('navigation.daily'), icon: '📅', route: '/daily' },
    { id: 'profile', label: t('navigation.profile'), icon: '👤', route: '/profile' },
  ];

  const isActive = (route: string) => {
    return pathname === route;
  };

  const tabBarHeight = getTabBarHeight();
  const iconSize = getIconSize(24);
  const fontSize = isSmallScreen ? 10 : 11;
  const horizontalPadding = getSpacing(8);
  const bottomPadding = Math.max(insets.bottom, getSpacing(8));

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface, 
        borderTopColor: colors.border,
        height: tabBarHeight + bottomPadding,
        paddingBottom: bottomPadding,
        paddingHorizontal: horizontalPadding,
      }
    ]}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        
        if (tab.id === 'add') {
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.fabButton}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.fab, 
                { 
                  backgroundColor: colors.primary,
                  width: isSmallScreen ? 48 : 56,
                  height: isSmallScreen ? 48 : 56,
                  borderRadius: isSmallScreen ? 24 : 28,
                }
              ]}>
                <Text style={[
                  styles.fabIcon,
                  { fontSize: isSmallScreen ? 28 : 32 }
                ]}>
                  {tab.icon}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, { minWidth: isSmallScreen ? wp(15) : wp(18) }]}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabIcon, 
              { 
                fontSize: iconSize,
                color: active ? colors.primary : colors.textSecondary 
              }
            ]}>
              {tab.icon}
            </Text>
            <Text 
              style={[
              styles.tabLabel, 
                { 
                  color: active ? colors.primary : colors.textSecondary,
                  fontSize: fontSize,
                }
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    maxWidth: '20%', // Ensure tabs don't overflow
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontWeight: '500',
    textAlign: 'center',
  },
  fabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24, // Reduced from -30 to prevent cutoff
    flex: 1,
    maxWidth: '20%',
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
