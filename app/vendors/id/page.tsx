"use client";

import { useParams } from "next/navigation";
import { useApi } from "@/lib/hooks/useApi";
import { vendorService } from "@/lib/services/vendorService";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Users, Briefcase, MapPin, Award, Loader2, AlertCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { useState } from "react";

export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = params.id as string;
  const [isContacting, setIsContacting] = useState(false);

  const { data: vendor, loading, error } = useApi(
    () => vendorService.getVendorById(vendorId),
    [vendorId]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center bg-card border-border">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Loading Vendor Details</h2>
          <p className="text-muted-foreground">Please wait while we fetch the vendor information...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center bg-card border-border">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Error Loading Vendor</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link href="/vendors">Back to Vendors</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center bg-card border-border">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Vendor Not Found</h2>
          <p className="text-muted-foreground mb-4">The vendor you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/vendors">Back to Vendors</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="vendors" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vendors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vendors
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="w-12 h-12">
              <AvatarImage src={vendor.logo} alt={vendor.name} />
              <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-lg font-bold">
                {vendor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-2xl font-bold text-foreground">{vendor.name}</span>
            {vendor.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                Verified
              </Badge>
            )}
            {vendor.featured && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                <Award className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl mb-2 text-foreground">{vendor.name}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {vendor.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {vendor.rating} ({vendor.reviews} reviews)
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {vendor.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {vendor.teamSize} team
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {vendor.projects} projects
              </div>
              <div className="flex items-center gap-1">
                <span>Founded:</span>
                <span>{vendor.founded}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Success Rate:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">{vendor.successRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-1">
                {(vendor.specialties || []).map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Services:</p>
              <div className="flex flex-wrap gap-1">
                {(vendor.services || []).map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" disabled={isContacting} onClick={() => setIsContacting(true)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                {isContacting ? "Contacting..." : "Contact Vendor"}
              </Button>
              <Button asChild size="sm">
                <Link href="/vendors">Back to Vendors</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 