// Authentication Service for Django Backend
// Handles JWT tokens, session management, and user authentication

import { apiClient } from './api';

// User types for Django backend
export interface DjangoUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
  groups: string[];
  user_permissions: string[];
}

// Profile model for extended user data
export interface UserProfile {
  id: number;
  user: number; // Foreign key to User
  full_name: string;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Auth response from Django
export interface AuthResponse {
  access: string;
  refresh: string;
  user: DjangoUser;
  profile?: UserProfile;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

// Password reset data
export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  password: string;
  password_confirm: string;
}

// Auth service class
class AuthService {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/', credentials, false);
    
    if (response.access) {
      apiClient.setToken(response.access);
      localStorage.setItem('refresh_token', response.refresh);
    }
    
    return response;
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/', data, false);
    
    if (response.access) {
      apiClient.setToken(response.access);
      localStorage.setItem('refresh_token', response.refresh);
    }
    
    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout/', { refresh: refreshToken });
      } catch (error) {
        console.warn('Logout request failed:', error);
      }
    }
    
    apiClient.setToken(null);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  // Refresh access token
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', {
      refresh: refreshToken
    }, false);

    apiClient.setToken(response.access);
    return response.access;
  }

  // Get current user data
  async getCurrentUser(): Promise<DjangoUser> {
    return apiClient.get<DjangoUser>('/auth/user/');
  }

  // Get user profile
  async getUserProfile(userId?: number): Promise<UserProfile> {
    const endpoint = userId ? `/profiles/${userId}/` : '/profiles/me/';
    return apiClient.get<UserProfile>(endpoint);
  }

  // Update user profile
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/profiles/me/', data);
  }

  // Request password reset
  async requestPasswordReset(data: PasswordResetData): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/password/reset/', data, false);
  }

  // Confirm password reset
  async confirmPasswordReset(data: PasswordResetConfirmData): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/password/reset/confirm/', data, false);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  // Check if token is expired (basic check)
  isTokenExpired(): boolean {
    const token = apiClient.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  // Auto-refresh token if needed
  async ensureValidToken(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    if (this.isTokenExpired()) {
      try {
        await this.refreshToken();
        return true;
      } catch {
        await this.logout();
        return false;
      }
    }

    return true;
  }

  // Get stored user data
  getStoredUser(): DjangoUser | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Store user data
  storeUser(user: DjangoUser): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Clear stored data
  clearStoredData(): void {
    localStorage.removeItem('user_data');
    localStorage.removeItem('refresh_token');
    apiClient.setToken(null);
  }
}

// Create singleton instance
export const authService = new AuthService();

export default AuthService;