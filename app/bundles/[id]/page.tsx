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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Loading Bundle Details</h2>
          <p className="text-gray-600">Please wait while we fetch the bundle information...</p>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Bundle</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Bundle Not Found</h2>
          <p className="text-gray-600 mb-4">The bundle you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/bundles">Back to Bundles</Link>
          </Button>
        </Card>
      </div>
    );
  }

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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">{bundle.name}</span>
                {bundle.aiCurated && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
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
                className={isFavorited ? 'text-red-600 border-red-600' : ''}
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
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{bundle.name}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
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
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4">
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
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Use Case</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{bundle.useCase}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Bundle Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Category:</span>
                            <div className="font-medium">{bundle.category}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
                            <div className="font-medium">{bundle.difficulty}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Estimated Time:</span>
                            <div className="font-medium">{bundle.estimatedTime}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Author:</span>
                            <div className="font-medium">{bundle.author}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-sm font-medium text-gray-700">AI Curated:</span>
                          {bundle.aiCurated ? (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              <Award className="w-3 h-3 mr-1" />
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                              No
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Included Tools ({(bundle.tools || []).length})</CardTitle>
                      <CardDescription>
                        This bundle includes the following tools and technologies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(bundle.tools || []).map((tool, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{tool}</div>
                              <div className="text-sm text-gray-500">Tool #{index + 1}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="deployment" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Deployment Guide</CardTitle>
                        <CardDescription>
                          Follow these steps to deploy this bundle
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              1
                            </div>
                            <div>
                              <h4 className="font-medium">Prepare Your Environment</h4>
                              <p className="text-sm text-gray-600">Ensure you have the necessary prerequisites installed</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              2
                            </div>
                            <div>
                              <h4 className="font-medium">Configure Tools</h4>
                              <p className="text-sm text-gray-600">Set up each tool according to the bundle specifications</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              3
                            </div>
                            <div>
                              <h4 className="font-medium">Deploy & Test</h4>
                              <p className="text-sm text-gray-600">Deploy the bundle and verify everything works correctly</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Estimated Deployment Time</h4>
                          <p className="text-blue-800">{bundle.estimatedTime}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Deploy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">
                          Use our one-click deployment to get this bundle running quickly
                        </p>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                          <Link href={`/deploy/bundle/${bundle.id}`}>
                            <Zap className="w-4 h-4 mr-2" />
                            Deploy Now
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg" asChild>
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
                  <Download className="w-4 h-4 mr-2" />
                  Download Config
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bundle Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className="font-medium">{bundle.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployments:</span>
                  <span className="font-medium">{bundle.deployments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Popularity:</span>
                  <span className="font-medium">{bundle.popularity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date(bundle.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Featured:</span>
                  {bundle.featured ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      No
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Author:</span>
                  <span className="font-medium">{bundle.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tools Count:</span>
                  <span className="font-medium">{bundle.tools.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="outline">{bundle.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}