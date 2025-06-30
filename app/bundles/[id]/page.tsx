'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Download, Package, Users, Clock, Zap, Heart, Share2, BookOpen, AlertCircle, Loader2, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { bundleService } from '@/lib/services/bundleService';
import { useApi } from '@/lib/hooks/useApi';
import { Bundle, PaginatedResponse } from '@/lib/types/api';
import { Navigation } from '@/components/navigation';

export default function BundleDetailPage() {
  const params = useParams();
  const bundleId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch bundle data from backend
  const { data: bundle, loading, error } = useApi(
    () => bundleService.getBundleById(bundleId),
    [bundleId]
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center bg-card border-border">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Loading Bundle Details</h2>
          <p className="text-muted-foreground">Please wait while we fetch the bundle information...</p>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center bg-card border-border">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Error Loading Bundle</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link href="/bundles">Back to Bundles</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Bundle not found
  if (!bundle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center bg-card border-border">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Bundle Not Found</h2>
          <p className="text-muted-foreground mb-4">The bundle you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/bundles">Back to Bundles</Link>
          </Button>
        </Card>
      </div>
    );
  }

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
      
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/bundles">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Bundles
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-xl font-bold text-foreground">{bundle.name}</span>
                {bundle.aiCurated && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <Award className="w-3 h-3 mr-1" />
                    AI Curated
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className={isFavorited ? 'text-red-600 border-red-600 dark:text-red-400 dark:border-red-400' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                <Link href={`/deploy/bundle/${bundle.id}`}>
                  <Zap className="w-4 h-4 mr-2" />
                  Deploy Bundle
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2 text-foreground">{bundle.name}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {bundle.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="text-sm font-medium">
                      {bundle.category}
                    </Badge>
                    <Badge className={getDifficultyColor(bundle.difficulty)}>
                      {bundle.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {bundle.rating} rating
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {bundle.deployments} deployments
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {bundle.estimatedTime}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Updated {new Date(bundle.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {(bundle.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Bundle Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Use Case</h4>
                        <p className="text-muted-foreground">{bundle.useCase}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Author</h4>
                        <p className="text-muted-foreground">{bundle.author}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Last Updated</h4>
                        <p className="text-muted-foreground">{new Date(bundle.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tools" className="mt-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Included Tools</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {(bundle.tools || []).length} tools in this bundle
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(bundle.tools || []).map((tool, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{tool}</p>
                              <p className="text-sm text-muted-foreground">Tool {index + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="deployment" className="mt-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Deployment Guide</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Follow these steps to deploy this bundle
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Prerequisites</h4>
                            <p className="text-sm text-muted-foreground">Ensure you have the required dependencies installed</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">
                            2
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Configuration</h4>
                            <p className="text-sm text-muted-foreground">Configure the tools according to your environment</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">
                            3
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Deploy</h4>
                            <p className="text-sm text-muted-foreground">Run the deployment commands</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                          <Link href={`/deploy/bundle/${bundle.id}`}>
                            <Zap className="w-4 h-4 mr-2" />
                            Deploy This Bundle
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Bundle Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-foreground">{bundle.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Deployments</span>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    <span className="font-medium text-foreground">{bundle.deployments}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Popularity</span>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="font-medium text-foreground">{bundle.popularity}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Time</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-medium text-foreground">{bundle.estimatedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/deploy/bundle/${bundle.id}`}>
                    <Zap className="w-4 h-4 mr-2" />
                    Deploy Bundle
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Bundle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}