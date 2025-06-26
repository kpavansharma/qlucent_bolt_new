import { toolService } from '@/lib/services/toolService';
import { Tool, PaginatedResponse } from '@/lib/types/api';

// Generate static params for all tools
export async function generateStaticParams() {
  try {
    // Fetch all tools to generate static paths
    const toolsResponse: PaginatedResponse<Tool> = await toolService.getTools({ limit: 1000 }); // Set a high limit to get all tools
    
    return toolsResponse.items.map((tool) => ({
      id: tool.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array if there's an error fetching tools
    return [];
  }
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}