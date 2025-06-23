'use client';

import { useState } from 'react';
import { Search, Star, User, Package, TrendingUp, Calendar, Filter, ExternalLink, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const portfolios = [
  {
    id: 1,
    name: 'Sarah Chen',
    username: 'sarahchen',
    title: 'Full Stack Developer',
    company: 'TechFlow',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/100/100',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Love exploring new technologies and sharing knowledge.',
    toolsReviewed: 24,
    bundlesCreated: 8,
    totalDownloads: 1250,
    avgRating: 4.8,
    joinedDate: '2023-06-15',
    expertise: ['React', 'Node.js', 'Docker', 'AWS', 'PostgreSQL'],
    recentTools: [
      { name: 'Next.js', rating: 5, category: 'Frontend' },
      { name: 'Prisma', rating: 4, category: 'Database' },
      { name: 'Tailwind CSS', rating: 5, category: 'Frontend' }
    ],
    topBundles: [
      { name: 'Modern React Stack', downloads: 450, rating: 4.9 },
      { name: 'Full Stack Starter', downloads: 380, rating: 4.7 }
    ],
    socialLinks: {
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      website: 'https://sarahchen.dev'
    }
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    username: 'marcusdev',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Austin, TX',
    avatar: '/api/placeholder/100/100',
    bio: 'DevOps engineer specializing in Kubernetes, CI/CD, and cloud infrastructure. Helping teams deploy faster and more reliably.',
    toolsReviewed: 32,
    bundlesCreated: 12,
    totalDownloads: 2100,
    avgRating: 4.9,
    joinedDate: '2023-03-20',
    expertise: ['Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'Prometheus'],
    recentTools: [
      { name: 'ArgoCD', rating: 5, category: 'DevOps' },
      { name: 'Helm', rating: 4, category: 'DevOps' },
      { name: 'Grafana', rating: 5, category: 'Monitoring' }
    ],
    topBundles: [
      { name: 'K8s Monitoring Stack', downloads: 680, rating: 4.8 },
      { name: 'CI/CD Pipeline Starter', downloads: 520, rating: 4.9 }
    ],
    socialLinks: {
      github: 'https://github.com/marcusdev',
      linkedin: 'https://linkedin.com/in/marcusrodriguez'
    }
  },
  {
    id: 3,
    name: 'Emily Watson',
    username: 'emilywatson',
    title: 'Data Scientist',
    company: 'DataCorp',
    location: 'New York, NY',
    avatar: '/api/placeholder/100/100',
    bio: 'Data scientist with expertise in machine learning and data visualization. Building intelligent systems that make a difference.',
    toolsReviewed: 18,
    bundlesCreated: 6,
    totalDownloads: 890,
    avgRating: 4.7,
    joinedDate: '2023-08-10',
    expertise: ['Python', 'TensorFlow', 'Jupyter', 'Pandas', 'Scikit-learn'],
    recentTools: [
      { name: 'MLflow', rating: 4, category: 'AI/ML' },
      { name: 'Streamlit', rating: 5, category: 'Data Science' },
      { name: 'Apache Airflow', rating: 4, category: 'Data Engineering' }
    ],
    topBundles: [
      { name: 'ML Pipeline Starter', downloads: 320, rating: 4.6 },
      { name: 'Data Analysis Toolkit', downloads: 280, rating: 4.8 }
    ],
    socialLinks: {
      github: 'https://github.com/emilywatson',
      linkedin: 'https://linkedin.com/in/emilywatson',
      website: 'https://emilywatson.ai'
    }
  },
  {
    id: 4,
    name: 'Alex Kim',
    username: 'alexkim',
    title: 'Security Engineer',
    company: 'SecureNet',
    location: 'Seattle, WA',
    avatar: '/api/placeholder/100/100',
    bio: 'Cybersecurity expert focused on DevSecOps and application security. Making the web a safer place, one deployment at a time.',
    toolsReviewed: 28,
    bundlesCreated: 10,
    totalDownloads: 1560,
    avgRating: 4.8,
    joinedDate: '2023-05-05',
    expertise: ['Security', 'DevSecOps', 'Penetration Testing', 'OWASP', 'Vault'],
    recentTools: [
      { name: 'SonarQube', rating: 5, category: 'Security' },
      { name: 'HashiCorp Vault', rating: 4, category: 'Security' },
      { name: 'OWASP ZAP', rating: 4, category: 'Security' }
    ],
    topBundles: [
      { name: 'Security Scanning Suite', downloads: 420, rating: 4.9 },
      { name: 'DevSecOps Starter', downloads: 380, rating: 4.7 }
    ],
    socialLinks: {
      github: 'https://github.com/alexkim',
      linkedin: 'https://linkedin.com/in/alexkim'
    }
  }
];

const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Data Science', 'AI/ML', 'Security', 'Mobile'];
const sortOptions = ['Most Active', 'Highest Rated', 'Most Downloads', 'Recently Joined'];

export default function PortfoliosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Most Active');
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);

  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch = portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || 
                           portfolio.expertise.some(skill => {
                             // Map skills to categories
                             const skillCategories: { [key: string]: string[] } = {
                               'Frontend': ['React', 'Vue', 'Angular', 'Next.js', 'Tailwind CSS'],
                               'Backend': ['Node.js', 'Express', 'Django', 'FastAPI'],
                               'DevOps': ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS'],
                               'Data Science': ['Python', 'Pandas', 'Jupyter', 'Streamlit'],
                               'AI/ML': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'MLflow'],
                               'Security': ['OWASP', 'Vault', 'Security', 'DevSecOps'],
                               'Database': ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma']
                             };
                             return skillCategories[selectedCategory]?.includes(skill);
                           });

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'Highest Rated':
        return b.avgRating - a.avgRating;
      case 'Most Downloads':
        return b.totalDownloads - a.totalDownloads;
      case 'Recently Joined':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return (b.toolsReviewed + b.bundlesCreated) - (a.toolsReviewed + a.bundlesCreated);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
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
              <Link href="/deploy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Deploy
              </Link>
              <Link href="/portfolios" className="text-purple-600 font-medium">
                Portfolios
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Developer Portfolios
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover talented developers, explore their tool expertise, and learn from their experiences. 
            Connect with the community and find inspiration for your next project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search developers, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3"
              />
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 px-8">
              Search Portfolios
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Expertise</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Developers:</span>
                  <span className="font-medium">{portfolios.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tools Reviewed:</span>
                  <span className="font-medium">
                    {portfolios.reduce((sum, p) => sum + p.toolsReviewed, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bundles Created:</span>
                  <span className="font-medium">
                    {portfolios.reduce((sum, p) => sum + p.bundlesCreated, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Downloads:</span>
                  <span className="font-medium">
                    {portfolios.reduce((sum, p) => sum + p.totalDownloads, 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Developer Portfolios</h2>
                <p className="text-gray-600">
                  {filteredPortfolios.length} developers found
                </p>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <Card key={portfolio.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={portfolio.avatar} alt={portfolio.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-600 font-bold">
                          {portfolio.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors truncate">
                          {portfolio.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 truncate">{portfolio.title}</p>
                        <p className="text-xs text-gray-500 truncate">{portfolio.company} • {portfolio.location}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{portfolio.bio}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-bold text-blue-600">{portfolio.toolsReviewed}</div>
                        <div className="text-xs text-gray-600">Tools</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-bold text-purple-600">{portfolio.bundlesCreated}</div>
                        <div className="text-xs text-gray-600">Bundles</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        <span className="font-medium">{portfolio.avgRating}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>{portfolio.totalDownloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {portfolio.expertise.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {portfolio.expertise.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{portfolio.expertise.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedPortfolio(portfolio)}
                      >
                        View Portfolio
                      </Button>
                      <div className="flex gap-1">
                        {portfolio.socialLinks.github && (
                          <Button variant="outline" size="sm" className="px-2" asChild>
                            <Link href={portfolio.socialLinks.github} target="_blank">
                              <Github className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        {portfolio.socialLinks.linkedin && (
                          <Button variant="outline" size="sm" className="px-2" asChild>
                            <Link href={portfolio.socialLinks.linkedin} target="_blank">
                              <Linkedin className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPortfolios.length === 0 && (
              <Card className="p-12 text-center">
                <div className="text-gray-400">
                  <User className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Detail Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedPortfolio.avatar} alt={selectedPortfolio.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-600 font-bold text-lg">
                      {selectedPortfolio.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPortfolio.name}</h2>
                    <p className="text-gray-600">{selectedPortfolio.title}</p>
                    <p className="text-sm text-gray-500">{selectedPortfolio.company} • {selectedPortfolio.location}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedPortfolio(null)}>
                  Close
                </Button>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="bundles">Bundles</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700">{selectedPortfolio.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedPortfolio.toolsReviewed}</div>
                      <div className="text-sm text-gray-600">Tools Reviewed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedPortfolio.bundlesCreated}</div>
                      <div className="text-sm text-gray-600">Bundles Created</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedPortfolio.totalDownloads.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Downloads</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedPortfolio.avgRating}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPortfolio.expertise.map((skill: string) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Connect</h3>
                    <div className="flex gap-3">
                      {selectedPortfolio.socialLinks.github && (
                        <Button variant="outline" asChild>
                          <Link href={selectedPortfolio.socialLinks.github} target="_blank">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </Link>
                        </Button>
                      )}
                      {selectedPortfolio.socialLinks.linkedin && (
                        <Button variant="outline" asChild>
                          <Link href={selectedPortfolio.socialLinks.linkedin} target="_blank">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </Link>
                        </Button>
                      )}
                      {selectedPortfolio.socialLinks.website && (
                        <Button variant="outline" asChild>
                          <Link href={selectedPortfolio.socialLinks.website} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Website
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Tool Reviews</h3>
                  <div className="space-y-3">
                    {selectedPortfolio.recentTools.map((tool: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < tool.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="bundles" className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Bundles</h3>
                  <div className="space-y-3">
                    {selectedPortfolio.topBundles.map((bundle: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{bundle.name}</h4>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {bundle.rating}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{bundle.downloads} downloads</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}