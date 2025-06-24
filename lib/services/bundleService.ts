import { apiClient } from '@/lib/api/apiClient';
import { Bundle, PaginatedResponse } from '@/lib/types/api';

export interface BundleSearchParams {
  query?: string;
  category?: string;
  difficulty?: string;
  aiCurated?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const bundleService = {
  // Get all bundles with optional filters
  async getBundles(params?: BundleSearchParams): Promise<PaginatedResponse<Bundle>> {
    const response = await apiClient.get<PaginatedResponse<Bundle>>('/api/bundles', params);
    
    if (!response.success || !response.data) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
    
    return response.data;
  },

  // Get a specific bundle by ID
  async getBundleById(id: string | number): Promise<Bundle | null> {
    const response = await apiClient.get<Bundle>(`/api/bundles/${id}`);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Get featured bundles
  async getFeaturedBundles(): Promise<Bundle[]> {
    const response = await apiClient.get<Bundle[]>('/api/bundles/featured');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Search bundles
  async searchBundles(query: string, filters?: Omit<BundleSearchParams, 'query'>): Promise<PaginatedResponse<Bundle>> {
    const params = { query, ...filters };
    return this.getBundles(params);
  },

  // Get AI-curated bundles
  async getAICuratedBundles(): Promise<Bundle[]> {
    const response = await apiClient.get<Bundle[]>('/api/bundles/ai-curated');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Create a new bundle
  async createBundle(bundleData: Partial<Bundle>): Promise<Bundle | null> {
    const response = await apiClient.post<Bundle>('/api/bundles', bundleData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Update a bundle
  async updateBundle(id: string | number, bundleData: Partial<Bundle>): Promise<Bundle | null> {
    const response = await apiClient.put<Bundle>(`/api/bundles/${id}`, bundleData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Delete a bundle
  async deleteBundle(id: string | number): Promise<boolean> {
    const response = await apiClient.delete(`/api/bundles/${id}`);
    return response.success;
  }
};