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
  // Get all vendors with optional filters (use backend search)
  async getVendors(params?: VendorSearchParams): Promise<PaginatedResponse<Vendor>> {
    console.log('🔍 Fetching vendors with backend search:', params);
    
    try {
      // Use backend search with proper parameters
      const response = await apiClient.get<PaginatedResponse<Vendor>>('/api/vendors', params);
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch vendors from backend:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      // Add missing fields with default values to match the Vendor type
      const vendorsWithDefaults = response.data.items.map((vendor: any) => ({
        ...vendor,
        logo: vendor.logo || '',
        rating: vendor.rating || 4.0,
        reviews: vendor.reviews || 0,
        location: vendor.location || 'Remote',
        teamSize: vendor.teamSize || '5-15',
        founded: vendor.founded || 2020,
        specialties: vendor.specialties || [],
        services: vendor.services || [],
        pricing: vendor.pricing || 'Contact for pricing',
        responseTime: vendor.responseTime || '24 hours',
        successRate: vendor.successRate || 95,
        verified: vendor.verified || false,
        featured: vendor.featured || false,
        certifications: vendor.certifications || [],
        projects: vendor.projects || 0,
        clients: vendor.clients || []
      }));
      
      console.log(`✅ Backend search completed: ${vendorsWithDefaults.length} items, page ${response.data.page}`);
      
      return {
        ...response.data,
        items: vendorsWithDefaults
      };
    } catch (error) {
      console.error('❌ Error in backend vendor search:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  // Get a specific vendor by ID
  async getVendorById(id: string | number): Promise<Vendor | null> {
    console.log('🔍 Fetching vendor by ID:', id, 'Type:', typeof id);
    
    try {
      // First try to use a proper backend endpoint for individual vendor
      console.log('🔍 Trying backend endpoint first...');
      const response = await apiClient.get<Vendor>(`/api/vendors/${id}`);
      
      if (response.success && response.data) {
        console.log('✅ Successfully found vendor via backend endpoint:', response.data.name);
        return response.data;
      }
      
      console.log('⚠️ Backend endpoint failed, trying fallback...');
      
      // Fallback: fetch all vendors and filter (since individual endpoint might not exist)
      console.log('⚠️ Individual vendor endpoint not available, fetching all vendors...');
      const allVendorsResponse = await apiClient.get<PaginatedResponse<Vendor>>('/api/vendors', { limit: 1000 });
      
      if (!allVendorsResponse.success || !allVendorsResponse.data) {
        console.error('❌ Failed to fetch vendors:', allVendorsResponse.error);
        return null;
      }
      
      console.log(`📊 Fetched ${allVendorsResponse.data.items.length} vendors, searching for ID: ${id}`);
      
      // Find the vendor by ID
      const vendor = allVendorsResponse.data.items.find(v => {
        console.log(`🔍 Comparing vendor ID: ${v.id} (${typeof v.id}) with search ID: ${id} (${typeof id})`);
        return v.id.toString() === id.toString();
      });
      
      if (!vendor) {
        console.error('❌ Vendor not found with ID:', id);
        console.log('📋 Available vendor IDs:', allVendorsResponse.data.items.map(v => v.id));
        return null;
      }
      
      // Add missing fields with default values
      const vendorWithDefaults = {
        ...vendor,
        logo: vendor.logo || '',
        rating: vendor.rating || 4.0,
        reviews: vendor.reviews || 0,
        location: vendor.location || 'Remote',
        teamSize: vendor.teamSize || '5-15',
        founded: vendor.founded || 2020,
        specialties: vendor.specialties || [],
        services: vendor.services || [],
        pricing: vendor.pricing || 'Contact for pricing',
        responseTime: vendor.responseTime || '24 hours',
        successRate: vendor.successRate || 95,
        verified: vendor.verified || false,
        featured: vendor.featured || false,
        certifications: vendor.certifications || [],
        projects: vendor.projects || 0,
        clients: vendor.clients || []
      };
      
      console.log('✅ Successfully found vendor via fallback:', vendorWithDefaults.name);
      return vendorWithDefaults;
    } catch (error) {
      console.error('❌ Error fetching vendor by ID:', id, error);
      return null;
    }
  },

  // Get featured vendors (using main endpoint since featured endpoint doesn't exist)
  async getFeaturedVendors(): Promise<Vendor[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Vendor>>('/api/vendors', { limit: 4 });
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch featured vendors:', response.error);
        return [];
      }
      
      // Add missing fields with default values
      const vendorsWithDefaults = response.data.items.map((vendor: any) => ({
        ...vendor,
        logo: vendor.logo || '',
        rating: vendor.rating || 4.0,
        reviews: vendor.reviews || 0,
        location: vendor.location || 'Remote',
        teamSize: vendor.teamSize || '5-15',
        founded: vendor.founded || 2020,
        specialties: vendor.specialties || [],
        services: vendor.services || [],
        pricing: vendor.pricing || 'Contact for pricing',
        responseTime: vendor.responseTime || '24 hours',
        successRate: vendor.successRate || 95,
        verified: vendor.verified || false,
        featured: vendor.featured || false,
        certifications: vendor.certifications || [],
        projects: vendor.projects || 0,
        clients: vendor.clients || []
      }));
      
      console.log('✅ Successfully fetched featured vendors:', vendorsWithDefaults.length);
      return vendorsWithDefaults;
    } catch (error) {
      console.error('❌ Error fetching featured vendors:', error);
      return [];
    }
  },

  // Search vendors with query (use backend search)
  async searchVendors(query: string, filters?: Omit<VendorSearchParams, 'query'>): Promise<PaginatedResponse<Vendor>> {
    console.log('🔍 Performing backend search for vendors:', query, filters);
    
    try {
      // Use backend search with query and filters
      const searchParams = { query, ...filters };
      const response = await apiClient.get<PaginatedResponse<Vendor>>('/api/vendors', searchParams);
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to search vendors from backend:', response.error);
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }
      
      // Add missing fields with default values
      const vendorsWithDefaults = response.data.items.map((vendor: any) => ({
        ...vendor,
        logo: vendor.logo || '',
        rating: vendor.rating || 4.0,
        reviews: vendor.reviews || 0,
        location: vendor.location || 'Remote',
        teamSize: vendor.teamSize || '5-15',
        founded: vendor.founded || 2020,
        specialties: vendor.specialties || [],
        services: vendor.services || [],
        pricing: vendor.pricing || 'Contact for pricing',
        responseTime: vendor.responseTime || '24 hours',
        successRate: vendor.successRate || 95,
        verified: vendor.verified || false,
        featured: vendor.featured || false,
        certifications: vendor.certifications || [],
        projects: vendor.projects || 0,
        clients: vendor.clients || []
      }));
      
      console.log(`✅ Backend vendor search completed: ${vendorsWithDefaults.length} items for query "${query}"`);
      
      return {
        ...response.data,
        items: vendorsWithDefaults
      };
    } catch (error) {
      console.error('❌ Error in backend vendor search:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
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