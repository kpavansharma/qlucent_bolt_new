'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, Zap, Shield, ArrowRight, Github, Star, Users, Download, CheckCircle, Play, Code, Database, Monitor, Cloud, Lock, BarChart3, Rocket, Globe, Award, TrendingUp, Building2, Heart, MessageSquare, ChevronRight, Menu, X, User, LogOut, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

// Tech tools for the rotating globe
const techTools = [
  {
    name: 'Vue.js',
    url: 'https://vuejs.org',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'
  },
  {
    name: 'Angular',
    url: 'https://angular.io',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg'
  },
  {
    name: 'React',
    url: 'https://reactjs.org',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  },
  {
    name: 'Next.js',
    url: 'https://nextjs.org',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'
  },
  {
    name: 'Flutter',
    url: 'https://flutter.dev',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg'
  },
  {
    name: 'Docker',
    url: 'https://docker.com',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
  },
  {
    name: 'Git',
    url: 'https://git-scm.com',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
  },
  {
    name: 'Terraform',
    url: 'https://www.terraform.io',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg'
  },
  {
    name: 'Jenkins',
    url: 'https://www.jenkins.io',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg'
  },
  {
    name: 'Python',
    url: 'https://www.python.org',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
  },
  {
    name: 'JavaScript',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
  },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
  },
  {
    name: 'npm',
    url: 'https://www.npmjs.com',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg'
  },
  {
    name: 'Go',
    url: 'https://golang.org',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg'
  },
  {
    name: 'Kubernetes',
    url: 'https://kubernetes.io',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg'
  }
];

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                Discover
              </Link>
              <Link href="/bundles" className="text-muted-foreground hover:text-foreground transition-colors">
                Bundles
              </Link>
              <Link href="/vendors" className="text-muted-foreground hover:text-foreground transition-colors">
                Vendors
              </Link>
              <Link href="/deploy" className="text-muted-foreground hover:text-foreground transition-colors">
                Deploy
              </Link>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
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
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Discover
                </Link>
                <Link href="/bundles" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bundles
                </Link>
                <Link href="/vendors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Vendors
                </Link>
                <Link href="/deploy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Deploy
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  {user ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/auth">Sign In</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                        <Link href="/auth">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Discover & Deploy Developer Tools with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find the perfect tools for your tech stack with AI-powered recommendations and deploy them in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                <Link href="/search">
                  <Search className="w-5 h-5 mr-2" />
                  Discover Tools
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/bundles">
                  <Zap className="w-5 h-5 mr-2" />
                  Explore Bundles
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tech Globe */}
        <div className="relative mt-16 mb-8 mx-auto max-w-5xl h-[400px] md:h-[500px]">
          {/* Dotted pattern background */}
          <div className="absolute inset-0 z-0">
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80 dark:fill-neutral-600/50 [mask-image:radial-gradient(200px_circle_at_center,white,transparent)] opacity-50">
              <defs>
                <pattern id="techGridPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" x="0" y="0">
                  <circle cx="1" cy="1" r="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" strokeWidth="0" fill="url(#techGridPattern)" />
            </svg>
          </div>
          
          {/* Rotating tech logos */}
          <div className="relative h-full w-full flex items-center justify-center">
            {techTools.map((tool, index) => {
              // Calculate position on a circle
              const angle = (index / techTools.length) * 2 * Math.PI;
              const radius = 150; // Adjust based on your needs
              const delay = index * 0.2; // Stagger the animations
              
              // Calculate x and y coordinates
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              // Calculate distance from center (0-1)
              const distance = Math.sqrt(x*x + y*y) / radius;
              
              // Adjust size based on distance (perspective effect)
              const size = 40 + (1 - distance) * 20;
              
              return (
                <div 
                  key={tool.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 z-10"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    animation: `float 6s ease-in-out infinite ${delay}s`,
                  }}
                >
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-2 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                    title={tool.name}
                  >
                    <img 
                      src={tool.logo} 
                      alt={tool.name} 
                      className="w-8 h-8 md:w-10 md:h-10 object-contain dark:invert-[.25]"
                    />
                  </a>
                </div>
              );
            })}
            
            {/* Center logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700">
                <Image
                  src="/ql_logo.png"
                  alt="Qlucent.ai"
                  width={64}
                  height={64}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Qlucent.ai simplifies the entire developer tool lifecycle from discovery to deployment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Tools</h2>
              <p className="text-muted-foreground">Discover popular developer tools curated by our AI</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search">
                View All Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {tool.name}
                    </CardTitle>
                    {tool.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline">{tool.category}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm line-clamp-2">
                    {tool.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {(tool.stars / 1000).toFixed(1)}k
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {tool.downloads}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/tools/${tool.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to discover, deploy, and manage developer tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your development workflow?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of developers using Qlucent.ai to discover and deploy the best tools for their projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth">
                Get Started for Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/bundles">
                Explore Bundles
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">Discover</Link></li>
                <li><Link href="/bundles" className="text-muted-foreground hover:text-foreground transition-colors">Bundles</Link></li>
                <li><Link href="/deploy" className="text-muted-foreground hover:text-foreground transition-colors">Deploy</Link></li>
                <li><Link href="/vendors" className="text-muted-foreground hover:text-foreground transition-colors">Vendors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
                <li><Link href="/licenses" className="text-muted-foreground hover:text-foreground transition-colors">Licenses</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Qlucent.ai. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}