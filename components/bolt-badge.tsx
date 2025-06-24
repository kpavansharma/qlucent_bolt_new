'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function BoltBadge() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Determine which badge to show based on theme
  const isDark = resolvedTheme === 'dark';
  
  return (
    <div className="fixed top-[4.5rem] right-4 z-50">
      <Link 
        href="https://bolt.new/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full"
      >
        {isDark ? (
          // White circle badge for dark backgrounds
          <img 
            src="/white_circle_360x360.svg"
            alt="Built with Bolt"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg"
          />
        ) : (
          // Black circle badge for light backgrounds
          <img 
            src="/black_circle_360x360.svg"
            alt="Built with Bolt"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg"
          />
        )}
      </Link>
    </div>
  );
}