import { apiClient } from '@/lib/api/apiClient';
import { Vendor, PaginatedResponse } from '@/lib/types/api';

export interface VendorSearchParams {
  query?: string;
  specialty?: string;
  service?: string;
  teamSize?: string;
  verified?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const vendorService = {
  // Get all vendors with optional filters
  async getVendors(params?: VendorSearchParams): Promise<PaginatedResponse<Vendor>> {
    const response = await apiClient.get<PaginatedResponse<Vendor>>('/api/vendors', params);
    
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

  // Get a specific vendor by ID
  async getVendorById(id: string | number): Promise<Vendor | null> {
    const response = await apiClient.get<Vendor>(`/api/vendors/${id}`);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Get featured vendors
  async getFeaturedVendors(): Promise<Vendor[]> {
    const response = await apiClient.get<Vendor[]>('/api/vendors/featured');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Search vendors
  async searchVendors(query: string, filters?: Omit<VendorSearchParams, 'query'>): Promise<PaginatedResponse<Vendor>> {
    const params = { query, ...filters };
    return this.getVendors(params);
  },

  // Get vendors by specialty
  async getVendorsBySpecialty(specialty: string): Promise<Vendor[]> {
    const response = await apiClient.get<Vendor[]>(`/api/vendors/specialty/${specialty}`);
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Contact a vendor
  async contactVendor(vendorId: string | number, message: string, contactInfo: any): Promise<boolean> {
    const response = await apiClient.post(`/api/vendors/${vendorId}/contact`, {
      message,
      contactInfo
    });
    
    return response.success;
  }
};