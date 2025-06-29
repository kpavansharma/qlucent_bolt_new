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
  // Get all tools with optional filters (enhanced backend search)
  async getTools(params?: ToolSearchParams): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Fetching tools with enhanced backend search:', params);
    
    try {
      // Clean and prepare parameters for backend
      const cleanParams: Record<string, any> = {};
      
      if (params) {
        // Add search query
        if (params.query && params.query.trim()) {
          cleanParams.q = params.query.trim();
          cleanParams.search = params.query.trim(); // Fallback parameter name
        }
        
        // Add category filter - this is crucial for DevOps filtering
        if (params.category && params.category !== 'All') {
          cleanParams.category = params.category;
          cleanParams.categories = params.category; // Fallback parameter name
        }
        
        // Add other filters
        if (params.license && params.license !== 'All') {
          cleanParams.license = params.license;
        }
        
        if (params.minStars && params.minStars > 0) {
          cleanParams.min_stars = params.minStars;
          cleanParams.minStars = params.minStars; // Fallback parameter name
        }
        
        if (params.verified !== undefined) {
          cleanParams.verified = params.verified;
        }
        
        if (params.deploymentReady !== undefined) {
          cleanParams.deployment_ready = params.deploymentReady;
          cleanParams.deploymentReady = params.deploymentReady; // Fallback parameter name
        }
        
        if (params.sortBy && params.sortBy !== 'relevance') {
          cleanParams.sort_by = params.sortBy;
          cleanParams.sortBy = params.sortBy; // Fallback parameter name
        }
        
        // Pagination
        if (params.page) {
          cleanParams.page = params.page;
        }
        
        if (params.limit) {
          cleanParams.limit = params.limit;
          cleanParams.per_page = params.limit; // Fallback parameter name
        }
      }
      
      console.log('🎯 Cleaned parameters for backend:', cleanParams);
      
      // Use backend search with proper parameters
      const response = await apiClient.get<PaginatedResponse<Tool>>('/api/tools', cleanParams);
      
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
      
      // Ensure all tools have required fields with defaults
      const toolsWithDefaults = response.data.items.map((tool: any) => ({
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
        aiScore: tool.aiScore || tool.ai_score || Math.floor(Math.random() * 40) + 60, // Random score between 60-100
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
      
      console.log(`✅ Backend search completed: ${toolsWithDefaults.length} items, page ${response.data.page || 1}`);
      
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

  // Enhanced search tools with better category filtering
  async searchTools(query: string, filters?: Omit<ToolSearchParams, 'query'>): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Performing enhanced backend search for:', query, 'with filters:', filters);
    
    // Combine query and filters for comprehensive search
    const searchParams: ToolSearchParams = {
      query: query.trim(),
      ...filters
    };
    
    // Special handling for category-based searches
    if (query && !filters?.category) {
      const queryLower = query.toLowerCase();
      
      // Auto-detect category from query
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
      
      // Check if query matches any category keywords
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

  // Get a specific tool by ID with enhanced error handling
  async getToolById(id: string | number): Promise<Tool | null> {
    console.log('🔍 Fetching tool by ID:', id);
    
    try {
      // First try to use a proper backend endpoint for individual tool
      const response = await apiClient.get<Tool>(`/api/tools/${id}`);
      
      if (response.success && response.data) {
        console.log('✅ Successfully found tool via backend endpoint:', response.data.name);
        
        // Ensure the tool has all required fields
        const toolWithDefaults = {
          ...response.data,
          category: response.data.category || 'Other',
          stars: response.data.stars || 0,
          downloads: response.data.downloads || '0',
          license: response.data.license || 'Unknown',
          lastUpdated: response.data.lastUpdated || new Date().toISOString(),
          tags: response.data.tags || [],
          verified: response.data.verified || false,
          aiScore: response.data.aiScore || Math.floor(Math.random() * 40) + 60,
          compatibility: response.data.compatibility || [],
          deploymentReady: response.data.deploymentReady || false
        };
        
        return toolWithDefaults;
      }
      
      // Fallback: fetch all tools and filter (since individual endpoint might not exist)
      console.log('⚠️ Individual tool endpoint not available, fetching all tools...');
      const allToolsResponse = await this.getTools({ limit: 1000 });
      
      if (!allToolsResponse.items.length) {
        console.error('❌ Failed to fetch tools for fallback');
        return null;
      }
      
      // Find the tool by ID
      const tool = allToolsResponse.items.find(t => t.id.toString() === id.toString());
      
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

  // Get featured tools
  async getFeaturedTools(): Promise<Tool[]> {
    try {
      const response = await apiClient.get<Tool[]>('/api/tools/featured');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback: get top-rated tools
      const topTools = await this.getTools({ sortBy: 'stars', limit: 6 });
      return topTools.items;
    } catch (error) {
      console.error('❌ Error fetching featured tools:', error);
      return [];
    }
  },

  // Get tools by category with enhanced filtering
  async getToolsByCategory(category: string, params?: Omit<ToolSearchParams, 'category'>): Promise<PaginatedResponse<Tool>> {
    console.log('🔍 Fetching tools by category:', category);
    return this.getTools({ category, ...params });
  },

  // Get tool categories
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
  },

  // Get similar tools
  async getSimilarTools(toolId: string | number): Promise<Tool[]> {
    try {
      const response = await apiClient.get<Tool[]>(`/api/tools/${toolId}/similar`);
      
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error fetching similar tools:', error);
    }
    
    return [];
  }
};