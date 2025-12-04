import { useState, useEffect } from 'react';
import { SettingsService, type NotificationPreferences } from '../services/settings.service';
import { useAuth } from '../contexts/AuthContext';

export function useSettings() {
  const { user } = useAuth();
  const [darkMode, setDarkModeState] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const settings = await SettingsService.getAllSettings(user.id);
      setDarkModeState(settings.darkMode);
      setNotificationPrefs(settings.notificationPreferences as NotificationPreferences);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = async (enabled: boolean) => {
    if (!user) return;

    try {
      setDarkModeState(enabled);
      await SettingsService.toggleDarkMode(user.id, enabled);
    } catch (error) {
      console.error('Error toggling dark mode:', error);
      // Revert on error
      setDarkModeState(!enabled);
      throw error;
    }
  };

  const updateNotificationPreference = async (
    key: keyof NotificationPreferences,
    value: any
  ) => {
    if (!user) return;

    try {
      const updated = { ...notificationPrefs, [key]: value } as NotificationPreferences;
      setNotificationPrefs(updated);
      await SettingsService.updateNotificationPreferences(user.id, { [key]: value });
    } catch (error) {
      console.error('Error updating notification preference:', error);
      // Revert on error
      await loadSettings();
      throw error;
    }
  };

  const updateQuietHours = async (start: string, end: string) => {
    if (!user) return;

    try {
      await SettingsService.updateQuietHours(user.id, start, end);
      await loadSettings();
    } catch (error) {
      console.error('Error updating quiet hours:', error);
      throw error;
    }
  };

  return {
    darkMode,
    notificationPrefs,
    loading,
    toggleDarkMode,
    updateNotificationPreference,
    updateQuietHours,
    refresh: loadSettings,
  };
}

