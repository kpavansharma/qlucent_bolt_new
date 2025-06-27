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
  // Get all bundles with optional filters (client-side filtering since backend filtering is not working)
  async getBundles(params?: BundleSearchParams): Promise<PaginatedResponse<Bundle>> {
    console.log('🔍 Fetching bundles with params:', params);
    
    try {
      // Fetch all bundles since backend filtering doesn't work
      const response = await apiClient.get<PaginatedResponse<Bundle>>('/api/bundles', { limit: 1000 });
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch bundles:', response.error);
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
      
      let filteredBundles = bundlesWithDefaults;
      
      // Apply search query filter
      if (params?.query) {
        const searchTerm = params.query.toLowerCase();
        filteredBundles = filteredBundles.filter(bundle => 
          bundle.name.toLowerCase().includes(searchTerm) ||
          bundle.description.toLowerCase().includes(searchTerm) ||
          bundle.category.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply category filter
      if (params?.category) {
        filteredBundles = filteredBundles.filter(bundle => 
          bundle.category.toLowerCase() === params.category!.toLowerCase()
        );
      }
      
      // Apply difficulty filter
      if (params?.difficulty) {
        filteredBundles = filteredBundles.filter(bundle => 
          bundle.difficulty.toLowerCase() === params.difficulty!.toLowerCase()
        );
      }
      
      // Apply AI curated filter
      if (params?.aiCurated) {
        filteredBundles = filteredBundles.filter(bundle => bundle.aiCurated);
      }
      
      // Apply sorting
      if (params?.sortBy) {
        switch (params.sortBy) {
          case 'Popularity':
            filteredBundles.sort((a, b) => b.deployments - a.deployments);
            break;
          case 'Recently Updated':
            filteredBundles.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
            break;
          case 'Most Deployed':
            filteredBundles.sort((a, b) => b.deployments - a.deployments);
            break;
          case 'Highest Rated':
            filteredBundles.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBundles = filteredBundles.slice(startIndex, endIndex);
      
      console.log(`✅ Client-side bundle filtering completed: ${filteredBundles.length} total, ${paginatedBundles.length} on page ${page}`);
      
      return {
        items: paginatedBundles,
        total: filteredBundles.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(filteredBundles.length / limit)
      };
    } catch (error) {
      console.error('❌ Error in client-side bundle filtering:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  // Get a specific bundle by ID (fetch all pages if needed)
  async getBundleById(id: string | number): Promise<Bundle | null> {
    console.log('🔍 Fetching bundle by ID:', id);
    try {
      let page = 1;
      let found: Bundle | null = null;
      let totalPages = 1;
      do {
        const response = await apiClient.get<PaginatedResponse<Bundle>>('/api/bundles', { limit: 100, page });
        if (!response.success || !response.data) {
          console.error('❌ Failed to fetch bundles:', response.error);
          return null;
        }
        // Add missing fields with default values
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
        found = bundlesWithDefaults.find(b => b.id.toString() === id.toString()) || null;
        totalPages = response.data.totalPages || 1;
        page++;
      } while (!found && page <= totalPages);
      if (!found) {
        console.error('❌ Bundle not found with ID:', id);
        return null;
      }
      console.log('✅ Successfully found bundle:', found.name);
      return found;
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