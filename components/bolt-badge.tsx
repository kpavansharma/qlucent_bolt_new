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
    <div className="fixed top-4 right-4 z-50">
      <Link 
        href="https://bolt.new/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full"
      >
        {isDark ? (
          // White circle badge for dark backgrounds
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 60 60" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg"
          >
            <circle cx="30" cy="30" r="30" fill="white"/>
            <path 
              d="M20 25h8l-4 10h8l-8 15 12-20h-8l4-10h-12z" 
              fill="#000000"
            />
          </svg>
        ) : (
          // Black circle badge for light backgrounds
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 60 60" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg"
          >
            <circle cx="30" cy="30" r="30" fill="#000000"/>
            <path 
              d="M20 25h8l-4 10h8l-8 15 12-20h-8l4-10h-12z" 
              fill="#ffffff"
            />
          </svg>
        )}
      </Link>
    </div>
  );
}