import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Share, Platform } from 'react-native';

export interface ShareOptions {
  title: string;
  message: string;
  url?: string;
}

export class ShareService {
  /**
   * Share text/link
   */
  static async shareText(title: string, message: string, url?: string): Promise<void> {
    try {
      let content = `${title}\n\n${message}`;
      if (url) {
        content += `\n\n${url}`;
      }

      await Share.share({
        message: content,
        title: title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      throw error;
    }
  }

  /**
   * Share a pakt/resolution
   */
  static async sharePakt(pakt: {
    name: string;
    description: string;
    category: string;
    progress: number;
    milestones?: Array<{ name: string; completed: boolean }>;
  }): Promise<void> {
    const milestonesText = pakt.milestones
      ? `\n\nMilestones:\n${pakt.milestones.map(m => `• ${m.name} ${m.completed ? '✅' : '⏳'}`).join('\n')}`
      : '';

    const message = `🎯 ${pakt.name}\n\n${pakt.description}\n\nCategory: ${pakt.category}\nProgress: ${pakt.progress}%${milestonesText}\n\nTrack your goals with Resolute Plan!`;

    await this.shareText(pakt.name, message);
  }

  /**
   * Share as link (deep link)
   */
  static async shareAsLink(paktId: string, paktName: string): Promise<void> {
    // TODO: Generate deep link when deep linking is set up
    const url = `https://resoluteplan.app/pakt/${paktId}`;
    const message = `Check out my resolution: ${paktName}\n\n${url}`;
    
    await Share.share({
      message,
      title: `Share ${paktName}`,
    });
  }

  /**
   * Copy link to clipboard
   * Uses Share API as fallback since Clipboard API is deprecated in newer React Native versions
   */
  static async copyLink(paktId: string): Promise<void> {
    const url = `https://resoluteplan.app/pakt/${paktId}`;
    
    if (Platform.OS === 'web') {
      // For web, use navigator.clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (typeof document !== 'undefined') {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } else {
      // For React Native (iOS/Android), use Share API as Clipboard is deprecated
      // This will show share dialog, user can copy from there
      await Share.share({
        message: url,
        title: 'Copy Link',
      });
    }
  }
}
