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
  // Get all tools with proper backend field mapping
  async getTools(params?: ToolSearchParams): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Fetching tools with backend search:', params);
    
    try {
      // Clean and prepare parameters for backend based on actual DB fields
      const cleanParams: Record<string, any> = {};
      
      if (params) {
        // Search query - maps to name and description fields
        if (params.query && params.query.trim()) {
          cleanParams.search = params.query.trim();
          cleanParams.q = params.query.trim();
          cleanParams.query = params.query.trim();
        }
        
        // Category filter - maps to category field in DB
        if (params.category && params.category !== 'All') {
          cleanParams.category = params.category;
        }
        
        // Other filters (if supported by backend)
        if (params.license && params.license !== 'All') {
          cleanParams.license = params.license;
        }
        
        if (params.minStars && params.minStars > 0) {
          cleanParams.min_stars = params.minStars;
        }
        
        if (params.verified !== undefined) {
          cleanParams.verified = params.verified;
        }
        
        if (params.deploymentReady !== undefined) {
          cleanParams.deployment_ready = params.deploymentReady;
        }
        
        if (params.sortBy && params.sortBy !== 'relevance') {
          cleanParams.sort_by = params.sortBy;
        }
        
        // Pagination
        if (params.page) {
          cleanParams.page = params.page;
        }
        
        if (params.limit) {
          cleanParams.limit = params.limit;
        }
      }
      
      console.log('🎯 Backend request parameters:', cleanParams);
      
      // Make API request to backend
      const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', cleanParams);
      
      if (!response.success || !response.data) {
        console.error('❌ Backend request failed:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      console.log('✅ Backend response received:', {
        itemsCount: response.data.items?.length || 0,
        total: response.data.total,
        page: response.data.page
      });
      
      // Map backend response to frontend Tool interface
      const toolsWithDefaults = (response.data.items || []).map((tool: any) => ({
        id: tool.id,
        name: tool.name || 'Unknown Tool',
        description: tool.description || 'No description available',
        category: tool.category || 'Other',
        stars: tool.stars || tool.github_stars || 0,
        downloads: tool.downloads || tool.npm_downloads || '0',
        license: tool.license || 'Unknown',
        lastUpdated: tool.lastUpdated || tool.last_updated || tool.updated_at || new Date().toISOString(),
        tags: tool.tags || [],
        verified: tool.verified || false,
        aiScore: tool.aiScore || tool.ai_score || Math.floor(Math.random() * 40) + 60,
        compatibility: tool.compatibility || [],
        deploymentReady: tool.deploymentReady || tool.deployment_ready || false,
        website: tool.website || tool.homepage,
        github: tool.github || tool.github_url,
        documentation: tool.documentation || tool.docs_url,
        maintainers: tool.maintainers || [],
        languages: tool.languages || tool.programming_languages || [],
        fileSize: tool.fileSize || tool.file_size,
        versions: tool.versions || [],
        requirements: tool.requirements || {
          memory: '512MB',
          storage: '1GB',
          os: 'Linux, macOS, Windows'
        },
        features: tool.features || [],
        useCases: tool.useCases || tool.use_cases || [],
        similarTools: tool.similarTools || tool.similar_tools || [],
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
        items: toolsWithDefaults,
        total: response.data.total || toolsWithDefaults.length,
        page: response.data.page || 1,
        limit: response.data.limit || params?.limit || 10,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || toolsWithDefaults.length) / (params?.limit || 10))
      };
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

  // Enhanced search with proper field mapping
  async searchTools(query: string, filters?: Omit<ToolSearchParams, 'query'>): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Searching tools with query:', query, 'filters:', filters);
    
    const searchParams: ToolSearchParams = {
      query: query.trim(),
      ...filters
    };
    
    // Auto-detect category from query if not explicitly set
    if (query && !filters?.category) {
      const queryLower = query.toLowerCase();
      
      const categoryMappings: Record<string, string> = {
        'devops': 'DevOps',
        'dev ops': 'DevOps',
        'kubernetes': 'DevOps',
        'docker': 'DevOps',
        'ci/cd': 'DevOps',
        'cicd': 'DevOps',
        'jenkins': 'DevOps',
        'terraform': 'DevOps',
        'ansible': 'DevOps',
        'monitoring': 'Monitoring',
        'prometheus': 'Monitoring',
        'grafana': 'Monitoring',
        'ai': 'AI/ML',
        'ml': 'AI/ML',
        'machine learning': 'AI/ML',
        'artificial intelligence': 'AI/ML',
        'tensorflow': 'AI/ML',
        'pytorch': 'AI/ML',
        'frontend': 'Frontend',
        'react': 'Frontend',
        'vue': 'Frontend',
        'angular': 'Frontend',
        'javascript': 'Frontend',
        'backend': 'Backend',
        'node': 'Backend',
        'python': 'Backend',
        'java': 'Backend',
        'database': 'Database',
        'postgres': 'Database',
        'mysql': 'Database',
        'mongodb': 'Database',
        'security': 'Security',
        'auth': 'Security',
        'encryption': 'Security'
      };
      
      for (const [keyword, category] of Object.entries(categoryMappings)) {
        if (queryLower.includes(keyword)) {
          searchParams.category = category;
          console.log(`🎯 Auto-detected category "${category}" from query "${query}"`);
          break;
        }
      }
    }
    
    return this.getTools(searchParams);
  },

  // Get tool by ID
  async getToolById(id: string | number): Promise<Tool | null> {
    console.log('🔍 Fetching tool by ID:', id);
    
    try {
      const response = await apiClient.get<Tool>(`/api/tools/${id}`);
      
      if (response.success && response.data) {
        console.log('✅ Found tool:', response.data.name);
        return response.data;
      }
      
      // Fallback: search in all tools
      const allToolsResponse = await this.getTools({ limit: 1000 });
      const tool = allToolsResponse.items.find(t => t.id.toString() === id.toString());
      
      if (tool) {
        console.log('✅ Found tool via fallback:', tool.name);
        return tool;
      }
      
      console.error('❌ Tool not found with ID:', id);
      return null;
    } catch (error) {
      console.error('❌ Error fetching tool by ID:', id, error);
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
  },

  // Get available categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/api/tools/categories');
      
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
    
    // Fallback categories
    return ['DevOps', 'AI/ML', 'Frontend', 'Backend', 'Database', 'Security', 'Monitoring'];
  }
};