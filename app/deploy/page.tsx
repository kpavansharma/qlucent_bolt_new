'use client';

import { useState, useEffect } from 'react';
import { Zap, Cloud, Server, Settings, CheckCircle, ArrowRight, Play, Code, Database, Monitor, Loader2, ExternalLink, Trash2, AlertCircle, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Navigation } from '@/components/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { deploymentService, DeploymentRequest, DeploymentResponse, DeploymentStatus, DeploymentTemplate, DeploymentRegion, InstanceType, UserDeployment } from '@/lib/services/deploymentService';

// Deployment templates that match the standalone service
const deploymentTemplates = [
  {
    id: 'redis',
    name: 'Redis',
    description: 'In-memory data structure store',
    category: 'Cache',
    estimatedTime: '3 minutes',
    complexity: 'Easy',
    cost: '$5-10/month',
    image: 'redis:7-alpine'
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Advanced open source relational database',
    category: 'Database',
    estimatedTime: '5 minutes',
    complexity: 'Easy',
    cost: '$10-20/month',
    image: 'postgres:15'
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    description: 'Monitoring system and time series database',
    category: 'Monitoring',
    estimatedTime: '10 minutes',
    complexity: 'Intermediate',
    cost: '$15-25/month',
    image: 'prom/prometheus:latest'
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Analytics and interactive visualization platform',
    category: 'Visualization',
    estimatedTime: '8 minutes',
    complexity: 'Easy',
    cost: '$10-15/month',
    image: 'grafana/grafana:latest'
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    description: 'Automation server for CI/CD pipelines',
    category: 'CI/CD',
    estimatedTime: '15 minutes',
    complexity: 'Intermediate',
    cost: '$20-30/month',
    image: 'jenkins/jenkins:lts'
  }
];

// Default regions
const defaultRegions = [
  { id: 'us-central1', name: 'Iowa (us-central1)', cost: 'Standard' },
  { id: 'us-east1', name: 'South Carolina (us-east1)', cost: 'Standard' },
  { id: 'us-west1', name: 'Oregon (us-west1)', cost: 'Standard' },
  { id: 'europe-west1', name: 'Belgium (europe-west1)', cost: 'Standard' },
  { id: 'asia-northeast1', name: 'Tokyo (asia-northeast1)', cost: 'Standard' }
];

// Default instance types
const defaultInstanceTypes = [
  { id: 'small', name: 'Small (512MB RAM, 0.5 vCPU)', cost: '$5-10/month' },
  { id: 'medium', name: 'Medium (1GB RAM, 1 vCPU)', cost: '$10-20/month' },
  { id: 'large', name: 'Large (2GB RAM, 2 vCPU)', cost: '$20-40/month' }
];

export default function DeployPage() {
  const [activeTab, setActiveTab] = useState('quick');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [deploymentConfig, setDeploymentConfig] = useState({
    tool_id: '',
    template: 'redis',
    environment: 'production',
    region: 'us-central1',
    instance_type: 'small',
    custom_config: {},
    gcp_project_id: '',  // User's GCP project
    gcp_credentials: '',  // User's service account key
    use_own_gcp: false   // Toggle for using own GCP
  });
  
  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Deployment state
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentDeployment, setCurrentDeployment] = useState<DeploymentResponse | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [userDeployments, setUserDeployments] = useState<UserDeployment[]>([]);
  const [isLoadingDeployments, setIsLoadingDeployments] = useState(false);
  
  // Service health
  const [serviceHealth, setServiceHealth] = useState<{ status: string; service: string; version: string } | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
    checkServiceHealth();
  }, []);

  // Load deployments when deployments tab is selected and user is authenticated
  useEffect(() => {
    if (activeTab === 'deployments' && user && !isLoadingDeployments) {
      loadUserDeployments();
    }
  }, [activeTab, user]);

  // Check if user is authenticated using Supabase
  const checkAuthentication = async () => {
    setIsCheckingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Check deployment service health
  const checkServiceHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const health = await deploymentService.checkHealth();
      setServiceHealth(health);
    } catch (error) {
      console.error('Deployment service health check failed:', error);
      setServiceHealth(null);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // Load user deployments
  const loadUserDeployments = async () => {
    if (!user) return;
    
    setIsLoadingDeployments(true);
    try {
      const result = await deploymentService.listDeployments(user.id);
      setUserDeployments(result.deployments);
    } catch (error) {
      console.error('Failed to load deployments:', error);
    } finally {
      setIsLoadingDeployments(false);
    }
  };

  // Start deployment
  const startDeployment = async () => {
    if (!user) {
      alert('Please register or login to deploy tools.');
      return;
    }

    if (!deploymentConfig.tool_id.trim()) {
      alert('Please enter a tool ID');
      return;
    }

    // Validate GCP configuration if user wants to use their own project
    if (deploymentConfig.use_own_gcp) {
      if (!deploymentConfig.gcp_project_id.trim()) {
        alert('Please enter your GCP Project ID');
        return;
      }
      if (!deploymentConfig.gcp_credentials.trim()) {
        alert('Please provide your service account key');
        return;
      }
    }

    setIsDeploying(true);
    try {
      const deploymentRequest: DeploymentRequest = {
        tool_id: deploymentConfig.tool_id,
        template: deploymentConfig.template,
        environment: deploymentConfig.environment,
        region: deploymentConfig.region,
        instance_type: deploymentConfig.instance_type,
        custom_config: deploymentConfig.custom_config,
        user_id: user.id,
        gcp_project_id: deploymentConfig.use_own_gcp ? deploymentConfig.gcp_project_id : undefined,
        gcp_credentials: deploymentConfig.use_own_gcp ? deploymentConfig.gcp_credentials : undefined
      };

      const response = await deploymentService.deployTool(deploymentRequest);
      setCurrentDeployment(response);
      
      // Start polling for status
      pollDeploymentStatus(response.deployment_id);
      
      // Refresh deployments list after successful deployment
      setTimeout(() => {
        loadUserDeployments();
      }, 2000);
      
    } catch (error) {
      console.error('Deployment failed:', error);
      alert('Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  // Poll deployment status
  const pollDeploymentStatus = async (deploymentId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        alert('Deployment status polling timed out. Check manually.');
        return;
      }

      try {
        const status = await deploymentService.getDeploymentStatus(deploymentId);
        setDeploymentStatus(status);
        
        if (status.ready || status.status === 'failed' || status.error) {
          if (status.ready) {
            alert(`Your deployment is ready at ${status.service_url}`);
          } else if (status.error) {
            alert(`Deployment failed: ${status.error}`);
          }
          return;
        }
        
        attempts++;
        setTimeout(poll, 5000); // Poll every 5 seconds
      } catch (error) {
        console.error('Status polling failed:', error);
        attempts++;
        setTimeout(poll, 5000);
      }
    };
    
    poll();
  };

  // Delete deployment
  const deleteDeployment = async (deploymentId: string) => {
    try {
      await deploymentService.deleteDeployment(deploymentId);
      alert('Deployment deleted successfully');
      loadUserDeployments(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete deployment:', error);
      alert('Failed to delete deployment');
    }
  };

  // Quick deploy a template
  const quickDeploy = (templateId: string) => {
    if (!user) {
      alert('Please register or login to deploy tools.');
      return;
    }
    
    setSelectedTemplate(templateId);
    setDeploymentConfig(prev => ({
      ...prev,
      template: templateId,
      tool_id: `${templateId}-${Date.now()}`
    }));
    setActiveTab('wizard');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Monitoring': return <Monitor className="w-4 h-4" />;
      case 'Database': return <Database className="w-4 h-4" />;
      case 'CI/CD': return <Code className="w-4 h-4" />;
      case 'Cache': return <Server className="w-4 h-4" />;
      case 'Visualization': return <Monitor className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'deploying': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'deleted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Authentication required component
  const AuthenticationRequired = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Authentication Required</CardTitle>
          <CardDescription>
            You need to register or login to access the deployment features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth">
              <User className="w-4 h-4 mr-2" />
              Register / Login
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Loading component
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show authentication required if not authenticated
  if (!user) {
    return <AuthenticationRequired />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="deploy" />

      {/* Service Health Status */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Deployment Service:</span>
              {isCheckingHealth ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : serviceHealth ? (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Unavailable</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkServiceHealth}
              disabled={isCheckingHealth}
            >
              {isCheckingHealth ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            One-Click Deployment Wizard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Deploy your tools and infrastructure with pre-configured templates. 
            From development to production, get up and running in minutes.
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Pre-configured templates
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              GCP Cloud Run powered
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Cost-effective
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Quick Deploy</TabsTrigger>
            <TabsTrigger value="wizard">Deployment Wizard</TabsTrigger>
            <TabsTrigger value="deployments">My Deployments</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Deploy Tools
                </CardTitle>
                <CardDescription>
                  Deploy popular tools with one click using pre-configured templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deploymentTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(template.category)}
                            <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                              {template.name}
                            </CardTitle>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Pre-configured
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge className={getDifficultyColor(template.complexity)}>
                            {template.complexity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                        
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Cost:</span>
                          <div className="text-green-600 font-medium">{template.cost}</div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Est. Time: {template.estimatedTime}</span>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => quickDeploy(template.id)}
                          disabled={!serviceHealth}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Quick Deploy
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wizard" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Deployment Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your deployment settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="toolId">Tool ID</Label>
                      <Input 
                        id="toolId" 
                        placeholder="Enter unique tool ID (e.g., my-redis-cache)"
                        value={deploymentConfig.tool_id}
                        onChange={(e) => setDeploymentConfig(prev => ({ ...prev, tool_id: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select value={deploymentConfig.template} onValueChange={(value) => 
                        setDeploymentConfig(prev => ({ ...prev, template: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {deploymentTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name} - {template.cost}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="environment">Environment</Label>
                        <Select value={deploymentConfig.environment} onValueChange={(value) => 
                          setDeploymentConfig(prev => ({ ...prev, environment: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="staging">Staging</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="region">Region</Label>
                        <Select value={deploymentConfig.region} onValueChange={(value) => 
                          setDeploymentConfig(prev => ({ ...prev, region: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {defaultRegions.map((region) => (
                              <SelectItem key={region.id} value={region.id}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="instanceType">Instance Type</Label>
                        <Select value={deploymentConfig.instance_type} onValueChange={(value) => 
                          setDeploymentConfig(prev => ({ ...prev, instance_type: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {defaultInstanceTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name} - {type.cost}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* GCP Configuration Section */}
                    <div className="border-t pt-6 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="checkbox"
                          id="useOwnGcp"
                          checked={deploymentConfig.use_own_gcp}
                          onChange={(e) => setDeploymentConfig(prev => ({ 
                            ...prev, 
                            use_own_gcp: e.target.checked 
                          }))}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="useOwnGcp" className="font-medium">
                          Deploy to my own GCP project
                        </Label>
                      </div>
                      
                      {deploymentConfig.use_own_gcp && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                          <div>
                            <Label htmlFor="gcpProjectId">GCP Project ID</Label>
                            <Input 
                              id="gcpProjectId" 
                              placeholder="your-gcp-project-id"
                              value={deploymentConfig.gcp_project_id}
                              onChange={(e) => setDeploymentConfig(prev => ({ 
                                ...prev, 
                                gcp_project_id: e.target.value 
                              }))}
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Your Google Cloud project ID where resources will be deployed
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor="gcpCredentials">Service Account Key (JSON)</Label>
                            <Textarea 
                              id="gcpCredentials" 
                              placeholder="Paste your service account JSON key here..."
                              value={deploymentConfig.gcp_credentials}
                              onChange={(e) => setDeploymentConfig(prev => ({ 
                                ...prev, 
                                gcp_credentials: e.target.value 
                              }))}
                              rows={4}
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Your service account key with Cloud Run and Storage permissions
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <h4 className="font-medium text-blue-900 mb-2">Required Permissions</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Cloud Run Admin (roles/run.admin)</li>
                              <li>• Storage Admin (roles/storage.admin)</li>
                              <li>• Service Account User (roles/iam.serviceAccountUser)</li>
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {!deploymentConfig.use_own_gcp && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>Default:</strong> Deployments will use Qlucent's GCP infrastructure 
                            (managed by us, no additional setup required)
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Deployment Status */}
                {currentDeployment && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Current Deployment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Deployment ID:</span>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {currentDeployment.deployment_id}
                          </code>
                        </div>
                        
                        {deploymentStatus && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Status:</span>
                              <Badge className={getStatusColor(deploymentStatus.status)}>
                                {deploymentStatus.status}
                              </Badge>
                            </div>
                            
                            {deploymentStatus.service_url && (
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Service URL:</span>
                                <a 
                                  href={deploymentStatus.service_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  {deploymentStatus.service_url}
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            )}
                          </>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Cost Estimate:</span>
                          <span className="text-green-600 font-medium">
                            {currentDeployment.cost_estimate.monthly_estimate}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Deployment Summary */}
              <div>
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Deployment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Template:</span>
                      <div className="font-medium">
                        {deploymentTemplates.find(t => t.id === deploymentConfig.template)?.name}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Environment:</span>
                      <div className="font-medium capitalize">{deploymentConfig.environment}</div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">Region:</span>
                      <div className="font-medium">{deploymentConfig.region}</div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">Instance Type:</span>
                      <div className="font-medium">
                        {defaultInstanceTypes.find(t => t.id === deploymentConfig.instance_type)?.name}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600 mb-4">
                        Estimated cost: {deploymentTemplates.find(t => t.id === deploymentConfig.template)?.cost}
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600" 
                        size="lg"
                        onClick={startDeployment}
                        disabled={isDeploying || !serviceHealth || !deploymentConfig.tool_id.trim()}
                      >
                        {isDeploying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deploying...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Deployment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deployments" className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      My Deployments
                    </CardTitle>
                    <CardDescription>
                      Manage your active deployments
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={loadUserDeployments}
                    disabled={isLoadingDeployments}
                    variant="outline"
                    size="sm"
                  >
                    {isLoadingDeployments ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingDeployments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : userDeployments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Server className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No deployments found</p>
                    <p className="text-sm">Start by deploying your first tool</p>
                    <Button 
                      onClick={loadUserDeployments}
                      className="mt-4"
                      variant="outline"
                    >
                      Refresh Deployments
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userDeployments.map((deployment) => (
                      <Card key={deployment.deployment_id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{deployment.tool_id}</h3>
                              <Badge className={getStatusColor(deployment.status)}>
                                {deployment.status}
                              </Badge>
                              <Badge variant="outline">{deployment.template}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Created: {new Date(deployment.created_at).toLocaleDateString()}</div>
                              <div>Cost: {deployment.cost_estimate}</div>
                              {deployment.service_url && (
                                <a 
                                  href={deployment.service_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  {deployment.service_url}
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDeployment(deployment.deployment_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}