'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Settings, Search, Zap, TrendingUp, Plus, Star, Edit, Trash2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddToolDialog, setShowAddToolDialog] = useState(false);
  const [showCreateBundleDialog, setShowCreateBundleDialog] = useState(false);
  const [userTools, setUserTools] = useState([
    {
      id: 1,
      name: 'Docker',
      category: 'DevOps',
      rating: 5,
      comment: 'Excellent containerization platform. Easy to use and deploy.',
      pros: 'Easy deployment, great documentation, active community',
      cons: 'Can be resource intensive',
      usageContext: 'Production deployment and development environments',
      dateAdded: '2024-01-15'
    },
    {
      id: 2,
      name: 'React',
      category: 'Frontend',
      rating: 4,
      comment: 'Great for building user interfaces, but has a learning curve.',
      pros: 'Component-based, large ecosystem, excellent performance',
      cons: 'Steep learning curve, frequent updates',
      usageContext: 'Web application development',
      dateAdded: '2024-01-10'
    }
  ]);
  const [userBundles, setUserBundles] = useState([
    {
      id: 1,
      name: 'Full Stack Web Development',
      description: 'Complete setup for modern web development',
      tools: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      category: 'Web Development',
      isPublic: true,
      downloads: 45,
      rating: 4.8,
      dateCreated: '2024-01-20'
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleAddTool = (toolData: any) => {
    const newTool = {
      id: userTools.length + 1,
      ...toolData,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setUserTools([...userTools, newTool]);
    setShowAddToolDialog(false);
  };

  const handleCreateBundle = (bundleData: any) => {
    const newBundle = {
      id: userBundles.length + 1,
      ...bundleData,
      downloads: 0,
      rating: 0,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setUserBundles([...userBundles, newBundle]);
    setShowCreateBundleDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Image
              src="/ql_logo.png"
              alt="Qlucent.ai"
              width={32}
              height={32}
              className="w-8 h-8 animate-pulse"
            />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/ql_logo.png"
                alt="Qlucent.ai"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Qlucent.ai
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">{user.user_metadata?.full_name || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Developer'}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your tools, create bundles, and share your expertise with the community.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">My Tools</TabsTrigger>
            <TabsTrigger value="bundles">My Bundles</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tools Reviewed</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userTools.length}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bundles Created</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userBundles.length}</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bundle Downloads</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userBundles.reduce((sum, bundle) => sum + bundle.downloads, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+12 from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(userTools.reduce((sum, tool) => sum + tool.rating, 0) / userTools.length).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Based on your reviews</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link href="/search">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>Discover Tools</CardTitle>
                    <CardDescription>
                      Search through 10,000+ tools with AI-powered recommendations
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link href="/deploy">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle>Deploy Tools</CardTitle>
                    <CardDescription>
                      One-click deployment with pre-configured setups
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link href="/bundles">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Image
                        src="/ql_logo.png"
                        alt="AI Bundles"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <CardTitle>AI Bundles</CardTitle>
                    <CardDescription>
                      Curated tool combinations for specific use cases
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Tools</h2>
                <p className="text-gray-600">Tools you've used and reviewed</p>
              </div>
              <Dialog open={showAddToolDialog} onOpenChange={setShowAddToolDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tool Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Tool Review</DialogTitle>
                    <DialogDescription>
                      Share your experience with a tool to help other developers
                    </DialogDescription>
                  </DialogHeader>
                  <AddToolForm onSubmit={handleAddTool} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{tool.category}</Badge>
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
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-700">{tool.comment}</p>
                    <div>
                      <p className="text-sm font-medium text-green-700">Pros:</p>
                      <p className="text-sm text-gray-600">{tool.pros}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-700">Cons:</p>
                      <p className="text-sm text-gray-600">{tool.cons}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Usage Context:</p>
                      <p className="text-sm text-gray-600">{tool.usageContext}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Added on {new Date(tool.dateAdded).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bundles" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Bundles</h2>
                <p className="text-gray-600">Tool bundles you've created and published</p>
              </div>
              <Dialog open={showCreateBundleDialog} onOpenChange={setShowCreateBundleDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Bundle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Tool Bundle</DialogTitle>
                    <DialogDescription>
                      Create a curated collection of tools for a specific use case
                    </DialogDescription>
                  </DialogHeader>
                  <CreateBundleForm onSubmit={handleCreateBundle} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBundles.map((bundle) => (
                <Card key={bundle.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{bundle.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{bundle.category}</Badge>
                          {bundle.isPublic ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Public
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Private</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-700">{bundle.description}</p>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Tools ({bundle.tools.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {bundle.tools.map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>{bundle.downloads} downloads</span>
                        {bundle.rating > 0 && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {bundle.rating}
                          </div>
                        )}
                      </div>
                      <span>Created {new Date(bundle.dateCreated).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Developer Portfolio</h2>
              <p className="text-gray-600 mb-6">
                Your public portfolio showcasing your tool expertise and contributions
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userTools.length}</div>
                    <div className="text-sm text-gray-600">Tools Reviewed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{userBundles.length}</div>
                    <div className="text-sm text-gray-600">Bundles Created</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {userBundles.reduce((sum, bundle) => sum + bundle.downloads, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Downloads</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(userTools.map(tool => tool.category))).map((category) => (
                      <Badge key={category} variant="outline" className="text-sm">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {userTools.slice(0, 3).map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Reviewed {tool.name}</p>
                          <p className="text-sm text-gray-600">
                            {tool.rating}/5 stars • {new Date(tool.dateAdded).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{tool.category}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/portfolios">View Public Portfolio</Link>
                  </Button>
                  <Button variant="outline">Share Portfolio</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AddToolForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    rating: 5,
    comment: '',
    pros: '',
    cons: '',
    usageContext: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      category: '',
      rating: 5,
      comment: '',
      pros: '',
      cons: '',
      usageContext: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Tool Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="AI/ML">AI/ML</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Monitoring">Monitoring</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Star</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="comment">Overall Comment</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Share your overall experience with this tool..."
          required
        />
      </div>

      <div>
        <Label htmlFor="pros">Pros</Label>
        <Textarea
          id="pros"
          value={formData.pros}
          onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
          placeholder="What are the main advantages of this tool?"
          required
        />
      </div>

      <div>
        <Label htmlFor="cons">Cons</Label>
        <Textarea
          id="cons"
          value={formData.cons}
          onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
          placeholder="What are the main disadvantages or limitations?"
          required
        />
      </div>

      <div>
        <Label htmlFor="usageContext">Usage Context</Label>
        <Textarea
          id="usageContext"
          value={formData.usageContext}
          onChange={(e) => setFormData({ ...formData, usageContext: e.target.value })}
          placeholder="In what context did you use this tool? (e.g., production, development, specific project type)"
          required
        />
      </div>

      <Button type="submit" className="w-full">Add Tool Review</Button>
    </form>
  );
}

function CreateBundleForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tools: '',
    isPublic: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const toolsArray = formData.tools.split(',').map(tool => tool.trim()).filter(tool => tool);
    onSubmit({
      ...formData,
      tools: toolsArray
    });
    setFormData({
      name: '',
      description: '',
      category: '',
      tools: '',
      isPublic: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="bundleName">Bundle Name</Label>
        <Input
          id="bundleName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Modern Web Development Stack"
          required
        />
      </div>

      <div>
        <Label htmlFor="bundleDescription">Description</Label>
        <Textarea
          id="bundleDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this bundle is for and who should use it..."
          required
        />
      </div>

      <div>
        <Label htmlFor="bundleCategory">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
            <SelectItem value="Mobile Development">Mobile Development</SelectItem>
            <SelectItem value="AI/ML">AI/ML</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Monitoring">Monitoring</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="bundleTools">Tools (comma-separated)</Label>
        <Textarea
          id="bundleTools"
          value={formData.tools}
          onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
          placeholder="React, Node.js, PostgreSQL, Docker, etc."
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
        />
        <Label htmlFor="isPublic">Make this bundle public</Label>
      </div>

      <Button type="submit" className="w-full">Create Bundle</Button>
    </form>
  );
}