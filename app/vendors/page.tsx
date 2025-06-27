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
import { Navigation } from '@/components/navigation';
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

  // Get featured vendors from the main vendors list (first 4)
  const { data: featuredVendorsResponse, loading: featuredLoading, error: featuredError } = useApi(
    () => vendorService.getVendors({ limit: 4, sortBy: 'rating' }),
    []
  );

  const vendors = vendorsResponse?.items || [];
  const featuredVendors = featuredVendorsResponse?.items || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="vendors" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Expert Vendors & Consultants
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with verified experts who can help you implement, optimize, and maintain your tech stack. 
            From consulting to training, find the right partner for your project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
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
      {!featuredError && featuredVendors && featuredVendors.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Featured Vendors</h2>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Award className="w-3 h-3 mr-1" />
                Top Rated
              </Badge>
            </div>
            
            {featuredLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="ml-2 text-muted-foreground">Loading featured vendors...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredVendors.map((vendor) => (
                  <Card key={vendor.id} className="hover:shadow-lg transition-all duration-300 group border-purple-200 bg-background">
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
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {vendor.rating} ({vendor.reviews} reviews)
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {vendor.location}
                            </div>
                          </div>
                          <CardDescription className="text-sm text-muted-foreground">
                            {vendor.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {(vendor.specialties || []).slice(0, 4).map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {(vendor.specialties || []).length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(vendor.specialties || []).length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Team Size:</span>
                          <div className="font-medium text-foreground">{vendor.teamSize}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Response Time:</span>
                          <div className="font-medium text-foreground">{vendor.responseTime}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Projects:</span>
                          <div className="font-medium text-foreground">{vendor.projects}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success Rate:</span>
                          <div className="font-medium text-green-600">{vendor.successRate}%</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/vendors/${vendor.id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="px-3">
                          <MessageCircle className="w-4 h-4" />
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

      {/* All Vendors */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-64 space-y-6">
              <Card className="bg-background border-border">
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
                    <label className="text-sm font-medium mb-2 block">Service</label>
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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="projects">Most Projects</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">All Vendors</h2>
                  <p className="text-muted-foreground">
                    {loading ? 'Loading...' : `${vendorsResponse?.total || 0} vendors found`}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-muted-foreground">Loading vendors...</span>
                </div>
              ) : error ? (
                <Card className="p-12 text-center bg-background border-border">
                  <div className="text-red-400 mb-4">
                    <h3 className="text-lg font-medium text-foreground mb-2">Error loading vendors</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                  </div>
                </Card>
              ) : vendors.length === 0 ? (
                <Card className="p-12 text-center bg-background border-border">
                  <div className="text-muted-foreground">
                    <h3 className="text-lg font-medium text-foreground mb-2">No vendors found</h3>
                    <p>Try adjusting your search criteria or filters</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendors.map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-lg transition-all duration-300 group bg-background border-border">
                      <CardHeader>
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={vendor.logo} alt={vendor.name} />
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-bold">
                              {vendor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                                {vendor.name}
                              </CardTitle>
                              {vendor.verified && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {vendor.rating}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {vendor.location}
                              </div>
                            </div>
                            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                              {vendor.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-foreground mb-1">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {(vendor.specialties || []).slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {(vendor.specialties || []).length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{(vendor.specialties || []).length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {vendor.teamSize}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-3 h-3 mr-1" />
                              {vendor.projects}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/vendors/${vendor.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}