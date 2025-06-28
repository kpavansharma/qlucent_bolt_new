'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap, Users, Star, Clock, ArrowRight, Filter, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bundleService, BundleSearchParams } from '@/lib/services/bundleService';
import { Bundle } from '@/lib/types/api';
import { useApi } from '@/lib/hooks/useApi';
import { Navigation } from '@/components/navigation';
import Link from 'next/link';

const categories = ['All', 'DevOps', 'AI/ML', 'Frontend', 'Backend', 'Monitoring', 'Architecture', 'Data'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Popularity', 'Recently Updated', 'Most Deployed', 'Highest Rated'];

export default function BundlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');
  const [showAICuratedOnly, setShowAICuratedOnly] = useState(false);
  const [allBundles, setAllBundles] = useState<Bundle[]>([]);
  const [filteredBundles, setFilteredBundles] = useState<Bundle[]>([]);
  const [useClientSideFiltering, setUseClientSideFiltering] = useState(false);

  // Build search parameters
  const searchParams: BundleSearchParams = {
    query: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
    aiCurated: showAICuratedOnly || undefined,
    sortBy: sortBy !== 'Popularity' ? sortBy : undefined,
    page: 1,
    limit: 20
  };

  // Fetch all bundles for client-side filtering
  const { data: allBundlesResponse, loading: allBundlesLoading } = useApi(
    () => bundleService.getBundles({ limit: 1000 }),
    []
  );

  // Fetch bundles from backend
  const { data: bundlesResponse, loading, error } = useApi(
    () => bundleService.getBundles(searchParams),
    [searchQuery, selectedCategory, selectedDifficulty, sortBy, showAICuratedOnly]
  );

  // Fetch featured bundles
  const { data: featuredBundles, loading: featuredLoading } = useApi(
    () => bundleService.getFeaturedBundles(),
    []
  );

  // Store all bundles for client-side filtering
  useEffect(() => {
    if (allBundlesResponse?.items) {
      setAllBundles(allBundlesResponse.items);
    }
  }, [allBundlesResponse]);

  // Client-side filtering function
  const filterBundlesClientSide = (bundles: Bundle[]) => {
    let filtered = [...bundles];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bundle => 
        bundle.name.toLowerCase().includes(query) ||
        bundle.description.toLowerCase().includes(query) ||
        (bundle.tags || []).some(tag => tag.toLowerCase().includes(query)) ||
        (bundle.tools || []).some(tool => tool.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(bundle => bundle.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(bundle => bundle.difficulty === selectedDifficulty);
    }

    // Filter by AI curated
    if (showAICuratedOnly) {
      filtered = filtered.filter(bundle => bundle.aiCurated);
    }

    // Sort results
    switch (sortBy) {
      case 'Popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'Recently Updated':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'Most Deployed':
        filtered.sort((a, b) => b.deployments - a.deployments);
        break;
      case 'Highest Rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  };

  // Determine which bundles to display
  useEffect(() => {
    if (useClientSideFiltering && allBundles.length > 0) {
      const filtered = filterBundlesClientSide(allBundles);
      setFilteredBundles(filtered);
    } else if (bundlesResponse?.items) {
      setFilteredBundles(bundlesResponse.items);
    }
  }, [useClientSideFiltering, allBundles, bundlesResponse, searchQuery, selectedCategory, selectedDifficulty, sortBy, showAICuratedOnly]);

  // Check if backend search is working, fallback to client-side
  useEffect(() => {
    if (error && !useClientSideFiltering && allBundles.length > 0) {
      console.log('⚠️ Backend search failed, switching to client-side filtering');
      setUseClientSideFiltering(true);
    }
  }, [error, useClientSideFiltering, allBundles.length]);

  const bundles = filteredBundles;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="bundles" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI-Curated Tool Bundles
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover pre-configured tool combinations optimized for specific use cases. 
            Save time with battle-tested setups curated by AI and the community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search bundles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3"
              />
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 px-8">
              Search Bundles
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={showAICuratedOnly ? 'ai' : 'all'} onValueChange={(value) => setShowAICuratedOnly(value === 'ai')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bundles</SelectItem>
                      <SelectItem value="ai">AI Curated Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Bundles */}
      {featuredBundles && featuredBundles.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Featured Bundles</h2>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Recommended
              </Badge>
            </div>
            
            {featuredLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="ml-2 text-muted-foreground">Loading featured bundles...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredBundles.map((bundle) => (
                  <Card key={bundle.id} className="hover:shadow-lg transition-all duration-300 group border-purple-200 dark:border-purple-800 bg-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                              {bundle.name}
                            </CardTitle>
                            {bundle.aiCurated && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                                AI Curated
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">{bundle.category}</Badge>
                            <Badge className={getDifficultyColor(bundle.difficulty)}>
                              {bundle.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {bundle.rating}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-base text-muted-foreground">
                        {bundle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Included Tools ({(bundle.tools || []).length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {(bundle.tools || []).slice(0, 4).map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {(bundle.tools || []).length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(bundle.tools || []).length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {bundle.deployments}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {bundle.estimatedTime}
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/bundles/${bundle.id}`}>
                            View Bundle
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Bundles */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">All Bundles</h2>
            <p className="text-muted-foreground">
              {loading || allBundlesLoading ? 'Loading...' : `${bundles.length} bundles found`}
              {useClientSideFiltering && ' (client-side filtering)'}
            </p>
          </div>

          {/* Loading State */}
          {(loading || allBundlesLoading) && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-muted-foreground">Loading bundles...</span>
            </div>
          )}

          {/* Error State */}
          {error && !useClientSideFiltering && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Failed to load bundles from server</p>
            </div>
          )}

          {/* Results */}
          {!loading && !allBundlesLoading && (
            <>
              {bundles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No bundles found matching your criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bundles.map((bundle) => (
                    <Card key={bundle.id} className="hover:shadow-lg transition-all duration-300 group bg-card border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                                {bundle.name}
                              </CardTitle>
                              {bundle.aiCurated && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                                  AI Curated
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline">{bundle.category}</Badge>
                              <Badge className={getDifficultyColor(bundle.difficulty)}>
                                {bundle.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {bundle.rating}
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                          {bundle.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-foreground mb-1">Tools ({(bundle.tools || []).length}):</p>
                          <div className="flex flex-wrap gap-1">
                            {(bundle.tools || []).slice(0, 3).map((tool) => (
                              <Badge key={tool} variant="secondary" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                            {(bundle.tools || []).length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{(bundle.tools || []).length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {bundle.deployments}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {bundle.estimatedTime}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/bundles/${bundle.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}