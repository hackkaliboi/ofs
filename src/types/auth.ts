import { User, AuthResponse, AuthError } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  full_name: string;
  name?: string;
  email?: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  avatar?: string;
  avatar_url?: string | null;
  kyc_status?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  bio?: string;
  two_factor_enabled?: boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: AuthResponse['data'], error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ data: AuthResponse['data'], error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<boolean>;
}

export interface AdminSession {
  user_id: string;
  session_id: string;
}
