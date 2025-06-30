'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Download, Github, ExternalLink, Shield, Zap, Heart, Share2, BookOpen, Users, GitBranch, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toolService } from '@/lib/services/toolService';
import { useApi } from '@/lib/hooks/useApi';
import { Tool, PaginatedResponse } from '@/lib/types/api';

export default function ToolDetailPage() {
  const params = useParams();
  const toolId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch tool data from backend
  const { data: tool, loading, error } = useApi(
    () => toolService.getToolById(toolId),
    [toolId]
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Loading Tool Details</h2>
          <p className="text-gray-600">Please wait while we fetch the tool information...</p>
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
          <h2 className="text-xl font-semibold mb-2">Error Loading Tool</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link href="/search">Back to Search</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Tool not found
  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
          <p className="text-gray-600 mb-4">The tool you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/search">Back to Search</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 font-bold text-sm">{tool.name.charAt(0)}</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{tool.name}</span>
                {tool.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
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
              {tool.deploymentReady && (
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                  <Link href={`/deploy/${tool.id}`}>
                    <Zap className="w-4 h-4 mr-2" />
                    Deploy Now
                  </Link>
                </Button>
              )}
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
                    <CardTitle className="text-2xl mb-2">{tool.name}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm font-medium">
                    {tool.aiScore}% AI Match
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {(tool.stars / 1000).toFixed(1)}k stars
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {tool.downloads} downloads
                  </div>
                  <div className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-1" />
                    {tool.license}
                  </div>
                  <div>
                    Updated {new Date(tool.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="installation">Installation</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    {tool.features && tool.features.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Key Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tool.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {tool.useCases && tool.useCases.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Use Cases</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {tool.useCases.map((useCase, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">{useCase}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {tool.similarTools && tool.similarTools.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Similar Tools</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {tool.similarTools.map((similar, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{similar.name}</span>
                                <Badge variant="outline">{similar.similarity}% similar</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tool.languages && tool.languages.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Programming Languages</h4>
                          <div className="flex flex-wrap gap-2">
                            {tool.languages.map(lang => (
                              <Badge key={lang} variant="outline">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {tool.compatibility && tool.compatibility.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Platform Compatibility</h4>
                          <div className="flex flex-wrap gap-2">
                            {tool.compatibility.map(platform => (
                              <Badge key={platform} variant="secondary">{platform}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {tool.requirements && (
                        <div>
                          <h4 className="font-medium mb-2">System Requirements</h4>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div><strong>Memory:</strong> {tool.requirements.memory}</div>
                            <div><strong>Storage:</strong> {tool.requirements.storage}</div>
                            <div><strong>OS:</strong> {tool.requirements.os}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="installation" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Installation Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-3">Quick Install</h4>
                          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                            # Install {tool.name}<br/>
                            # Please refer to the official documentation for installation instructions<br/>
                            # Visit: {tool.documentation || tool.website || tool.github}
                          </div>
                        </div>
                        
                        {tool.versions && tool.versions.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-3">Available Versions</h4>
                            <div className="space-y-2">
                              {tool.versions.map(version => (
                                <div key={version} className="flex items-center justify-between p-2 border rounded">
                                  <span>{version}</span>
                                  <Badge variant="outline">Stable</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="support" className="mt-6">
                  <div className="space-y-6">
                    {tool.support && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Support Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Community Support</h4>
                            <p className="text-sm text-gray-600">{tool.support.community}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Documentation</h4>
                            <p className="text-sm text-gray-600">{tool.support.documentation}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Training</h4>
                            <p className="text-sm text-gray-600">{tool.support.training}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Enterprise Support</h4>
                            <p className="text-sm text-gray-600">{tool.support.enterprise}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {tool.pricing && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                              <div className="font-medium">Personal</div>
                              <div className="text-lg font-bold text-green-600">{tool.pricing.personal}</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <div className="font-medium">Pro</div>
                              <div className="text-lg font-bold">{tool.pricing.pro}</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <div className="font-medium">Team</div>
                              <div className="text-lg font-bold">{tool.pricing.team}</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <div className="font-medium">Business</div>
                              <div className="text-lg font-bold">{tool.pricing.business}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
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
                {tool.deploymentReady && (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/deploy/${tool.id}`}>
                      <Zap className="w-4 h-4 mr-2" />
                      Deploy Now
                    </Link>
                  </Button>
                )}
                {tool.github && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={tool.github} target="_blank">
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </Link>
                  </Button>
                )}
                {tool.documentation && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={tool.documentation} target="_blank">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Documentation
                    </Link>
                  </Button>
                )}
                {tool.website && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={tool.website} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Official Website
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tool Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="outline">{tool.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License:</span>
                  <span>{tool.license}</span>
                </div>
                {tool.fileSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span>{tool.fileSize}</span>
                  </div>
                )}
                {tool.maintainers && tool.maintainers.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maintainer:</span>
                    <span>{tool.maintainers[0]}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Deployment Ready:</span>
                  {tool.deploymentReady ? (
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
                  <span className="text-gray-600">GitHub Stars:</span>
                  <span className="font-medium">{(tool.stars / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="font-medium">{tool.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>{new Date(tool.lastUpdated).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}