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
  // Get all tools with optional filters
  async getTools(params?: ToolSearchParams): Promise<PaginatedResponse<Tool>> {
    const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', params);
    
    if (!response.success || !response.data) {
      // Return fallback data if API fails
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

  // Get a specific tool by ID
  async getToolById(id: string | number): Promise<Tool | null> {
    console.log('🔍 Fetching tool by ID:', id);
    
    try {
      // Since individual tool endpoint doesn't exist, fetch all tools and filter
      const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', { limit: 1000 });
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch tools:', response.error);
        return null;
      }
      
      // Find the tool by ID
      const tool = response.data.items.find(t => t.id.toString() === id.toString());
      
      if (!tool) {
        console.error('❌ Tool not found with ID:', id);
        return null;
      }
      
      console.log('✅ Successfully found tool:', tool.name);
      return tool;
    } catch (error) {
      console.error('❌ Error fetching tool by ID:', id, error);
      return null;
    }
  },

  // Search tools with query (client-side filtering since backend search is not working)
  async searchTools(query: string, filters?: Omit<ToolSearchParams, 'query'>): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Performing client-side search for:', query, filters);
    
    try {
      // Fetch all tools since backend search doesn't work
      const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', { limit: 1000 });
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch tools for search:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      let filteredTools = response.data.items;
      
      // Apply search query filter
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredTools = filteredTools.filter(tool => 
          tool.name.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.category.toLowerCase().includes(searchTerm) ||
          tool.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply category filter
      if (filters?.category) {
        filteredTools = filteredTools.filter(tool => 
          tool.category.toLowerCase() === filters.category!.toLowerCase()
        );
      }
      
      // Apply license filter
      if (filters?.license) {
        filteredTools = filteredTools.filter(tool => 
          tool.license.toLowerCase() === filters.license!.toLowerCase()
        );
      }
      
      // Apply min stars filter
      if (filters?.minStars) {
        filteredTools = filteredTools.filter(tool => tool.stars >= filters.minStars!);
      }
      
      // Apply verified filter
      if (filters?.verified) {
        filteredTools = filteredTools.filter(tool => tool.verified);
      }
      
      // Apply deployment ready filter
      if (filters?.deploymentReady) {
        filteredTools = filteredTools.filter(tool => tool.deploymentReady);
      }
      
      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'stars':
            filteredTools.sort((a, b) => b.stars - a.stars);
            break;
          case 'downloads':
            filteredTools.sort((a, b) => b.downloads.localeCompare(a.downloads));
            break;
          case 'name':
            filteredTools.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'updated':
            filteredTools.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
            break;
        }
      }
      
      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTools = filteredTools.slice(startIndex, endIndex);
      
      console.log(`✅ Client-side search completed: ${filteredTools.length} total, ${paginatedTools.length} on page ${page}`);
      
      return {
        items: paginatedTools,
        total: filteredTools.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(filteredTools.length / limit)
      };
    } catch (error) {
      console.error('❌ Error in client-side search:', error);
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