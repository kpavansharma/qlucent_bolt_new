import { apiClient } from '@/lib/api/apiClient';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  expertise: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  toolsReviewed: number;
  bundlesCreated: number;
  deploymentsCount: number;
  totalDownloads: number;
  avgRating: number;
}

export const userService = {
  // Get user profile
  async getUserProfile(): Promise<UserProfile | null> {
    const response = await apiClient.get<UserProfile>('/api/user/profile');
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Update user profile
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    const response = await apiClient.put<UserProfile>('/api/user/profile', profileData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Get user stats
  async getUserStats(): Promise<UserStats | null> {
    const response = await apiClient.get<UserStats>('/api/user/stats');
    
    if (!response.success || !response.data) {
      return {
        toolsReviewed: 0,
        bundlesCreated: 0,
        deploymentsCount: 0,
        totalDownloads: 0,
        avgRating: 0
      };
    }
    
    return response.data;
  },

  // Get user tools (reviews)
  async getUserTools(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/api/user/tools');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Get user bundles
  async getUserBundles(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/api/user/bundles');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Add tool review
  async addToolReview(toolData: any): Promise<any | null> {
    const response = await apiClient.post<any>('/api/user/tools', toolData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Create bundle
  async createUserBundle(bundleData: any): Promise<any | null> {
    const response = await apiClient.post<any>('/api/user/bundles', bundleData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  }
};