import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database } from '../types/database';

// Check if we're in a web or native environment
const isWeb = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Get environment variables - works for both Vite and Expo
const supabaseUrl = isWeb 
  ? (import.meta.env?.VITE_SUPABASE_URL as string) 
  : (Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL);

const supabaseAnonKey = isWeb 
  ? (import.meta.env?.VITE_SUPABASE_ANON_KEY as string)
  : (Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('Environment:', isWeb ? 'Web' : 'Native');
  console.log('supabaseUrl:', supabaseUrl ? '✓ Found' : '✗ Missing');
  console.log('supabaseAnonKey:', supabaseAnonKey ? '✓ Found' : '✗ Missing');
  throw new Error('Missing Supabase environment variables. Check your .env.local or app.json');
}

console.log('✅ Supabase client initializing for:', isWeb ? 'Web' : 'Expo Native');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: isWeb, // Only for web
    storage: isWeb ? window.localStorage : undefined,
  },
});

