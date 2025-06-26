'use client';

import { useState } from 'react';
import { Search, Star, MapPin, Users, Briefcase, Award, Filter, Calendar, ExternalLink, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { vendorService, VendorSearchParams } from '@/lib/services/vendorService';
import { Vendor } from '@/lib/types/api';
import { useApi } from '@/lib/hooks/useApi';
import Link from 'next/link';

const specialties = ['All', 'Kubernetes', 'Machine Learning', 'Security', 'Frontend', 'Data Engineering', 'Monitoring'];
const services = ['All', 'Consulting', 'Training', 'Implementation', 'Support', 'Development'];
const teamSizes = ['All', '1-5', '5-15', '15-30', '30+'];

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedTeamSize, setSelectedTeamSize] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Build search parameters
  const searchParams: VendorSearchParams = {
    query: searchQuery || undefined,
    specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
    service: selectedService !== 'All' ? selectedService : undefined,
    teamSize: selectedTeamSize !== 'All' ? selectedTeamSize : undefined,
    verified: showVerifiedOnly || undefined,
    sortBy: sortBy !== 'rating' ? sortBy : undefined,
    page: 1,
    limit: 20
  };

  // Fetch vendors from backend
  const { data: vendorsResponse, loading, error } = useApi(
    () => vendorService.getVendors(searchParams),
    [searchQuery, selectedSpecialty, selectedService, selectedTeamSize, sortBy, showVerifiedOnly]
  );

  // Fetch featured vendors
  const { data: featuredVendors, loading: featuredLoading, error: featuredError } = useApi(
    () => vendorService.getFeaturedVendors(),
    []
  );

  const vendors = vendorsResponse?.items || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
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
              <Link href="/vendors" className="text-purple-600 font-medium">
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
            Find Expert Vendors & Consultants
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with verified experts who can help you implement, optimize, and maintain your tech stack. 
            From consulting to training, find the right partner for your project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search vendors, specialties, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3"
              />
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 px-8">
              Find Vendors
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      {featuredVendors && featuredVendors.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Vendors</h2>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Award className="w-3 h-3 mr-1" />
                Top Rated
              </Badge>
            </div>
            
            {featuredLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading featured vendors...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredVendors.map((vendor) => (
                  <Card key={vendor.id} className="hover:shadow-lg transition-all duration-300 group border-purple-200">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={vendor.logo} alt={vendor.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-bold">
                            {vendor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                              {vendor.name}
                            </CardTitle>
                            {vendor.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {vendor.rating} ({vendor.reviews} reviews)
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {vendor.location}
                            </div>
                          </div>
                          <CardDescription className="text-sm">
                            {vendor.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {vendor.specialties.slice(0, 4).map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {vendor.specialties.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{vendor.specialties.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Team Size:</span>
                          <div className="font-medium">{vendor.teamSize}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Response Time:</span>
                          <div className="font-medium">{vendor.responseTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Projects:</span>
                          <div className="font-medium">{vendor.projects}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Success Rate:</span>
                          <div className="font-medium text-green-600">{vendor.successRate}%</div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1" asChild>
                          <Link href={`/vendors/${vendor.id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button variant="outline" className="px-4">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact
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
                    <label className="text-sm font-medium mb-2 block">Specialty</label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Service Type</label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service} value={service}>{service}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Team Size</label>
                    <Select value={selectedTeamSize} onValueChange={setSelectedTeamSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="verified-only"
                      checked={showVerifiedOnly}
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="verified-only" className="text-sm">Verified Only</label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Vendors</h2>
                  <p className="text-gray-600">
                    {loading ? 'Loading...' : `${vendorsResponse?.total || 0} vendors found`}
                  </p>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="projects">Most Projects</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">Loading vendors...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card className="p-12 text-center">
                  <div className="text-red-400 mb-4">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading vendors</h3>
                    <p className="text-gray-600">{error}</p>
                  </div>
                </Card>
              )}

              {/* Results */}
              {!loading && !error && (
                <>
                  {vendors.length === 0 ? (
                    <Card className="p-12 text-center">
                      <div className="text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {vendors.map((vendor) => (
                        <Card key={vendor.id} className="hover:shadow-lg transition-all duration-300 group">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={vendor.logo} alt={vendor.name} />
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-bold">
                                  {vendor.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold group-hover:text-purple-600 transition-colors">
                                      {vendor.name}
                                    </h3>
                                    {vendor.verified && (
                                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-purple-600">{vendor.pricing}</div>
                                    <div className="text-sm text-gray-500">Response: {vendor.responseTime}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    {vendor.rating} ({vendor.reviews} reviews)
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {vendor.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {vendor.teamSize} team
                                  </div>
                                  <div className="flex items-center">
                                    <Briefcase className="w-4 h-4 mr-1" />
                                    {vendor.projects} projects
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 mb-4">{vendor.description}</p>
                                
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {vendor.specialties.map((specialty) => (
                                      <Badge key={specialty} variant="secondary" className="text-xs">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {vendor.services.map((service) => (
                                      <Badge key={service} variant="outline" className="text-xs">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div>Success Rate: <span className="font-medium text-green-600">{vendor.successRate}%</span></div>
                                    <div>Founded: <span className="font-medium">{vendor.founded}</span></div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      Contact
                                    </Button>
                                    <Button size="sm" asChild>
                                      <Link href={`/vendors/${vendor.id}`}>
                                        View Profile
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
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