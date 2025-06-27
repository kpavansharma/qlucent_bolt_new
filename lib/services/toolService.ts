import { apiClient } from '@/lib/api/apiClient';
import { Tool, SearchFilters, PaginatedResponse } from '@/lib/types/api';

export interface ToolSearchParams extends SearchFilters {
  query?: string;
  category?: string;
  license?: string;
  minStars?: number;
  verified?: boolean;
  deploymentReady?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const toolService = {
  // Get all tools with optional filters (use backend search)
  async getTools(params?: ToolSearchParams): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Fetching tools with backend search:', params);
    
    try {
      // Use backend search with proper parameters
      const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', params);
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch tools from backend:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      console.log(`✅ Backend search completed: ${response.data.items.length} items, page ${response.data.page}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error in backend tool search:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  // Get a specific tool by ID
  async getToolById(id: string | number): Promise<Tool | null> {
    console.log('🔍 Fetching tool by ID:', id);
    
    try {
      // First try to use a proper backend endpoint for individual tool
      const response = await apiClient.get<Tool>(`/api/tools/${id}`);
      
      if (response.success && response.data) {
        console.log('✅ Successfully found tool via backend endpoint:', response.data.name);
        return response.data;
      }
      
      // Fallback: fetch all tools and filter (since individual endpoint might not exist)
      console.log('⚠️ Individual tool endpoint not available, fetching all tools...');
      const allToolsResponse = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', { limit: 1000 });
      
      if (!allToolsResponse.success || !allToolsResponse.data) {
        console.error('❌ Failed to fetch tools:', allToolsResponse.error);
        return null;
      }
      
      // Find the tool by ID
      const tool = allToolsResponse.data.items.find(t => t.id.toString() === id.toString());
      
      if (!tool) {
        console.error('❌ Tool not found with ID:', id);
        return null;
      }
      
      console.log('✅ Successfully found tool via fallback:', tool.name);
      return tool;
    } catch (error) {
      console.error('❌ Error fetching tool by ID:', id, error);
      return null;
    }
  },

  // Search tools with query (use backend search)
  async searchTools(query: string, filters?: Omit<ToolSearchParams, 'query'>): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Performing backend search for:', query, filters);
    
    try {
      // Use backend search with query and filters
      const searchParams = { query, ...filters };
      const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', searchParams);
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to search tools from backend:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      console.log(`✅ Backend search completed: ${response.data.items.length} items for query "${query}"`);
      return response.data;
    } catch (error) {
      console.error('❌ Error in backend tool search:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  // Get featured tools
  async getFeaturedTools(): Promise<Tool[]> {
    const response = await apiClient.get<Tool[]>('/api/tools/featured');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Get tools by category
  async getToolsByCategory(category: string, params?: Omit<ToolSearchParams, 'category'>): Promise<PaginatedResponse<Tool>> {
    return this.getTools({ category, ...params });
  },

  // Get tool categories
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/api/tools/categories');
    
    if (!response.success || !response.data) {
      return ['DevOps', 'AI/ML', 'Frontend', 'Backend', 'Database', 'Security', 'Monitoring'];
    }
    
    return response.data;
  },

  // Get similar tools
  async getSimilarTools(toolId: string | number): Promise<Tool[]> {
    const response = await apiClient.get<Tool[]>(`/api/tools/${toolId}/similar`);
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  }
};