import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';
// Import legacy API for backward compatibility
import * as FileSystemLegacy from 'expo-file-system/legacy';

export class StorageService {
  /**
   * Check if the avatars bucket exists, create it if it doesn't
   */
  private static async ensureBucketExists(): Promise<void> {
    try {
      // Try to list files in the bucket to check if it exists
      const { data, error } = await supabase.storage.from('avatars').list('', {
        limit: 1,
      });

      // If bucket doesn't exist, we'll get an error
      // In production, the bucket should be created via migration
      if (error && error.message?.includes('not found') || error?.statusCode === 404) {
        console.warn('Avatars bucket not found. Please create it in Supabase dashboard.');
        throw new Error('Storage bucket not configured. Please contact support or check Supabase storage setup.');
      }
    } catch (error: any) {
      // If it's our custom error, rethrow it
      if (error.message?.includes('Storage bucket not configured')) {
        throw error;
      }
      // Otherwise, log and continue (bucket might exist but have no files)
      console.log('Bucket check:', error.message);
    }
  }

  /**
   * Upload a profile image to Supabase storage
   * @param userId - The user's ID
   * @param imageUri - The local URI of the image to upload
   * @returns The public URL of the uploaded image
   */
  static async uploadProfileImage(userId: string, imageUri: string): Promise<string> {
    try {
      // Ensure bucket exists
      await this.ensureBucketExists();

      // Read the file - handle both web and native
      let fileData: Blob | Uint8Array;
      let contentType = 'image/jpeg';

      if (Platform.OS === 'web') {
        // For web, fetch the file and convert to Blob
        const response = await fetch(imageUri);
        fileData = await response.blob();
        contentType = response.headers.get('content-type') || 'image/jpeg';
      } else {
        // For React Native, use fetch to read the file and convert to blob/uint8array
        try {
          // Method 1: Try using fetch (works for file:// URIs in React Native)
          const response = await fetch(imageUri);
          if (response.ok) {
            const blob = await response.blob();
            // Convert blob to Uint8Array
            const arrayBuffer = await blob.arrayBuffer();
            fileData = new Uint8Array(arrayBuffer);
            contentType = blob.type || 'image/jpeg';
          } else {
            throw new Error('Failed to fetch image');
          }
        } catch (fetchError) {
          // Method 2: Fallback to FileSystem legacy API if fetch fails
          try {
            // Read file as base64 using legacy FileSystem API
            const base64 = await FileSystemLegacy.readAsStringAsync(imageUri, {
              encoding: FileSystemLegacy.EncodingType.Base64,
            });
            
            // Convert base64 to Uint8Array
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            fileData = new Uint8Array(byteNumbers);
          } catch (fileSystemError: any) {
            // If both methods fail, provide helpful error
            throw new Error(
              `Failed to read image file: ${fileSystemError?.message || 'Unknown error'}. ` +
              'Please ensure the image file is accessible and try again.'
            );
          }
        }
      
        // Determine content type from file extension
        const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeTypes: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          webp: 'image/webp',
        };
        contentType = mimeTypes[fileExt] || 'image/jpeg';
      }
      
      // Create a unique filename with user folder structure
      // Format: {userId}/{timestamp}.{ext}
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const fileName = `${timestamp}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileData, {
          contentType,
          upsert: true,
          cacheControl: '3600',
        });

      if (error) {
        console.error('Storage upload error:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('not found') || error.statusCode === 404) {
          throw new Error('Storage bucket not found. Please ensure the "avatars" bucket exists in Supabase.');
        } else if (error.message?.includes('permission') || error.message?.includes('policy')) {
          throw new Error('Permission denied. Please check storage policies in Supabase.');
        } else if (error.message?.includes('size') || error.message?.includes('too large')) {
          throw new Error('Image file is too large. Please choose a smaller image.');
        } else {
          throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
        }
      }

      if (!data) {
        throw new Error('Upload failed: No data returned from storage');
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error in uploadProfileImage:', error);
      
      // Re-throw with user-friendly message if it's already our custom error
      if (error.message && !error.message.includes('Error in uploadProfileImage')) {
      throw error;
      }
      
      // Otherwise, wrap in a user-friendly error
      throw new Error(error.message || 'Failed to upload image. Please check your internet connection and try again.');
    }
  }

  /**
   * Delete a profile image from Supabase storage
   * @param imageUrl - The public URL of the image to delete
   */
  static async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('avatars')).join('/');

      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteProfileImage:', error);
      throw error;
    }
  }
}
