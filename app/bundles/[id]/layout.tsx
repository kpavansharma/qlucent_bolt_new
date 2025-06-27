import { bundleService } from '@/lib/services/bundleService';
import { Bundle, PaginatedResponse } from '@/lib/types/api';

// Generate static params for all bundles
export async function generateStaticParams() {
  try {
    // Fetch all bundles to generate static paths
    const bundlesResponse: PaginatedResponse<Bundle> = await bundleService.getBundles({ limit: 1000 }); // Set a high limit to get all bundles
    
    // Ensure bundlesResponse.items is an array before mapping
    if (bundlesResponse && Array.isArray(bundlesResponse.items)) {
      return bundlesResponse.items.map((bundle) => ({
        id: bundle.id.toString(),
      }));
    }
    
    // Return empty array if items is not an array
    return [];
  } catch (error) {
    // Return empty array if there's an error fetching bundles
    return [];
  }
}

export default function BundleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}