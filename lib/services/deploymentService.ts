import { apiClient } from '@/lib/api/apiClient';

export interface DeploymentConfig {
  toolId?: string | number;
  bundleId?: string | number;
  method: 'docker' | 'kubernetes' | 'cloud' | 'compose';
  environment: 'development' | 'staging' | 'production';
  cloudProvider?: 'aws' | 'gcp' | 'azure';
  region?: string;
  instanceType?: string;
  customConfig?: string;
}

export interface DeploymentStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  deploymentUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export const deploymentService = {
  // Deploy a tool
  async deployTool(config: DeploymentConfig): Promise<DeploymentStatus | null> {
    const response = await apiClient.post<DeploymentStatus>('/api/deployments/tool', config);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Deploy a bundle
  async deployBundle(config: DeploymentConfig): Promise<DeploymentStatus | null> {
    const response = await apiClient.post<DeploymentStatus>('/api/deployments/bundle', config);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Get deployment status
  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus | null> {
    const response = await apiClient.get<DeploymentStatus>(`/api/deployments/${deploymentId}`);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  },

  // Get user deployments
  async getUserDeployments(): Promise<DeploymentStatus[]> {
    const response = await apiClient.get<DeploymentStatus[]>('/api/deployments/user');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  // Cancel deployment
  async cancelDeployment(deploymentId: string): Promise<boolean> {
    const response = await apiClient.delete(`/api/deployments/${deploymentId}`);
    return response.success;
  },

  // Get deployment logs
  async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    const response = await apiClient.get<{ logs: string[] }>(`/api/deployments/${deploymentId}/logs`);
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data.logs;
  }
};