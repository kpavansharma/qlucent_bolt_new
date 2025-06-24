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
    const response = await apiClient.get<Tool>(`/api/tools/${id}`);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Search tools with query
  async searchTools(query: string, filters?: Omit<ToolSearchParams, 'query'>): Promise<PaginatedResponse<Tool>> {
    const params = { query, ...filters };
    return this.getTools(params);
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