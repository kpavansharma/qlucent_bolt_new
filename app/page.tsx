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

const toolCategories = [
  {
    name: 'DevOps & Infrastructure',
    description: 'Container orchestration, CI/CD, monitoring',
    icon: <Cloud className="w-8 h-8" />,
    tools: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    category: 'DevOps'
  },
  {
    name: 'AI & Machine Learning',
    description: 'ML frameworks, data processing, model deployment',
    icon: <Sparkles className="w-8 h-8" />,
    tools: ['TensorFlow', 'PyTorch', 'MLflow', 'Jupyter'],
    color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
    category: 'AI/ML'
  },
  {
    name: 'Security & Compliance',
    description: 'Security scanning, compliance, vulnerability management',
    icon: <Shield className="w-8 h-8" />,
    tools: ['SonarQube', 'Vault', 'Snyk', 'OWASP ZAP'],
    color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    category: 'Security'
  },
  {
    name: 'Monitoring & Observability',
    description: 'Application monitoring, logging, alerting',
    icon: <Monitor className="w-8 h-8" />,
    tools: ['Prometheus', 'Grafana', 'Jaeger', 'ELK Stack'],
    color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
    category: 'Monitoring'
  },
  {
    name: 'Database & Storage',
    description: 'Databases, caching, data warehousing',
    icon: <Database className="w-8 h-8" />,
    tools: ['PostgreSQL', 'Redis', 'MongoDB', 'ClickHouse'],
    color: 'bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800',
    category: 'Database'
  },
  {
    name: 'Development Tools',
    description: 'IDEs, testing frameworks, code quality',
    icon: <Code className="w-8 h-8" />,
    tools: ['VS Code', 'Jest', 'ESLint', 'Prettier'],
    color: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800',
    category: 'Frontend'
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

// Real company logos using SVG
const companyLogos = [
  {
    name: 'Microsoft',
    logo: (
      <svg viewBox="0 0 23 23" className="w-8 h-8">
        <path fill="#f25022" d="M1 1h10v10H1z"/>
        <path fill="#00a4ef" d="M12 1h10v10H12z"/>
        <path fill="#7fba00" d="M1 12h10v10H1z"/>
        <path fill="#ffb900" d="M12 12h10v10H12z"/>
      </svg>
    )
  },
  {
    name: 'Google',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
  {
    name: 'Amazon',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="#FF9900" d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.548.41-3.156.615-4.83.615-3.42 0-6.673-.633-9.755-1.902-.244-.1-.432-.21-.563-.328-.13-.116-.18-.226-.15-.328.03-.1.09-.18.18-.24.09-.06.18-.09.27-.09.09 0 .18.03.27.09z"/>
        <path fill="#146EB4" d="M20.996 15.673c-.32 0-.66-.04-1.02-.12-.36-.08-.7-.2-1.02-.36-.32-.16-.6-.36-.84-.6-.24-.24-.44-.52-.6-.84-.16-.32-.28-.66-.36-1.02-.08-.36-.12-.7-.12-1.02s.04-.66.12-1.02c.08-.36.2-.7.36-1.02.16-.32.36-.6.6-.84.24-.24.52-.44.84-.6.32-.16.66-.28 1.02-.36.36-.08.7-.12 1.02-.12s.66.04 1.02.12c.36.08.7.2 1.02.36.32.16.6.36.84.6.24.24.44.52.6.84.16.32.28.66.36 1.02.08.36.12.7.12 1.02s-.04.66-.12 1.02c-.08.36-.2.7-.36 1.02-.16.32-.36.6-.6.84-.24.24-.52.44-.84.6-.32.16-.66.28-1.02.36-.36.08-.7.12-1.02.12z"/>
      </svg>
    )
  },
  {
    name: 'Meta',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    name: 'Netflix',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="#E50914" d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.71.002-22.95zM5.398 1.05V24c2.836-.693 4.849-1.133 4.854-1.133V1.05z"/>
      </svg>
    )
  },
  {
    name: 'Spotify',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="#1ED760" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  }
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
  const router = useRouter();

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-white rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <Image
                  src="/ql_logo.png"
                  alt="Qlucent.ai"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </Link>
            
            <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
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
              <Link href="/portfolios" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfolios
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
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
                <Link href="/portfolios" className="text-muted-foreground hover:text-foreground transition-colors">
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 text-sm font-medium">
              🚀 Now in Beta - Join 1000+ developers
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Discover, Deploy &{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Scale
            </span>{' '}
            Tools with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            AI-powered platform for discovering, bundling, and deploying the perfect tools for your tech stack with intelligent recommendations.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <label htmlFor="hero-search" className="sr-only">Search for tools, frameworks, or describe your needs</label>
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
              <Input
                id="hero-search"
                name="search"
                type="text"
                placeholder="Search for tools, frameworks, or describe your needs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 pr-6 py-6 text-lg border-2 rounded-2xl focus:border-purple-500 focus:ring-purple-500 shadow-xl bg-background"
              />
            </form>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              <Button 
                type="submit"
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={handleSearch}
              >
                <Search className="mr-2 w-5 h-5" />
                Start Exploring
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg rounded-xl border-2 hover:bg-muted"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-muted-foreground font-medium">Tools Indexed</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-muted-foreground font-medium">Verified Vendors</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">1M+</div>
              <div className="text-muted-foreground font-medium">Deployments</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-muted-foreground font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                The Problem with Tool Discovery
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Scattered Information</h3>
                    <p className="text-muted-foreground">Tools are spread across GitHub, Product Hunt, Reddit, and countless other platforms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Complex Deployment</h3>
                    <p className="text-muted-foreground">Setting up tools requires extensive configuration and DevOps expertise</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">No Expert Guidance</h3>
                    <p className="text-muted-foreground">Finding qualified vendors and consultants for implementation is time-consuming</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Our AI-Powered Solution
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Unified Discovery</h3>
                    <p className="text-muted-foreground">Search across all platforms with natural language queries and AI-powered recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">One-Click Deployment</h3>
                    <p className="text-muted-foreground">Deploy tools instantly with pre-configured Docker, Helm charts, and GitHub Actions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Expert Marketplace</h3>
                    <p className="text-muted-foreground">Connect with verified vendors for consulting, training, and enterprise support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Qlucent.ai Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How Qlucent.ai Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From discovery to deployment in four simple steps, powered by AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="h-full bg-background/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-4`}>
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-sm font-bold text-muted-foreground">{step.step}</span>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powerful Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Explore Tool Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover tools across all domains with AI-curated recommendations for your specific use case
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolCategories.map((category, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 group cursor-pointer ${category.color} border-2`}>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-background rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="bg-background/80">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 group-hover:bg-background/50" 
                    onClick={() => handleCategoryClick(category.category)}
                  >
                    Explore Category <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Developers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of developers and companies who trust Qlucent.ai for their tool discovery and deployment needs
            </p>
          </div>

          {/* Company Logos */}
          <div className="mb-16">
            <p className="text-center text-muted-foreground mb-8 font-medium">Trusted by leading companies</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
              {companyLogos.map((company, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  {company.logo}
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
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-muted-foreground">Tools Deployed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start free and scale as you grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${plan.popular ? 'border-2 border-purple-500 scale-105' : 'border'}`}>
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
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
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
      <footer className="bg-background border-t py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-8 h-8 bg-white rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <Image
                    src="/ql_logo.png"
                    alt="Qlucent.ai"
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Qlucent.ai</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The AI-powered platform for discovering, comparing, and deploying the perfect tools for your tech stack.
              </p>
              <div className="flex space-x-4">
                <Link 
                  href="https://www.linkedin.com/company/qlucent" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/search" className="hover:text-foreground transition-colors">Search Tools</Link></li>
                <li><Link href="/bundles" className="hover:text-foreground transition-colors">Tool Bundles</Link></li>
                <li><Link href="/deploy" className="hover:text-foreground transition-colors">Deploy</Link></li>
                <li><Link href="/vendors" className="hover:text-foreground transition-colors">Vendors</Link></li>
                <li><Link href="/portfolios" className="hover:text-foreground transition-colors">Portfolios</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">&copy; 2024 Qlucent.ai. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}