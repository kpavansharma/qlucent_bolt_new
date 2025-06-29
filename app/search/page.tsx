'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Download, Github, ExternalLink, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toolService, ToolSearchParams } from '@/lib/services/toolService';
import { Tool } from '@/lib/types/api';
import { useApi } from '@/lib/hooks/useApi';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import Link from 'next/link';

const categories = ['All', 'DevOps', 'AI/ML', 'Frontend', 'Backend', 'Database', 'Security', 'Monitoring'];
const licenses = ['All', 'MIT', 'Apache 2.0', 'GPL', 'BSD', 'Other'];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('query') || '';
  const initialCategory = searchParams.get('category') || 'All';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLicense, setSelectedLicense] = useState('All');
  const [minStars, setMinStars] = useState([0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showDeploymentReady, setShowDeploymentReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Build search parameters for backend - simplified
  const toolSearchParams: ToolSearchParams = {
    query: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    license: selectedLicense !== 'All' ? selectedLicense : undefined,
    minStars: minStars[0] > 0 ? minStars[0] * 1000 : undefined,
    verified: showVerifiedOnly || undefined,
    deploymentReady: showDeploymentReady || undefined,
    sortBy: sortBy !== 'relevance' ? sortBy : undefined,
    page: currentPage,
    limit: 12
  };

  // Fetch tools from backend - always fetch when parameters change
  const { data: toolsResponse, loading, error, refetch } = useApi(
    () => {
      console.log('🔍 Fetching tools with params:', toolSearchParams);
      return toolService.getTools(toolSearchParams);
    },
    [searchQuery, selectedCategory, selectedLicense, minStars[0], sortBy, showVerifiedOnly, showDeploymentReady, currentPage]
  );

  const tools = toolsResponse?.items || [];
  const totalPages = toolsResponse?.totalPages || 1;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLicense, minStars[0], sortBy, showVerifiedOnly, showDeploymentReady]);

  // Set initial search query and category from URL params
  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialQuery, initialCategory]);

  // Handle search form submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setCurrentPage(1);
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    
    const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl, { scroll: false });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    console.log('🎯 Category changed to:', category);
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search query when category changes
    setCurrentPage(1);
    
    // Update URL with only category parameter
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    
    const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl, { scroll: false });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLicense('All');
    setMinStars([0]);
    setSortBy('relevance');
    setShowVerifiedOnly(false);
    setShowDeploymentReady(false);
    setCurrentPage(1);
    router.push('/search', { scroll: false });
  };

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg group-hover:text-purple-600 transition-colors flex items-center gap-2">
            <Link href={`/tools/${tool.id}`} className="hover:underline">
              {tool.name}
            </Link>
            {tool.verified && <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">Verified</Badge>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{tool.aiScore}% AI Match</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{tool.category}</Badge>
          <Badge variant="secondary" className="text-xs">{tool.license}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              {(tool.stars / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              {tool.downloads}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tool.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{tool.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/tools/${tool.id}`}>
              View Details
            </Link>
          </Button>
          {tool.deploymentReady && (
            <Button size="sm" variant="outline" className="px-3" asChild>
              <Link href={`/deploy/${tool.id}`}>
                <Sparkles className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ToolListItem = ({ tool }: { tool: Tool }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold hover:text-purple-600 transition-colors">
                <Link href={`/tools/${tool.id}`} className="hover:underline">
                  {tool.name}
                </Link>
              </h3>
              {tool.verified && <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">Verified</Badge>}
              <Badge variant="outline" className="text-xs">{tool.aiScore}% AI Match</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{tool.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">{tool.category}</Badge>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {(tool.stars / 1000).toFixed(1)}k
              </div>
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-1" />
                {tool.downloads}
              </div>
              <span className="text-xs">{tool.license}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" asChild>
              <Link href={`/tools/${tool.id}`}>
                View Details
              </Link>
            </Button>
            {tool.deploymentReady && (
              <Button size="sm" variant="outline" className="px-3" asChild>
                <Link href={`/deploy/${tool.id}`}>
                  <Sparkles className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="search" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Developer Tools
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Search through thousands of tools with AI-powered recommendations. 
            Find the perfect tools for your tech stack and use case.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tools, frameworks, or describe your needs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3"
              />
            </div>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 px-8">
              <Search className="w-4 h-4 mr-2" />
              Search Tools
            </Button>
          </form>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* License Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">License</label>
                  <Select value={selectedLicense} onValueChange={setSelectedLicense}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {licenses.map((license) => (
                        <SelectItem key={license} value={license}>
                          {license}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Stars */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Stars (k)</label>
                  <Slider
                    value={minStars}
                    onValueChange={setMinStars}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {minStars[0]}k+ stars
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                      <SelectItem value="aiScore">AI Score</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={showVerifiedOnly}
                      onCheckedChange={(checked) => setShowVerifiedOnly(checked === true)}
                    />
                    <label htmlFor="verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Verified Only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="deployment"
                      checked={showDeploymentReady}
                      onCheckedChange={(checked) => setShowDeploymentReady(checked === true)}
                    />
                    <label htmlFor="deployment" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Deployment Ready
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
                <p className="text-muted-foreground">
                  {loading ? 'Searching...' : 'Discover tools for your project'}
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-2 text-muted-foreground">Searching tools...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Failed to load tools: {error}</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            )}

            {/* Results */}
            {!loading && !error && (
              <>
                {tools.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No tools found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <Button onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tools.map((tool) => (
                          <ToolListItem key={tool.id} tool={tool} />
                        ))}
                      </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}