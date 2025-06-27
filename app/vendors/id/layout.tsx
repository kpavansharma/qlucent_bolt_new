import { vendorService } from '@/lib/services/vendorService';
import { Vendor, PaginatedResponse } from '@/lib/types/api';

// Generate static params for all vendors
export async function generateStaticParams() {
  try {
    // Fetch all vendors to generate static paths
    const vendorsResponse: PaginatedResponse<Vendor> = await vendorService.getVendors({ limit: 1000 }); // Set a high limit to get all vendors
    
    // Ensure vendorsResponse.items is an array before mapping
    if (vendorsResponse && Array.isArray(vendorsResponse.items)) {
      return vendorsResponse.items.map((vendor) => ({
        id: vendor.id.toString(),
      }));
    }
    
    // Return empty array if items is not an array
    return [];
  } catch (error) {
    // Return empty array if there's an error fetching vendors
    return [];
  }
}

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 