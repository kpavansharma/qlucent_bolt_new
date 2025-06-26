'use client';

import { useState } from 'react';
import { Sparkles, Zap, Users, Star, Clock, ArrowRight, Filter, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bundleService, BundleSearchParams } from '@/lib/services/bundleService';
import { Bundle } from '@/lib/types/api';
import { useApi } from '@/lib/hooks/useApi';
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

  const bundles = bundlesResponse?.items || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                Discover
              </Link>
              <Link href="/bundles" className="text-purple-600 font-medium">
                Bundles
              </Link>
              <Link href="/vendors" className="text-gray-600 hover:text-gray-900 transition-colors">
                Vendors
              </Link>
              <Link href="/deploy" className="text-gray-600 hover:text-gray-900 transition-colors">
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
            AI-Curated Tool Bundles
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover pre-configured tool combinations optimized for specific use cases. 
            Save time with battle-tested setups curated by AI and the community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

      {/* Featured Bundles */}
      {featuredBundles && featuredBundles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Bundles</h2>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Recommended
              </Badge>
            </div>
            
            {featuredLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading featured bundles...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredBundles.map((bundle) => (
                  <Card key={bundle.id} className="hover:shadow-lg transition-all duration-300 group border-purple-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                              {bundle.name}
                            </CardTitle>
                            {bundle.aiCurated && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
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
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {bundle.rating}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {bundle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Included Tools ({(bundle.tools || []).length}):</p>
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
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
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
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1" asChild>
                          <Link href={`/bundles/${bundle.id}`}>
                            View Bundle
                          </Link>
                        </Button>
                        <Button variant="outline" className="px-4" asChild>
                          <Link href={`/deploy/bundle/${bundle.id}`}>
                            <Zap className="w-4 h-4" />
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

      {/* Filters and Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <label className="text-sm font-medium mb-2 block">Category</label>
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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ai-curated"
                      checked={showAICuratedOnly}
                      onChange={(e) => setShowAICuratedOnly(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="ai-curated" className="text-sm">AI Curated Only</label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Bundles</h2>
                  <p className="text-gray-600">
                    {loading ? 'Loading...' : `${bundlesResponse?.total || 0} bundles found`}
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

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">Loading bundles...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card className="p-12 text-center">
                  <div className="text-red-400 mb-4">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bundles</h3>
                    <p className="text-gray-600">{error}</p>
                  </div>
                </Card>
              )}

              {/* Results */}
              {!loading && !error && (
                <>
                  {bundles.length === 0 ? (
                    <Card className="p-12 text-center">
                      <div className="text-gray-400">
                        <Sparkles className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bundles found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {bundles.map((bundle) => (
                        <Card key={bundle.id} className="hover:shadow-lg transition-all duration-300 group">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                                    {bundle.name}
                                  </CardTitle>
                                  {bundle.aiCurated && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      AI
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">{bundle.category}</Badge>
                                  <Badge className={`text-xs ${getDifficultyColor(bundle.difficulty)}`}>
                                    {bundle.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Star className="w-4 h-4" />
                                  {bundle.rating}
                                </div>
                              </div>
                            </div>
                            <CardDescription className="text-sm leading-relaxed">
                              {bundle.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Tools ({(bundle.tools || []).length}):</p>
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
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
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
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button size="sm" className="flex-1" asChild>
                                <Link href={`/bundles/${bundle.id}`}>
                                  View Details
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" className="px-3" asChild>
                                <Link href={`/deploy/bundle/${bundle.id}`}>
                                  <Zap className="w-4 h-4" />
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
          </div>
        </div>
      </section>
    </div>
  );
}