import { bundleService } from '@/lib/services/bundleService';
import { Bundle, PaginatedResponse } from '@/lib/types/api';

// Generate static params for all bundles
export async function generateStaticParams() {
  try {
    // Fetch all bundles to generate static paths
    const bundlesResponse: PaginatedResponse<Bundle> = await bundleService.getBundles({ limit: 1000 }); // Set a high limit to get all bundles
    
    return bundlesResponse.items.map((bundle) => ({
      id: bundle.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
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