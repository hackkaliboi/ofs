// User Management Service for Django Backend
// Handles user CRUD operations, admin functions, and user statistics

import { apiClient, ApiResponse } from './api';
import { DjangoUser, UserProfile } from './auth';

// User list response with pagination
export interface UserListResponse extends ApiResponse<UserWithProfile> {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserWithProfile[];
}

// Combined user and profile data
export interface UserWithProfile {
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
  profile: UserProfile;
  wallets_count: number;
  last_activity?: string;
}

// User creation data
export interface CreateUserData {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
  is_active?: boolean;
  is_staff?: boolean;
  role?: 'user' | 'admin';
}

// User update data
export interface UpdateUserData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_staff?: boolean;
  profile?: Partial<UserProfile>;
}

// User statistics
export interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  users_with_wallets: number;
  users_with_validated_wallets: number;
  admin_users: number;
  inactive_users: number;
}

// User filter options
export interface UserFilters {
  search?: string;
  is_active?: boolean;
  is_staff?: boolean;
  role?: 'user' | 'admin';
  date_joined_after?: string;
  date_joined_before?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

class UserService {
  // Get list of users with filters and pagination
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/users/${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<UserListResponse>(endpoint);
  }

  // Get single user by ID
  async getUser(userId: number): Promise<UserWithProfile> {
    return apiClient.get<UserWithProfile>(`/users/${userId}/`);
  }

  // Create new user (admin only)
  async createUser(userData: CreateUserData): Promise<UserWithProfile> {
    return apiClient.post<UserWithProfile>('/users/', userData);
  }

  // Update user (admin only)
  async updateUser(userId: number, userData: UpdateUserData): Promise<UserWithProfile> {
    return apiClient.patch<UserWithProfile>(`/users/${userId}/`, userData);
  }

  // Delete user (admin only)
  async deleteUser(userId: number): Promise<void> {
    return apiClient.delete<void>(`/users/${userId}/`);
  }

  // Activate/deactivate user
  async toggleUserStatus(userId: number, isActive: boolean): Promise<UserWithProfile> {
    return apiClient.patch<UserWithProfile>(`/users/${userId}/`, { is_active: isActive });
  }

  // Make user admin
  async makeAdmin(userId: number): Promise<UserWithProfile> {
    return apiClient.patch<UserWithProfile>(`/users/${userId}/`, { 
      is_staff: true,
      profile: { role: 'admin' }
    });
  }

  // Remove admin privileges
  async removeAdmin(userId: number): Promise<UserWithProfile> {
    return apiClient.patch<UserWithProfile>(`/users/${userId}/`, { 
      is_staff: false,
      profile: { role: 'user' }
    });
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/users/stats/');
  }

  // Search users
  async searchUsers(query: string, limit: number = 10): Promise<UserWithProfile[]> {
    const response = await this.getUsers({
      search: query,
      page_size: limit
    });
    return response.results;
  }

  // Get recent users
  async getRecentUsers(limit: number = 5): Promise<UserWithProfile[]> {
    const response = await this.getUsers({
      ordering: '-date_joined',
      page_size: limit
    });
    return response.results;
  }

  // Get active users
  async getActiveUsers(limit: number = 10): Promise<UserWithProfile[]> {
    const response = await this.getUsers({
      is_active: true,
      ordering: '-last_login',
      page_size: limit
    });
    return response.results;
  }

  // Bulk operations
  async bulkUpdateUsers(userIds: number[], updateData: Partial<UpdateUserData>): Promise<{ updated: number }> {
    return apiClient.post<{ updated: number }>('/users/bulk-update/', {
      user_ids: userIds,
      update_data: updateData
    });
  }

  async bulkDeleteUsers(userIds: number[]): Promise<{ deleted: number }> {
    return apiClient.post<{ deleted: number }>('/users/bulk-delete/', {
      user_ids: userIds
    });
  }

  // Export users data
  async exportUsers(format: 'csv' | 'xlsx' = 'csv', filters: UserFilters = {}): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [k, v?.toString() || ''])
      )
    });

    const response = await fetch(`${apiClient['baseURL']}/users/export/?${params}`, {
      headers: await apiClient['getHeaders'](),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }
}

// Create singleton instance
export const userService = new UserService();

export default UserService;