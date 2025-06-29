import { apiClient } from '../api/apiClient';

export interface DeploymentRequest {
  tool_id: string;
  template: string;
  environment?: string;
  region?: string;
  instance_type?: string;
  custom_config?: Record<string, any>;
}

export interface DeploymentResponse {
  status: string;
  deployment_id: string;
  service_url: string;
  cost_estimate: {
    monthly_estimate: string;
    breakdown: Record<string, string>;
    currency: string;
  };
  logs: string;
  template: string;
}

export interface DeploymentStatus {
  status: string;
  service_url: string;
  last_updated: string;
  ready: boolean;
  error?: string;
}

export interface DeploymentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedTime: string;
  complexity: string;
  cost: string;
  image: string;
}

export interface DeploymentRegion {
  id: string;
  name: string;
  cost: string;
}

export interface InstanceType {
  id: string;
  name: string;
  cost: string;
}

export interface DeploymentLogs {
  deployment_id: string;
  logs: string;
}

export interface UserDeployment {
  deployment_id: string;
  tool_id: string;
  template: string;
  status: string;
  service_url: string;
  created_at: string;
  cost_estimate: string;
}

export interface DeploymentsList {
  deployments: UserDeployment[];
  total: number;
}

class DeploymentService {
  private baseUrl: string;

  constructor() {
    // Use standalone deployment service URL
    this.baseUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_SERVICE_URL || 'https://qlucent-deployment-service-582855156271.us-west1.run.app';
  }

  /**
   * Check if user is authenticated
   */
  private isAuthenticated(): boolean {
    // Check if user has a valid session/token
    // This is a simple check - you might want to integrate with your auth system
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Make direct fetch request to deployment service
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
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

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Deploy a tool to GCP Cloud Run
   */
  async deployTool(request: DeploymentRequest): Promise<DeploymentResponse> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please register or login to deploy tools.');
    }

    try {
      const response = await this.makeRequest<DeploymentResponse>('/api/deploy', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return response;
    } catch (error) {
      console.error('Deployment failed:', error);
      throw new Error('Failed to deploy tool. Please try again.');
    }
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required.');
    }

    try {
      const response = await this.makeRequest<DeploymentStatus>(`/api/deploy/${deploymentId}/status`);
      return response;
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      throw new Error('Failed to get deployment status.');
    }
  }

  /**
   * Delete deployment to save costs
   */
  async deleteDeployment(deploymentId: string): Promise<{ status: string; message: string }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required.');
    }

    try {
      const response = await this.makeRequest<{ status: string; message: string }>(`/api/deploy/${deploymentId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Failed to delete deployment:', error);
      throw new Error('Failed to delete deployment.');
    }
  }

  /**
   * Get available deployment templates
   */
  async getAvailableTemplates(): Promise<DeploymentTemplate[]> {
    try {
      const response = await this.makeRequest<{ templates: DeploymentTemplate[] }>('/api/templates');
      return response.templates;
    } catch (error) {
      console.error('Failed to get templates:', error);
      // Return default templates if API fails
      return this.getDefaultTemplates();
    }
  }

  /**
   * Get available deployment regions
   */
  async getAvailableRegions(): Promise<DeploymentRegion[]> {
    try {
      const response = await this.makeRequest<{ regions: DeploymentRegion[] }>('/api/regions');
      return response.regions;
    } catch (error) {
      console.error('Failed to get regions:', error);
      // Return default regions if API fails
      return this.getDefaultRegions();
    }
  }

  /**
   * Get available instance types
   */
  async getAvailableInstanceTypes(): Promise<InstanceType[]> {
    try {
      const response = await this.makeRequest<{ instance_types: InstanceType[] }>('/api/instance-types');
      return response.instance_types;
    } catch (error) {
      console.error('Failed to get instance types:', error);
      // Return default instance types if API fails
      return this.getDefaultInstanceTypes();
    }
  }

  /**
   * Get deployment logs
   */
  async getDeploymentLogs(deploymentId: string): Promise<DeploymentLogs> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required.');
    }

    try {
      const response = await this.makeRequest<DeploymentLogs>(`/api/deploy/${deploymentId}/logs`);
      return response;
    } catch (error) {
      console.error('Failed to get deployment logs:', error);
      throw new Error('Failed to get deployment logs.');
    }
  }

  /**
   * List user deployments
   */
  async listDeployments(userId?: string, limit: number = 20): Promise<DeploymentsList> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required.');
    }

    try {
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      params.append('limit', limit.toString());

      const response = await this.makeRequest<DeploymentsList>(`/api/deployments?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to list deployments:', error);
      throw new Error('Failed to list deployments.');
    }
  }

  /**
   * Check deployment service health
   */
  async checkHealth(): Promise<{ status: string; service: string; version: string }> {
    try {
      const response = await this.makeRequest<{ status: string; service: string; version: string }>('/health');
      return response;
    } catch (error) {
      console.error('Deployment service health check failed:', error);
      throw new Error('Deployment service is unavailable.');
    }
  }

  /**
   * Poll deployment status until ready or failed
   */
  async pollDeploymentStatus(
    deploymentId: string,
    onStatusUpdate?: (status: DeploymentStatus) => void,
    maxAttempts: number = 30,
    intervalMs: number = 5000
  ): Promise<DeploymentStatus> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const status = await this.getDeploymentStatus(deploymentId);
        
        if (onStatusUpdate) {
          onStatusUpdate(status);
        }

        if (status.ready || status.status === 'failed' || status.error) {
          return status;
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs));
        attempts++;
      } catch (error) {
        console.error(`Poll attempt ${attempts + 1} failed:`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error('Deployment status polling timed out.');
        }
      }
    }

    throw new Error('Deployment status polling timed out.');
  }

  // Default fallback data
  private getDefaultTemplates(): DeploymentTemplate[] {
    return [
      {
        id: "redis",
        name: "Redis",
        description: "In-memory data structure store",
        category: "Cache",
        estimatedTime: "3 minutes",
        complexity: "Easy",
        cost: "$5-10/month",
        image: "redis:7-alpine"
      },
      {
        id: "postgres",
        name: "PostgreSQL",
        description: "Advanced open source relational database",
        category: "Database",
        estimatedTime: "5 minutes",
        complexity: "Easy",
        cost: "$10-20/month",
        image: "postgres:15"
      },
      {
        id: "prometheus",
        name: "Prometheus",
        description: "Monitoring system and time series database",
        category: "Monitoring",
        estimatedTime: "10 minutes",
        complexity: "Intermediate",
        cost: "$15-25/month",
        image: "prom/prometheus:latest"
      },
      {
        id: "grafana",
        name: "Grafana",
        description: "Analytics and interactive visualization platform",
        category: "Visualization",
        estimatedTime: "8 minutes",
        complexity: "Easy",
        cost: "$10-15/month",
        image: "grafana/grafana:latest"
      },
      {
        id: "jenkins",
        name: "Jenkins",
        description: "Automation server for CI/CD pipelines",
        category: "CI/CD",
        estimatedTime: "15 minutes",
        complexity: "Intermediate",
        cost: "$20-30/month",
        image: "jenkins/jenkins:lts"
      }
    ];
  }

  private getDefaultRegions(): DeploymentRegion[] {
    return [
      { id: "us-central1", name: "Iowa (us-central1)", cost: "Standard" },
      { id: "us-east1", name: "South Carolina (us-east1)", cost: "Standard" },
      { id: "us-west1", name: "Oregon (us-west1)", cost: "Standard" },
      { id: "europe-west1", name: "Belgium (europe-west1)", cost: "Standard" },
      { id: "asia-northeast1", name: "Tokyo (asia-northeast1)", cost: "Standard" }
    ];
  }

  private getDefaultInstanceTypes(): InstanceType[] {
    return [
      { id: "small", name: "Small (512MB RAM, 0.5 vCPU)", cost: "$5-10/month" },
      { id: "medium", name: "Medium (1GB RAM, 1 vCPU)", cost: "$10-20/month" },
      { id: "large", name: "Large (2GB RAM, 2 vCPU)", cost: "$20-40/month" }
    ];
  }
}

export const deploymentService = new DeploymentService(); 