import { toolService } from '@/lib/services/toolService';

// Generate static params for all tools
export async function generateStaticParams() {
  try {
    // Fetch all tools to generate static paths
    const tools = await toolService.getTools({ limit: 1000 }); // Set a high limit to get all tools
    
    return tools.map((tool) => ({
      id: tool.id,
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