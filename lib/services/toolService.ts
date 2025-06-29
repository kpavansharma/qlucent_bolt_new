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
  // Get tools with simplified backend integration
  async getTools(params?: ToolSearchParams): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Fetching tools with params:', params);
    
    try {
      // Prepare clean parameters for backend
      const backendParams: Record<string, any> = {};
      
      if (params) {
        // Search query
        if (params.query?.trim()) {
          backendParams.search = params.query.trim();
        }
        
        // Category filter - this is the key fix
        if (params.category && params.category !== 'All') {
          backendParams.category = params.category;
          console.log('🎯 Setting category filter:', params.category);
        }
        
        // Other filters
        if (params.license && params.license !== 'All') {
          backendParams.license = params.license;
        }
        
        if (params.minStars && params.minStars > 0) {
          backendParams.min_stars = params.minStars;
        }
        
        if (params.verified) {
          backendParams.verified = params.verified;
        }
        
        if (params.deploymentReady) {
          backendParams.deployment_ready = params.deploymentReady;
        }
        
        if (params.sortBy && params.sortBy !== 'relevance') {
          backendParams.sort_by = params.sortBy;
        }
        
        // Pagination
        if (params.page) {
          backendParams.page = params.page;
        }
        
        if (params.limit) {
          backendParams.limit = params.limit;
        }
      }
      
      console.log('📤 Sending to backend:', backendParams);
      
      // Make API request
      const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', backendParams);
      
      if (!response.success || !response.data) {
        console.error('❌ Backend request failed:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 0
        };
      }
      
      console.log('📥 Backend response:', {
        itemsCount: response.data.items?.length || 0,
        total: response.data.total,
        page: response.data.page,
        sampleItems: response.data.items?.slice(0, 2).map(item => ({ 
          id: item.id, 
          name: item.name, 
          category: item.category 
        }))
      });
      
      // Map response to Tool interface
      const tools = (response.data.items || []).map((tool: any) => ({
        id: tool.id,
        name: tool.name || 'Unknown Tool',
        description: tool.description || 'No description available',
        category: tool.category || 'Other',
        stars: tool.stars || 0,
        downloads: tool.downloads || '0',
        license: tool.license || 'Unknown',
        lastUpdated: tool.lastUpdated || new Date().toISOString(),
        tags: tool.tags || [],
        verified: tool.verified || false,
        aiScore: tool.aiScore || Math.floor(Math.random() * 40) + 60,
        compatibility: tool.compatibility || [],
        deploymentReady: tool.deploymentReady || false,
        website: tool.website,
        github: tool.github,
        documentation: tool.documentation,
        maintainers: tool.maintainers || [],
        languages: tool.languages || [],
        fileSize: tool.fileSize,
        versions: tool.versions || [],
        requirements: tool.requirements || {
          memory: '512MB',
          storage: '1GB',
          os: 'Linux, macOS, Windows'
        },
        features: tool.features || [],
        useCases: tool.useCases || [],
        similarTools: tool.similarTools || [],
        pricing: tool.pricing || {
          personal: 'Free',
          pro: '$10/month',
          team: '$50/month',
          business: 'Contact Sales'
        },
        support: tool.support || {
          community: 'Community forums and GitHub issues',
          documentation: 'Comprehensive documentation available',
          training: 'Online tutorials and guides',
          enterprise: 'Enterprise support available'
        }
      }));
      
      return {
        items: tools,
        total: response.data.total || tools.length,
        page: response.data.page || 1,
        limit: response.data.limit || params?.limit || 12,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || tools.length) / (params?.limit || 12))
      };
    } catch (error) {
      console.error('❌ Error fetching tools:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0
      };
    }
  },

  // Search tools with query
  async searchTools(query: string, filters?: Omit<ToolSearchParams, 'query'>): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Searching tools:', query, filters);
    return this.getTools({ query: query.trim(), ...filters });
  },

  // Get tool by ID
  async getToolById(id: string | number): Promise<Tool | null> {
    console.log('🔍 Fetching tool by ID:', id);
    
    try {
      const response = await apiClient.get<Tool>(`/api/tools/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback: search in all tools
      const allToolsResponse = await this.getTools({ limit: 1000 });
      const tool = allToolsResponse.items.find(t => t.id.toString() === id.toString());
      
      return tool || null;
    } catch (error) {
      console.error('❌ Error fetching tool by ID:', error);
      return null;
    }
  },

  // Get featured tools
  async getFeaturedTools(): Promise<Tool[]> {
    try {
      const response = await apiClient.get<Tool[]>('/api/tools/featured');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback: get top tools
      const topTools = await this.getTools({ sortBy: 'stars', limit: 6 });
      return topTools.items;
    } catch (error) {
      console.error('❌ Error fetching featured tools:', error);
      return [];
    }
  },

  // Get tools by category
  async getToolsByCategory(category: string, params?: Omit<ToolSearchParams, 'category'>): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Fetching tools by category:', category);
    return this.getTools({ category, ...params });
  }
};