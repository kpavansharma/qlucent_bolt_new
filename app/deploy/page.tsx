'use client';

import { useState } from 'react';
import { Zap, Cloud, Server, Settings, CheckCircle, ArrowRight, Play, Code, Database, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

const deploymentOptions = [
  {
    id: 'docker',
    name: 'Docker Container',
    description: 'Deploy as a containerized application',
    icon: <Server className="w-6 h-6" />,
    difficulty: 'Easy',
    time: '5-10 minutes',
    requirements: ['Docker Engine'],
    features: ['Portable', 'Isolated', 'Scalable']
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Cluster',
    description: 'Deploy to Kubernetes for production scale',
    icon: <Cloud className="w-6 h-6" />,
    difficulty: 'Advanced',
    time: '15-30 minutes',
    requirements: ['Kubernetes Cluster', 'kubectl'],
    features: ['Auto-scaling', 'High Availability', 'Rolling Updates']
  },
  {
    id: 'cloud',
    name: 'Cloud Provider',
    description: 'Deploy directly to AWS, GCP, or Azure',
    icon: <Zap className="w-6 h-6" />,
    difficulty: 'Intermediate',
    time: '10-20 minutes',
    requirements: ['Cloud Account', 'CLI Tools'],
    features: ['Managed', 'Scalable', 'Integrated']
  },
  {
    id: 'compose',
    name: 'Docker Compose',
    description: 'Multi-service deployment with Docker Compose',
    icon: <Settings className="w-6 h-6" />,
    difficulty: 'Easy',
    time: '5-15 minutes',
    requirements: ['Docker Compose'],
    features: ['Multi-service', 'Configuration', 'Development']
  }
];

const quickDeployTools = [
  {
    id: 1,
    name: 'Prometheus',
    category: 'Monitoring',
    description: 'Monitoring system and time series database',
    deploymentMethods: ['Docker', 'Kubernetes', 'Docker Compose'],
    estimatedTime: '10 minutes',
    complexity: 'Easy',
    preconfigured: true
  },
  {
    id: 2,
    name: 'Grafana',
    category: 'Visualization',
    description: 'Analytics and interactive visualization platform',
    deploymentMethods: ['Docker', 'Kubernetes', 'Cloud'],
    estimatedTime: '8 minutes',
    complexity: 'Easy',
    preconfigured: true
  },
  {
    id: 3,
    name: 'PostgreSQL',
    category: 'Database',
    description: 'Advanced open source relational database',
    deploymentMethods: ['Docker', 'Kubernetes', 'Cloud'],
    estimatedTime: '5 minutes',
    complexity: 'Easy',
    preconfigured: true
  },
  {
    id: 4,
    name: 'Redis',
    category: 'Cache',
    description: 'In-memory data structure store',
    deploymentMethods: ['Docker', 'Kubernetes', 'Cloud'],
    estimatedTime: '3 minutes',
    complexity: 'Easy',
    preconfigured: true
  },
  {
    id: 5,
    name: 'Jenkins',
    category: 'CI/CD',
    description: 'Automation server for CI/CD pipelines',
    deploymentMethods: ['Docker', 'Kubernetes'],
    estimatedTime: '15 minutes',
    complexity: 'Intermediate',
    preconfigured: true
  },
  {
    id: 6,
    name: 'Jaeger',
    category: 'Tracing',
    description: 'Distributed tracing platform',
    deploymentMethods: ['Docker', 'Kubernetes'],
    estimatedTime: '12 minutes',
    complexity: 'Intermediate',
    preconfigured: true
  }
];

export default function DeployPage() {
  const [selectedMethod, setSelectedMethod] = useState('docker');
  const [activeTab, setActiveTab] = useState('wizard');
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [deploymentConfig, setDeploymentConfig] = useState({
    environment: 'development',
    cloudProvider: 'aws',
    region: 'us-east-1',
    instanceType: 't3.medium',
    customConfig: ''
  });

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
      default: return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                Discover
              </Link>
              <Link href="/bundles" className="text-gray-600 hover:text-gray-900 transition-colors">
                Bundles
              </Link>
              <Link href="/vendors" className="text-gray-600 hover:text-gray-900 transition-colors">
                Vendors
              </Link>
              <Link href="/deploy" className="text-purple-600 font-medium">
                Deploy
              </Link>
            </nav>
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
              Security best practices
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Production-ready
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wizard">Deployment Wizard</TabsTrigger>
            <TabsTrigger value="quick">Quick Deploy</TabsTrigger>
            <TabsTrigger value="custom">Custom Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Deployment Method Selection */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Choose Deployment Method
                    </CardTitle>
                    <CardDescription>
                      Select the deployment method that best fits your needs and infrastructure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deploymentOptions.map((option) => (
                        <Card 
                          key={option.id} 
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedMethod === option.id 
                              ? 'ring-2 ring-purple-500 border-purple-500' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedMethod(option.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                {option.icon}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{option.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getDifficultyColor(option.difficulty)}>
                                    {option.difficulty}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{option.time}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <CardDescription className="mb-3">
                              {option.description}
                            </CardDescription>
                            
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Requirements:</span>
                                <ul className="mt-1 text-gray-600">
                                  {option.requirements.map((req, index) => (
                                    <li key={index} className="flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <span className="font-medium text-gray-700">Features:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {option.features.map((feature) => (
                                    <Badge key={feature} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Configuration Form */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>
                      Configure your deployment settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                      {selectedMethod === 'cloud' && (
                        <>
                          <div>
                            <Label htmlFor="cloudProvider">Cloud Provider</Label>
                            <Select value={deploymentConfig.cloudProvider} onValueChange={(value) => 
                              setDeploymentConfig(prev => ({ ...prev, cloudProvider: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aws">Amazon Web Services</SelectItem>
                                <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                                <SelectItem value="azure">Microsoft Azure</SelectItem>
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
                                <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                                <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                                <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                                <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                              </SelectContent>
                            </Select>
                          
                          </div>

                          <div>
                            <Label htmlFor="instanceType">Instance Type</Label>
                            <Select value={deploymentConfig.instanceType} onValueChange={(value) => 
                              setDeploymentConfig(prev => ({ ...prev, instanceType: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="t3.micro">t3.micro (1 vCPU, 1GB RAM)</SelectItem>
                                <SelectItem value="t3.small">t3.small (2 vCPU, 2GB RAM)</SelectItem>
                                <SelectItem value="t3.medium">t3.medium (2 vCPU, 4GB RAM)</SelectItem>
                                <SelectItem value="t3.large">t3.large (2 vCPU, 8GB RAM)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customConfig">Custom Configuration (Optional)</Label>
                      <Textarea
                        id="customConfig"
                        placeholder="Add any custom configuration or environment variables..."
                        value={deploymentConfig.customConfig}
                        onChange={(e) => setDeploymentConfig(prev => ({ ...prev, customConfig: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Deployment Summary */}
              <div>
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Deployment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Method:</span>
                      <div className="font-medium">
                        {deploymentOptions.find(opt => opt.id === selectedMethod)?.name}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Environment:</span>
                      <div className="font-medium capitalize">{deploymentConfig.environment}</div>
                    </div>

                    {selectedMethod === 'cloud' && (
                      <>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Provider:</span>
                          <div className="font-medium">{deploymentConfig.cloudProvider.toUpperCase()}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Region:</span>
                          <div className="font-medium">{deploymentConfig.region}</div>
                        </div>
                      </>
                    )}

                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600 mb-4">
                        Estimated deployment time: {deploymentOptions.find(opt => opt.id === selectedMethod)?.time}
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" size="lg">
                        <Play className="w-4 h-4 mr-2" />
                        Start Deployment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

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
                  {quickDeployTools.map((tool) => (
                    <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(tool.category)}
                            <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                              {tool.name}
                            </CardTitle>
                          </div>
                          {tool.preconfigured && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Pre-configured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{tool.category}</Badge>
                          <Badge className={getDifficultyColor(tool.complexity)}>
                            {tool.complexity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription>
                          {tool.description}
                        </CardDescription>
                        
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Deployment Methods:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tool.deploymentMethods.map((method) => (
                              <Badge key={method} variant="secondary" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Est. Time: {tool.estimatedTime}</span>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedTool(tool.id)}
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

          <TabsContent value="custom" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Custom Configuration
                </CardTitle>
                <CardDescription>
                  Create a custom deployment configuration for your specific needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="toolName">Tool/Service Name</Label>
                    <Input id="toolName" placeholder="Enter tool name..." />
                  </div>
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" placeholder="latest" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dockerImage">Docker Image</Label>
                  <Input id="dockerImage" placeholder="nginx:latest" />
                </div>

                <div>
                  <Label htmlFor="ports">Port Mappings</Label>
                  <Input id="ports" placeholder="80:8080, 443:8443" />
                </div>

                <div>
                  <Label htmlFor="envVars">Environment Variables</Label>
                  <Textarea
                    id="envVars"
                    placeholder="KEY1=value1&#10;KEY2=value2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="volumes">Volume Mounts</Label>
                  <Textarea
                    id="volumes"
                    placeholder="/host/path:/container/path&#10;/data:/app/data"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="customYaml">Custom YAML Configuration</Label>
                  <Textarea
                    id="customYaml"
                    placeholder="Add custom Kubernetes YAML or Docker Compose configuration..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <Code className="w-4 h-4 mr-2" />
                    Validate Configuration
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600">
                    <Play className="w-4 h-4 mr-2" />
                    Deploy Custom Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}