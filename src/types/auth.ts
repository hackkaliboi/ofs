import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  phone?: string;
  country?: string;
  timezone?: string;
  avatar_url?: string | null;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any, error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any, error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface AdminSession {
  user_id: string;
  session_id: string;
}
