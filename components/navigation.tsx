'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X, User, LogOut, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavigationProps {
  currentPage?: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  // Get user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isActive = (page: string) => currentPage === page;

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-white rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              {!logoError ? (
                <Image
                  src="/ql_logo.png"
                  alt="Qlucent.ai"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                  priority
                />
              ) : (
                <Zap className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Qlucent.ai
            </span>
          </Link>
          
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link 
              href="/search" 
              className={`transition-colors ${
                isActive('search') 
                  ? 'text-purple-600 font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Discover
            </Link>
            <Link 
              href="/bundles" 
              className={`transition-colors ${
                isActive('bundles') 
                  ? 'text-purple-600 font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bundles
            </Link>
            <Link 
              href="/vendors" 
              className={`transition-colors ${
                isActive('vendors') 
                  ? 'text-purple-600 font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Vendors
            </Link>
            <Link 
              href="/deploy" 
              className={`transition-colors ${
                isActive('deploy') 
                  ? 'text-purple-600 font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Deploy
            </Link>
            <Link 
              href="/portfolios" 
              className={`transition-colors ${
                isActive('portfolios') 
                  ? 'text-purple-600 font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Portfolios
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/search" 
                className={`transition-colors ${
                  isActive('search') 
                    ? 'text-purple-600 font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Discover
              </Link>
              <Link 
                href="/bundles" 
                className={`transition-colors ${
                  isActive('bundles') 
                    ? 'text-purple-600 font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Bundles
              </Link>
              <Link 
                href="/vendors" 
                className={`transition-colors ${
                  isActive('vendors') 
                    ? 'text-purple-600 font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Vendors
              </Link>
              <Link 
                href="/deploy" 
                className={`transition-colors ${
                  isActive('deploy') 
                    ? 'text-purple-600 font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Deploy
              </Link>
              <Link 
                href="/portfolios" 
                className={`transition-colors ${
                  isActive('portfolios') 
                    ? 'text-purple-600 font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Portfolios
              </Link>
              
              <div className="pt-4 border-t">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth">
                      <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/auth">
                      <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}