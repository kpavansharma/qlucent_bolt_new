'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Download, Github, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
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
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import Link from 'next/link';

const categories = ['All', 'DevOps', 'AI/ML', 'Frontend', 'Backend', 'Database', 'Security', 'Monitoring'];
const licenses = ['All', 'MIT', 'Apache 2.0', 'GPL', 'BSD', 'Other'];

export default function SearchPage() {
  const searchParams = useSearchParams();
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
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [useClientSideFiltering, setUseClientSideFiltering] = useState(false);

  // Fetch all tools for client-side filtering
  const { data: allToolsResponse, loading: allToolsLoading } = useApi(
    () => toolService.getTools({ limit: 1000 }),
    []
  );

  // Build search parameters for backend
  const toolSearchParams: ToolSearchParams = {
    query: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    license: selectedLicense !== 'All' ? selectedLicense : undefined,
    minStars: minStars[0] * 1000,
    verified: showVerifiedOnly || undefined,
    deploymentReady: showDeploymentReady || undefined,
    sortBy: sortBy !== 'relevance' ? sortBy : undefined,
    page: currentPage,
    limit: 12
  };

  // Fetch tools from backend using search
  const { data: toolsResponse, loading, error, refetch } = useApi(
    () => toolService.searchTools(searchQuery || '', toolSearchParams),
    [searchQuery, selectedCategory, selectedLicense, minStars[0], sortBy, showVerifiedOnly, showDeploymentReady, currentPage]
  );

  // Store all tools for client-side filtering
  useEffect(() => {
    if (allToolsResponse?.items) {
      setAllTools(allToolsResponse.items);
    }
  }, [allToolsResponse]);

  // Client-side filtering function
  const filterToolsClientSide = (tools: Tool[]) => {
    let filtered = [...tools];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by license
    if (selectedLicense !== 'All') {
      filtered = filtered.filter(tool => tool.license === selectedLicense);
    }

    // Filter by minimum stars
    if (minStars[0] > 0) {
      filtered = filtered.filter(tool => tool.stars >= minStars[0] * 1000);
    }

    // Filter by verified status
    if (showVerifiedOnly) {
      filtered = filtered.filter(tool => tool.verified);
    }

    // Filter by deployment ready
    if (showDeploymentReady) {
      filtered = filtered.filter(tool => tool.deploymentReady);
    }

    // Sort results
    switch (sortBy) {
      case 'stars':
        filtered.sort((a, b) => b.stars - a.stars);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'aiScore':
        filtered.sort((a, b) => b.aiScore - a.aiScore);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Relevance sorting (keep original order for now)
        break;
    }

    return filtered;
  };

  // Determine which tools to display
  useEffect(() => {
    if (useClientSideFiltering && allTools.length > 0) {
      const filtered = filterToolsClientSide(allTools);
      setFilteredTools(filtered);
    } else if (toolsResponse?.items) {
      setFilteredTools(toolsResponse.items);
    }
  }, [useClientSideFiltering, allTools, toolsResponse, searchQuery, selectedCategory, selectedLicense, minStars, sortBy, showVerifiedOnly, showDeploymentReady]);

  // Check if backend search is working, fallback to client-side
  useEffect(() => {
    if (error && !useClientSideFiltering && allTools.length > 0) {
      console.log('⚠️ Backend search failed, switching to client-side filtering');
      setUseClientSideFiltering(true);
    }
  }, [error, useClientSideFiltering, allTools.length]);

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

  const tools = filteredTools;
  const totalPages = useClientSideFiltering ? Math.ceil(tools.length / 12) : (toolsResponse?.totalPages || 1);

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
          <div className="text-xs text-muted-foreground">
            Updated {new Date(tool.lastUpdated).toLocaleDateString()}
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
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedLicense('All');
                    setMinStars([0]);
                    setSortBy('relevance');
                    setShowVerifiedOnly(false);
                    setShowDeploymentReady(false);
                  }}
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
                <h1 className="text-2xl font-bold text-foreground">Discover Tools</h1>
                <p className="text-muted-foreground">
                  {loading || allToolsLoading ? 'Loading...' : `${tools.length} tools found`}
                  {useClientSideFiltering && ' (client-side filtering)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
            {(loading || allToolsLoading) && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-2 text-muted-foreground">Loading tools...</span>
              </div>
            )}

            {/* Error State */}
            {error && !useClientSideFiltering && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Failed to load tools from server</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            )}

            {/* Results */}
            {!loading && !allToolsLoading && (
              <>
                {tools.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No tools found matching your criteria</p>
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