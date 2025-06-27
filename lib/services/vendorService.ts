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
  // Get all vendors with optional filters (client-side filtering since backend filtering is not working)
  async getVendors(params?: VendorSearchParams): Promise<PaginatedResponse<Vendor>> {
    console.log('🔍 Fetching vendors with params:', params);
    
    try {
      // Fetch all vendors since backend filtering doesn't work
      const response = await apiClient.get<PaginatedResponse<Vendor>>('/api/vendors', { limit: 1000 });
      
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch vendors:', response.error);
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
      
      let filteredVendors = vendorsWithDefaults;
      
      // Apply search query filter
      if (params?.query) {
        const searchTerm = params.query.toLowerCase();
        filteredVendors = filteredVendors.filter(vendor => 
          vendor.name.toLowerCase().includes(searchTerm) ||
          vendor.description.toLowerCase().includes(searchTerm) ||
          vendor.specialties.some((specialty: string) => specialty.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply specialty filter
      if (params?.specialty) {
        filteredVendors = filteredVendors.filter(vendor => 
          vendor.specialties.some((specialty: string) => specialty.toLowerCase() === params.specialty!.toLowerCase())
        );
      }
      
      // Apply service filter
      if (params?.service) {
        filteredVendors = filteredVendors.filter(vendor => 
          vendor.services.some((service: string) => service.toLowerCase() === params.service!.toLowerCase())
        );
      }
      
      // Apply team size filter
      if (params?.teamSize) {
        filteredVendors = filteredVendors.filter(vendor => 
          vendor.teamSize.toLowerCase() === params.teamSize!.toLowerCase()
        );
      }
      
      // Apply verified filter
      if (params?.verified) {
        filteredVendors = filteredVendors.filter(vendor => vendor.verified);
      }
      
      // Apply sorting
      if (params?.sortBy) {
        switch (params.sortBy) {
          case 'rating':
            filteredVendors.sort((a, b) => b.rating - a.rating);
            break;
          case 'projects':
            filteredVendors.sort((a, b) => b.projects - a.projects);
            break;
          case 'name':
            filteredVendors.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVendors = filteredVendors.slice(startIndex, endIndex);
      
      console.log(`✅ Client-side vendor filtering completed: ${filteredVendors.length} total, ${paginatedVendors.length} on page ${page}`);
      
      return {
        items: paginatedVendors,
        total: filteredVendors.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(filteredVendors.length / limit)
      };
    } catch (error) {
      console.error('❌ Error in client-side vendor filtering:', error);
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
    const response = await apiClient.get<Vendor>(`/api/vendors/${id}`);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
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