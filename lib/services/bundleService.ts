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
  // Get all bundles with optional filters (use backend search)
  async getBundles(params?: BundleSearchParams): Promise<PaginatedResponse<Bundle>> {
    console.log('🔍 Fetching bundles with backend search:', params);
    
    try {
      // Use backend search with proper parameters
      const response = await apiClient.get<PaginatedResponse<Bundle>>('/api/bundles', params);
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch bundles from backend:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      // Add missing fields with default values to match the Bundle type
      const bundlesWithDefaults = response.data.items.map((bundle: any) => ({
        ...bundle,
        category: bundle.category || 'General',
        tools: bundle.tools || [],
        useCase: bundle.useCase || 'General purpose',
        difficulty: bundle.difficulty || 'Intermediate',
        estimatedTime: bundle.estimatedTime || '2-4 hours',
        popularity: bundle.popularity || 0,
        lastUpdated: bundle.lastUpdated || bundle.created_at || new Date().toISOString(),
        aiCurated: bundle.aiCurated || false,
        deployments: bundle.deployments || 0,
        rating: bundle.rating || 4.0,
        tags: bundle.tags || [],
        author: bundle.author || 'Community',
        featured: bundle.featured || false
      }));
      
      console.log(`✅ Backend search completed: ${bundlesWithDefaults.length} items, page ${response.data.page}`);
      
      return {
        ...response.data,
        items: bundlesWithDefaults
      };
    } catch (error) {
      console.error('❌ Error in backend bundle search:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  // Get a specific bundle by ID
  async getBundleById(id: string | number): Promise<Bundle | null> {
    console.log('🔍 Fetching bundle by ID:', id);
    
    try {
      // First try to use a proper backend endpoint for individual bundle
      const response = await apiClient.get<Bundle>(`/api/bundles/${id}`);
      
      if (response.success && response.data) {
        console.log('✅ Successfully found bundle via backend endpoint:', response.data.name);
        return response.data;
      }
      
      // Fallback: fetch all bundles and filter (since individual endpoint might not exist)
      console.log('⚠️ Individual bundle endpoint not available, fetching all bundles...');
      const allBundlesResponse = await apiClient.get<PaginatedResponse<Bundle>>('/api/bundles', { limit: 1000 });
      
      if (!allBundlesResponse.success || !allBundlesResponse.data) {
        console.error('❌ Failed to fetch bundles:', allBundlesResponse.error);
        return null;
      }
      
      // Find the bundle by ID
      const bundle = allBundlesResponse.data.items.find(b => b.id.toString() === id.toString());
      
      if (!bundle) {
        console.error('❌ Bundle not found with ID:', id);
        return null;
      }
      
      // Add missing fields with default values
      const bundleWithDefaults = {
        ...bundle,
        category: bundle.category || 'General',
        tools: bundle.tools || [],
        useCase: bundle.useCase || 'General purpose',
        difficulty: bundle.difficulty || 'Intermediate',
        estimatedTime: bundle.estimatedTime || '2-4 hours',
        popularity: bundle.popularity || 0,
        lastUpdated: bundle.lastUpdated || (bundle as any).created_at || new Date().toISOString(),
        aiCurated: bundle.aiCurated || false,
        deployments: bundle.deployments || 0,
        rating: bundle.rating || 4.0,
        tags: bundle.tags || [],
        author: bundle.author || 'Community',
        featured: bundle.featured || false
      };
      
      console.log('✅ Successfully found bundle via fallback:', bundleWithDefaults.name);
      return bundleWithDefaults;
    } catch (error) {
      console.error('❌ Error fetching bundle by ID:', id, error);
      return null;
    }
  },

  // Get featured bundles (using main endpoint since featured endpoint doesn't exist)
  async getFeaturedBundles(): Promise<Bundle[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Bundle>>('/api/bundles', { limit: 4 });
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch featured bundles:', response.error);
        return [];
      }
      
      console.log('✅ Successfully fetched featured bundles:', response.data.items.length);
      return response.data.items;
    } catch (error) {
      console.error('❌ Error fetching featured bundles:', error);
      return [];
    }
  },

  // Search bundles (client-side filtering since backend search is not working)
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