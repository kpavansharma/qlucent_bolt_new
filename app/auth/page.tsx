'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Github, Eye, EyeOff, ArrowLeft, Database, Cloud, Code, Zap, Shield, Monitor, Server, Cpu, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const [slideDirection, setSlideDirection] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleTabChange = (value: string) => {
    setSlideDirection(value === 'signin' ? 'slide-right' : 'slide-left');
    setTimeout(() => {
      setActiveTab(value);
      setSlideDirection('');
    }, 150);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error with Google auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error with GitHub auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (isSignUp: boolean) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex relative overflow-hidden">
      {/* Floating Tech Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* React Icon */}
        <div className="absolute top-20 left-16 w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
          <Code className="w-8 h-8 text-cyan-600" />
        </div>
        
        {/* TypeScript Icon */}
        <div className="absolute top-32 right-20 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
          <Database className="w-6 h-6 text-blue-600" />
        </div>
        
        {/* Node.js Icon */}
        <div className="absolute top-60 left-8 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
          <Server className="w-5 h-5 text-green-600" />
        </div>
        
        {/* JavaScript Icon */}
        <div className="absolute bottom-40 left-20 w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
          <Zap className="w-7 h-7 text-yellow-600" />
        </div>
        
        {/* CSS Icon */}
        <div className="absolute bottom-20 left-40 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
          <Shield className="w-4 h-4 text-orange-600" />
        </div>
        
        {/* Cloud Icon */}
        <div className="absolute top-40 left-1/3 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center animate-float" style={{ animationDelay: '2.5s' }}>
          <Cloud className="w-6 h-6 text-purple-600" />
        </div>
        
        {/* Figma Icon */}
        <div className="absolute bottom-60 right-16 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '3s' }}>
          <Monitor className="w-5 h-5 text-pink-600" />
        </div>
        
        {/* Git Icon */}
        <div className="absolute top-80 left-1/4 w-6 h-6 bg-red-100 rounded-md flex items-center justify-center animate-float" style={{ animationDelay: '0.8s' }}>
          <Github className="w-3 h-3 text-red-600" />
        </div>
        
        {/* Additional floating icons */}
        <div className="absolute bottom-32 right-32 w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: '1.8s' }}>
          <Cpu className="w-8 h-8 text-indigo-600" />
        </div>
        
        <div className="absolute top-16 right-1/3 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center animate-float" style={{ animationDelay: '2.2s' }}>
          <Globe className="w-4 h-4 text-teal-600" />
        </div>
        
        <div className="absolute bottom-16 left-1/2 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center animate-float" style={{ animationDelay: '3.5s' }}>
          <Lock className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* Left Side - Qlucent AI Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Qlucent AI
            </h3>
            <p className="text-gray-600 text-xl max-w-md mx-auto leading-relaxed">
              AI-powered tool discovery and deployment platform for modern developers
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-sm">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Qlucent AI
            </h3>
            <p className="text-gray-600">AI-powered tool discovery and deployment</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {activeTab === 'signin' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {activeTab === 'signin' ? 'Sign in to your account' : 'Join thousands of developers using Qlucent AI'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="transition-all">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="transition-all">Sign Up</TabsTrigger>
                </TabsList>
                
                <div className={`transition-all duration-300 ${slideDirection === 'slide-left' ? '-translate-x-full opacity-0' : slideDirection === 'slide-right' ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                  <TabsContent value="signin" className="space-y-4 mt-0">
                    {/* Google Auth Button with actual logo */}
                    <Button
                      variant="outline"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full h-11 border-2 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Login with Google
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleGithubAuth}
                      disabled={isLoading}
                      className="w-full h-11 border-2 hover:bg-gray-50 mb-4"
                    >
                      <Github className="w-5 h-5 mr-3" />
                      Continue with GitHub
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="signin-email" className="text-sm">Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-10"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="signin-password" className="text-sm">Password <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleEmailAuth(false)}
                        disabled={isLoading || !email || !password}
                        className="w-full h-10 bg-gray-800 hover:bg-gray-900 text-white"
                      >
                        {isLoading ? 'Signing in...' : 'Sign in →'}
                      </Button>

                      <div className="text-center">
                        <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4 mt-0">
                    {/* Google Auth Button with actual logo */}
                    <Button
                      variant="outline"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full h-11 border-2 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign up with Google
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleGithubAuth}
                      disabled={isLoading}
                      className="w-full h-11 border-2 hover:bg-gray-50 mb-4"
                    >
                      <Github className="w-5 h-5 mr-3" />
                      Continue with GitHub
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="signup-email" className="text-sm">Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-10"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="signup-password" className="text-sm">Password <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleEmailAuth(true)}
                        disabled={isLoading || !email || !password}
                        className="w-full h-10 bg-gray-800 hover:bg-gray-900 text-white"
                      >
                        {isLoading ? 'Creating account...' : 'Create account →'}
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="mt-4 text-center text-xs text-gray-600">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-purple-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <Link href="/support" className="text-purple-600 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}