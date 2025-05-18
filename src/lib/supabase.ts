import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide more helpful error message for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables:');
  if (!supabaseUrl) console.error('- VITE_SUPABASE_URL is not set');
  if (!supabaseAnonKey) console.error('- VITE_SUPABASE_ANON_KEY is not set');
  
  // In development, show how to fix it
  if (import.meta.env.DEV) {
    console.error('\nTo fix this:\n1. Create a .env file in the project root\n2. Add the following variables:\nVITE_SUPABASE_URL=your_supabase_url\nVITE_SUPABASE_ANON_KEY=your_anon_key');
  }
}

// Initialize with empty strings as fallback to prevent runtime errors
// The app will handle the unauthorized state appropriately
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
  }
);