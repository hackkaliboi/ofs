import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    // Add debug logging
    fetch: (url: string, options: RequestInit) => {
      console.log('Supabase Request:', url, options);
      return fetch(url, options).then(async (response) => {
        const clone = response.clone();
        try {
          const data = await clone.json();
          console.log('Supabase Response:', data);
        } catch (e) {
          console.log('Supabase Response:', await clone.text());
        }
        return response;
      });
    }
  }
})
