
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowRight, Mail, Key, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ParticleEffect from '@/components/ParticleEffect';

const Authentication = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to profiles
        navigate('/profiles');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) throw error;
      
      toast.success("Account created! Please check your email for verification.", {
        description: "You'll be able to add your child profiles once verified.",
        duration: 6000,
      });
      
      // Navigate to profile creation directly (in a real app, we might wait for email verification)
      navigate('/create-profile');
    } catch (error: any) {
      toast.error("Sign up failed", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Welcome back!", {
        description: "You're now signed in.",
      });
      
      // Navigate to profiles page - this is important
      navigate('/profiles');
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Join WonderWhiz - Where Curiosity Thrives</title>
        <meta name="description" content="Sign up or log in to WonderWhiz and transform your child's screen time into a magical learning journey." />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="medium" />
      
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <WonderWhizLogo className="h-16 animate-float-gentle" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Welcome to WonderWhiz</h1>
          <p className="text-gray-200">Where curiosity comes to life!</p>
        </div>
        
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 bg-white/10">
                <TabsTrigger value="login" className="data-[state=active]:bg-wonderwhiz-purple data-[state=active]:text-white">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-wonderwhiz-purple data-[state=active]:text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input 
                        id="email-login" 
                        placeholder="Email" 
                        type="email" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input 
                        id="password-login" 
                        placeholder="Password" 
                        type="password" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full jelly-button group" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : (
                      <>
                        Log In 
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      id="name" 
                      placeholder="Full Name" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input 
                        id="email-signup" 
                        placeholder="Email" 
                        type="email" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input 
                        id="password-signup" 
                        placeholder="Password" 
                        type="password" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <ul className="text-sm text-white/70 space-y-1">
                      <li className="flex items-center">
                        <Check className="mr-2 h-3 w-3 text-wonderwhiz-pink" />
                        Access to curated learning content
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-3 w-3 text-wonderwhiz-pink" />
                        Manage multiple child profiles
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-3 w-3 text-wonderwhiz-pink" />
                        Track learning progress
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110 text-white font-bold py-2 rounded-full transition-all shadow-lg hover:shadow-wonderwhiz-pink/30 hover:scale-105 active:scale-95" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up Free'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            {/* Content is now moved inside TabsContent components inside the Tabs component */}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 text-center border-t border-white/10 pt-4">
            <p className="text-xs text-white/60">
              By continuing, you agree to the WonderWhiz Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Authentication;
