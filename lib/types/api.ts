// Common types for API responses
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  stars: number;
  downloads: string;
  license: string;
  lastUpdated: string;
  tags: string[];
  verified: boolean;
  aiScore: number;
  compatibility: string[];
  deploymentReady: boolean;
  website?: string;
  github?: string;
  documentation?: string;
  maintainers?: string[];
  languages?: string[];
  fileSize?: string;
  versions?: string[];
  requirements?: {
    memory: string;
    storage: string;
    os: string;
  };
  features?: string[];
  useCases?: string[];
  similarTools?: Array<{
    name: string;
    similarity: number;
  }>;
  pricing?: {
    personal: string;
    pro: string;
    team: string;
    business: string;
  };
  support?: {
    community: string;
    documentation: string;
    training: string;
    enterprise: string;
  };
}

export interface Bundle {
  id: number;
  name: string;
  description: string;
  category: string;
  tools: string[];
  useCase: string;
  difficulty: string;
  estimatedTime: string;
  popularity: number;
  lastUpdated: string;
  aiCurated: boolean;
  deployments: number;
  rating: number;
  tags: string[];
  author: string;
  featured: boolean;
}

export interface Vendor {
  id: number;
  name: string;
  description: string;
  logo: string;
  rating: number;
  reviews: number;
  location: string;
  teamSize: string;
  founded: number;
  specialties: string[];
  services: string[];
  pricing: string;
  responseTime: string;
  successRate: number;
  verified: boolean;
  featured: boolean;
  certifications: string[];
  projects: number;
  clients: string[];
}

export interface Portfolio {
  id: number;
  name: string;
  username: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  bio: string;
  toolsReviewed: number;
  bundlesCreated: number;
  totalDownloads: number;
  avgRating: number;
  joinedDate: string;
  expertise: string[];
  recentTools: Array<{
    name: string;
    rating: number;
    category: string;
  }>;
  topBundles: Array<{
    name: string;
    downloads: number;
    rating: number;
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface SearchFilters {
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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}