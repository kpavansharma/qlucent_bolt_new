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

  // Build search parameters
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

  // Fetch tools from backend
  const { data: toolsResponse, loading, error, refetch } = useApi(
    () => toolService.getTools(toolSearchParams),
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

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg group-hover:text-purple-600 transition-colors flex items-center gap-2">
            <Link href={`/tools/${tool.id}`} className="hover:underline">
              {tool.name}
            </Link>
            {tool.verified && <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
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
        <CardDescription className="text-sm leading-relaxed">
          {tool.description}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
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
          <div className="text-xs text-gray-400">
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
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold hover:text-purple-600 transition-colors">
                <Link href={`/tools/${tool.id}`} className="hover:underline">
                  {tool.name}
                </Link>
              </h3>
              {tool.verified && <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
              <Badge variant="outline" className="text-xs">{tool.aiScore}% AI Match</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{tool.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </Link>
            
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <label htmlFor="search-input" className="sr-only">Search tools, frameworks, or describe your needs</label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="search-input"
                  name="search"
                  type="text"
                  placeholder="Search tools, frameworks, or describe your needs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500"
                />
              </div>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="category-select" className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="license-select" className="text-sm font-medium mb-2 block">License</label>
                  <Select value={selectedLicense} onValueChange={setSelectedLicense}>
                    <SelectTrigger id="license-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {licenses.map(license => (
                        <SelectItem key={license} value={license}>{license}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="stars-slider" className="text-sm font-medium mb-2 block">
                    Minimum Stars: {minStars[0]}k+
                  </label>
                  <Slider
                    id="stars-slider"
                    value={minStars}
                    onValueChange={setMinStars}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={showVerifiedOnly}
                      onCheckedChange={setShowVerifiedOnly}
                    />
                    <label htmlFor="verified" className="text-sm">Verified Only</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="deployment"
                      checked={showDeploymentReady}
                      onCheckedChange={setShowDeploymentReady}
                    />
                    <label htmlFor="deployment" className="text-sm">Deployment Ready</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                <p className="text-gray-600">
                  {loading ? 'Searching...' : `Found ${toolsResponse?.total || 0} tools`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="ai-score">AI Score</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading tools...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="p-12 text-center">
                <div className="text-red-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tools</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={refetch}>Try Again</Button>
                </div>
              </Card>
            )}

            {/* No Results */}
            {!loading && !error && tools.length === 0 && (
              <Card className="p-12 text-center">
                <div className="text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              </Card>
            )}

            {/* Results Grid/List */}
            {!loading && !error && tools.length > 0 && (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {tools.map((tool) => (
                    viewMode === 'grid' 
                      ? <ToolCard key={tool.id} tool={tool} />
                      : <ToolListItem key={tool.id} tool={tool} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}