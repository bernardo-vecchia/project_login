
import api from './api';
import { User } from './authService';

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  description: string;
}

export interface UserStats {
  daysActive: number;
  profileUpdates: number;
  securityScore: number;
  lastLogin: Date | null;
}

export const userService = {
  async getAllUsers(roleFilter?: string, sortBy?: string, order?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (roleFilter && roleFilter !== 'all') {
      params.append('role', roleFilter);
    }
    if (sortBy) {
      params.append('sortBy', sortBy);
    }
    if (order) {
      params.append('order', order);
    }
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.patch('/auth/change-password', data);
  },

  async updateProfile(data: UpdateUserData): Promise<User> {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async getUserActivities(userId?: string): Promise<UserActivity[]> {
    const url = userId ? `/users/${userId}/activities` : '/users/activities';
    const response = await api.get(url);
    return response.data;
  },

  async getUserStats(userId?: string): Promise<UserStats> {
    const url = userId ? `/users/${userId}/stats` : '/users/stats';
    const response = await api.get(url);
    return response.data;
  }
};