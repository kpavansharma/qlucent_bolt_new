import { apiClient } from '@/lib/api/apiClient';
import { Portfolio, PaginatedResponse } from '@/lib/types/api';

export interface PortfolioSearchParams {
  query?: string;
  expertise?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const portfolioService = {
  // Get all portfolios with optional filters (use backend search)
  async getPortfolios(params?: PortfolioSearchParams): Promise<PaginatedResponse<Portfolio>> {
    console.log('🔍 Fetching portfolios with backend search:', params);
    
    try {
      // Use backend search with proper parameters
      const response = await apiClient.get<PaginatedResponse<Portfolio>>('/api/portfolios', params);
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch portfolios from backend:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      // Add missing fields with default values to match the Portfolio type
      const portfoliosWithDefaults = response.data.items.map((portfolio: any) => ({
        ...portfolio,
        category: portfolio.category || 'General',
        tools: portfolio.tools || [],
        useCase: portfolio.useCase || 'General purpose',
        difficulty: portfolio.difficulty || 'Intermediate',
        estimatedTime: portfolio.estimatedTime || '2-4 hours',
        popularity: portfolio.popularity || 0,
        lastUpdated: portfolio.lastUpdated || portfolio.created_at || new Date().toISOString(),
        aiCurated: portfolio.aiCurated || false,
        deployments: portfolio.deployments || 0,
        rating: portfolio.rating || 4.0,
        tags: portfolio.tags || [],
        author: portfolio.author || 'Community',
        featured: portfolio.featured || false
      }));
      
      console.log(`✅ Backend search completed: ${portfoliosWithDefaults.length} items, page ${response.data.page}`);
      
      return {
        ...response.data,
        items: portfoliosWithDefaults
      };
    } catch (error) {
      console.error('❌ Error in backend portfolio search:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  // Get a specific portfolio by ID
  async getPortfolioById(id: string | number): Promise<Portfolio | null> {
    const response = await apiClient.get<Portfolio>(`/api/portfolios/${id}`);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Get featured portfolios
  async getFeaturedPortfolios(): Promise<Portfolio[]> {
    const response = await apiClient.get<Portfolio[]>('/api/portfolios/featured');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Search portfolios
  async searchPortfolios(query: string, filters?: Omit<PortfolioSearchParams, 'query'>): Promise<PaginatedResponse<Portfolio>> {
    const params = { query, ...filters };
    return this.getPortfolios(params);
  },

  // Get portfolios by expertise
  async getPortfoliosByExpertise(expertise: string): Promise<Portfolio[]> {
    const response = await apiClient.get<Portfolio[]>(`/api/portfolios/expertise/${expertise}`);
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Create a new portfolio
  async createPortfolio(portfolioData: Partial<Portfolio>): Promise<Portfolio | null> {
    const response = await apiClient.post<Portfolio>('/api/portfolios', portfolioData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Update a portfolio
  async updatePortfolio(id: string | number, portfolioData: Partial<Portfolio>): Promise<Portfolio | null> {
    const response = await apiClient.put<Portfolio>(`/api/portfolios/${id}`, portfolioData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  }
};