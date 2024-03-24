// utils/supabase.js
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Access your Supabase URL and Anon Key using Constants.expoConfig
const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig.extra;

// Initialize the Supabase client with the URL and Anon Key
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});