'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, Zap, Shield, ArrowRight, Github, Star, Users, Download, CheckCircle, Play, Code, Database, Monitor, Cloud, Lock, BarChart3, Rocket, Globe, Award, TrendingUp, Building2, Heart, MessageSquare, ChevronRight, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const featuredTools = [
  {
    id: 1,
    name: 'Docker',
    description: 'Platform for developing, shipping, and running applications',
    category: 'DevOps',
    stars: 68900,
    downloads: '10B+',
    tags: ['containerization', 'deployment', 'microservices'],
    verified: true
  },
  {
    id: 2,
    name: 'Kubernetes',
    description: 'Production-Grade Container Orchestration',
    category: 'DevOps',
    stars: 108000,
    downloads: '1B+',
    tags: ['orchestration', 'scaling', 'cloud-native'],
    verified: true
  },
  {
    id: 3,
    name: 'TensorFlow',
    description: 'End-to-end open source platform for machine learning',
    category: 'AI/ML',
    stars: 185000,
    downloads: '50M+',
    tags: ['machine-learning', 'neural-networks', 'deep-learning'],
    verified: true
  },
  {
    id: 4,
    name: 'Prometheus',
    description: 'Monitoring system and time series database',
    category: 'Monitoring',
    stars: 54700,
    downloads: '100M+',
    tags: ['monitoring', 'alerting', 'time-series'],
    verified: true
  }
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Search & Discover',
    description: 'Use natural language to find tools across GitHub, Product Hunt, and enterprise catalogs',
    icon: <Search className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    step: 2,
    title: 'AI Recommendations',
    description: 'Get personalized tool suggestions and bundles based on your tech stack and needs',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    step: 3,
    title: 'One-Click Deploy',
    description: 'Deploy tools instantly with pre-configured Docker, Helm charts, and GitHub Actions',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    step: 4,
    title: 'Expert Support',
    description: 'Connect with verified vendors for consulting, training, and enterprise support',
    icon: <Users className="w-8 h-8" />,
    color: 'from-orange-500 to-red-500'
  }
];

const features = [
  {
    title: 'Unified Tool Discovery',
    description: 'Search across GitHub, Product Hunt, and enterprise tools in one place with natural language queries',
    icon: <Search className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'AI-Powered Recommendations',
    description: 'Get personalized tool suggestions and bundles based on your tech stack and requirements',
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'One-Click Deployment',
    description: 'Deploy tools instantly with pre-configured Docker, Helm charts, and GitHub Actions',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Verified Vendors',
    description: 'Connect with expert consultants and vendors for implementation and support',
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'Security First',
    description: 'All tools are security-scanned and verified before being added to our platform',
    icon: <Lock className="w-6 h-6" />,
    gradient: 'from-red-500 to-pink-500'
  },
  {
    title: 'Analytics & Insights',
    description: 'Track tool performance, usage metrics, and optimization opportunities',
    icon: <BarChart3 className="w-6 h-6" />,
    gradient: 'from-indigo-500 to-purple-500'
  }
];

const toolCategories = [
  {
    name: 'DevOps & Infrastructure',
    description: 'Container orchestration, CI/CD, monitoring',
    icon: <Cloud className="w-8 h-8" />,
    tools: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    color: 'bg-blue-50 border-blue-200'
  },
  {
    name: 'AI & Machine Learning',
    description: 'ML frameworks, data processing, model deployment',
    icon: <Sparkles className="w-8 h-8" />,
    tools: ['TensorFlow', 'PyTorch', 'MLflow', 'Jupyter'],
    color: 'bg-purple-50 border-purple-200'
  },
  {
    name: 'Security & Compliance',
    description: 'Security scanning, compliance, vulnerability management',
    icon: <Shield className="w-8 h-8" />,
    tools: ['SonarQube', 'Vault', 'Snyk', 'OWASP ZAP'],
    color: 'bg-green-50 border-green-200'
  },
  {
    name: 'Monitoring & Observability',
    description: 'Application monitoring, logging, alerting',
    icon: <Monitor className="w-8 h-8" />,
    tools: ['Prometheus', 'Grafana', 'Jaeger', 'ELK Stack'],
    color: 'bg-orange-50 border-orange-200'
  },
  {
    name: 'Database & Storage',
    description: 'Databases, caching, data warehousing',
    icon: <Database className="w-8 h-8" />,
    tools: ['PostgreSQL', 'Redis', 'MongoDB', 'ClickHouse'],
    color: 'bg-cyan-50 border-cyan-200'
  },
  {
    name: 'Development Tools',
    description: 'IDEs, testing frameworks, code quality',
    icon: <Code className="w-8 h-8" />,
    tools: ['VS Code', 'Jest', 'ESLint', 'Prettier'],
    color: 'bg-pink-50 border-pink-200'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO at TechFlow',
    company: 'TechFlow',
    avatar: '/api/placeholder/60/60',
    content: 'Qlucent.ai helped us discover and deploy our entire monitoring stack in under 2 hours. The AI recommendations were spot-on for our use case.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'DevOps Engineer',
    company: 'CloudScale',
    avatar: '/api/placeholder/60/60',
    content: 'The one-click deployment feature is a game-changer. We went from tool discovery to production deployment in minutes, not days.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Lead Developer',
    company: 'InnovateLabs',
    avatar: '/api/placeholder/60/60',
    content: 'Finally, a platform that understands our tech stack and suggests tools that actually work together. The vendor marketplace is incredibly valuable.',
    rating: 5
  }
];

const companyLogos = [
  { name: 'TechFlow', logo: 'TF' },
  { name: 'CloudScale', logo: 'CS' },
  { name: 'InnovateLabs', logo: 'IL' },
  { name: 'DataCorp', logo: 'DC' },
  { name: 'SecureNet', logo: 'SN' },
  { name: 'DevOps Pro', logo: 'DP' }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for individual developers and small projects',
    features: [
      'Access to 1,000+ open-source tools',
      'Basic AI recommendations',
      'Community support',
      'Up to 3 deployments/month',
      'Standard tool bundles'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'Ideal for growing teams and production workloads',
    features: [
      'Access to 10,000+ tools',
      'Advanced AI recommendations',
      'Priority support',
      'Unlimited deployments',
      'Custom tool bundles',
      'Vendor marketplace access',
      'Team collaboration'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with complex requirements',
    features: [
      'Full tool catalog access',
      'Custom AI model training',
      '24/7 dedicated support',
      'Unlimited everything',
      'Private tool repositories',
      'Advanced security features',
      'Custom integrations',
      'SLA guarantees'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </Link>
            
            <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
              <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                Discover
              </Link>
              <Link href="/bundles" className="text-gray-600 hover:text-gray-900 transition-colors">
                Bundles
              </Link>
              <Link href="/vendors" className="text-gray-600 hover:text-gray-900 transition-colors">
                Vendors
              </Link>
              <Link href="/deploy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Deploy
              </Link>
              <Link href="/portfolios" className="text-gray-600 hover:text-gray-900 transition-colors">
                Portfolios
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Discover
                </Link>
                <Link href="/bundles" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Bundles
                </Link>
                <Link href="/vendors" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Vendors
                </Link>
                <Link href="/deploy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Deploy
                </Link>
                <Link href="/portfolios" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Portfolios
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  {user ? (
                    <>
                      <Link href="/dashboard">
                        <Button variant="outline" size="sm" className="w-full">
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/auth">
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 w-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
              🚀 Now in Beta - Join 10,000+ developers
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Discover, Deploy &{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Scale
            </span>{' '}
            Tools with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            AI-powered platform for discovering, bundling, and deploying the perfect tools for your tech stack with intelligent recommendations.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search for tools, frameworks, or describe your needs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 pr-6 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-purple-500 shadow-xl bg-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/search">
                  <Search className="mr-2 w-5 h-5" />
                  Start Exploring
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg rounded-xl border-2 hover:bg-gray-50"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Tools Indexed</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Verified Vendors</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">1M+</div>
              <div className="text-gray-600 font-medium">Deployments</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Problem with Tool Discovery
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Scattered Information</h3>
                    <p className="text-gray-600">Tools are spread across GitHub, Product Hunt, Reddit, and countless other platforms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Complex Deployment</h3>
                    <p className="text-gray-600">Setting up tools requires extensive configuration and DevOps expertise</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">No Expert Guidance</h3>
                    <p className="text-gray-600">Finding qualified vendors and consultants for implementation is time-consuming</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our AI-Powered Solution
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Unified Discovery</h3>
                    <p className="text-gray-600">Search across all platforms with natural language queries and AI-powered recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">One-Click Deployment</h3>
                    <p className="text-gray-600">Deploy tools instantly with pre-configured Docker, Helm charts, and GitHub Actions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expert Marketplace</h3>
                    <p className="text-gray-600">Connect with verified vendors for consulting, training, and enterprise support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Qlucent.ai Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Qlucent.ai Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From discovery to deployment in four simple steps, powered by AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-4`}>
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-sm font-bold text-gray-700">{step.step}</span>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powerful Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to discover, deploy, and manage your tech stack
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Tool Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover tools across all domains with AI-curated recommendations for your specific use case
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolCategories.map((category, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 group cursor-pointer ${category.color} border-2`}>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="bg-white/80">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 group-hover:bg-white/50" asChild>
                    <Link href="/search">
                      Explore Category <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Developers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of developers and companies who trust Qlucent.ai for their tool discovery and deployment needs
            </p>
          </div>

          {/* Company Logos */}
          <div className="mb-16">
            <p className="text-center text-gray-500 mb-8 font-medium">Trusted by leading companies</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
              {companyLogos.map((company, index) => (
                <div key={index} className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-gray-600">{company.logo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600">Tools Deployed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start free and scale as you grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${plan.popular ? 'border-2 border-purple-500 scale-105' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link href="/auth">
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Tech Stack?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of developers and teams using Qlucent.ai to discover, deploy, and scale their tools faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
              <Link href="/auth">
                <Rocket className="mr-2 w-5 h-5" />
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg text-white border-white hover:bg-white hover:text-purple-600">
              <MessageSquare className="mr-2 w-5 h-5" />
              Schedule Demo
            </Button>
          </div>
          <p className="text-purple-200 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Qlucent.ai</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The AI-powered platform for discovering, comparing, and deploying the perfect tools for your tech stack.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Github className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/search" className="hover:text-white transition-colors">Search Tools</Link></li>
                <li><Link href="/bundles" className="hover:text-white transition-colors">Tool Bundles</Link></li>
                <li><Link href="/deploy" className="hover:text-white transition-colors">Deploy</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link></li>
                <li><Link href="/portfolios" className="hover:text-white transition-colors">Portfolios</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 Qlucent.ai. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}