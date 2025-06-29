// Core API client for making requests to the backend
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://qlucent-backend-300721674147.us-west1.run.app';
    console.log('🔧 ApiClient initialized with baseURL:', this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🚀 API Request:', {
      method: options.method || 'GET',
      url,
      headers: options.headers,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      console.log('📡 API Response Status:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error Response:', {
          url,
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('✅ API Success Response:', {
        url,
        dataType: typeof data,
        dataKeys: data && typeof data === 'object' ? Object.keys(data) : 'N/A',
        dataLength: Array.isArray(data) ? data.length : 
                   data && typeof data === 'object' && 'items' in data ? 
                   (Array.isArray(data.items) ? data.items.length : 'items not array') : 'N/A',
        sampleData: data && typeof data === 'object' ? 
                   (Array.isArray(data) ? data.slice(0, 2) : 
                    'items' in data && Array.isArray(data.items) ? data.items.slice(0, 2) : data) : data
      });
      
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('💥 API Request failed:', {
        url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        success: false,
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      console.log('🔍 Adding query parameters:', params);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle array parameters (for multiple categories, tags, etc.)
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    const finalEndpoint = url.pathname + url.search;
    console.log('📋 Final GET endpoint:', finalEndpoint);
    console.log('🎯 Query parameters sent to backend:', Object.fromEntries(url.searchParams.entries()));
    
    return this.request<T>(finalEndpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log('📤 POST data:', data);
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log('📝 PUT data:', data);
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log('🗑️ DELETE endpoint:', endpoint);
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();