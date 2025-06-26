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
  // Get all portfolios with optional filters
  async getPortfolios(params?: PortfolioSearchParams): Promise<PaginatedResponse<Portfolio>> {
    const response = await apiClient.get<PaginatedResponse<Portfolio>>('/api/portfolios', params);
    
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