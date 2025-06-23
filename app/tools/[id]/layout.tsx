import { toolData } from '@/lib/tool-data';

export async function generateStaticParams() {
  // Return all possible tool IDs for static generation
  return Object.keys(toolData).map((id) => ({
    id: id,
  }));
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}