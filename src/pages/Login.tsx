import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ParticleEffect from '@/components/ParticleEffect';
import { ArrowLeft, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AuthErrorMessage from '@/components/auth/AuthErrorMessage';
import {
  mapPasswordResetError,
  mapSignInError,
  mapSignUpError,
  type AuthFormError,
} from '@/lib/authErrors';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<AuthFormError | null>(null);
  const [signupError, setSignupError] = useState<AuthFormError | null>(null);
  const [activeTab, setActiveTab] = useState(
    window.location.pathname === '/register' ? 'signup' : 'login'
  );

  const switchTab = (tab: string) => {
    setLoginError(null);
    setSignupError(null);
    setActiveTab(tab);
  };

  // Preserve `next` (e.g. OAuth consent URL) across sign-in / sign-up.
  const rawNext = new URLSearchParams(window.location.search).get('next');
  const nextPath = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null;
  const postAuthTarget = nextPath ?? '/profiles';

  const handleForgotPassword = async () => {
    if (!email) {
      setLoginError({
        title: 'Enter your email first',
        detail: 'Type the email you signed up with, then tap "Forgot password?" again.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setLoginError(null);
      toast.success('Reset link sent', { description: 'Check your inbox to set a new password.' });
    } catch (error: any) {
      setLoginError(mapPasswordResetError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/profiles` },
      });
      if (error) throw error;
      setLoginError(null);
      toast.success('Confirmation email sent', { description: 'Check your inbox.' });
    } catch (error: any) {
      setLoginError(mapPasswordResetError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email || !password) {
      setLoginError({ title: 'Please fill in both email and password' });
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await signIn(email, password);

      if (!user) {
        throw new Error('Login failed, please try again.');
      }

      toast.success('Welcome back!', { description: "You're now signed in." });
      navigate(postAuthTarget);
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(mapSignInError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!email || !password || !name) {
      setSignupError({ title: 'Please fill in your name, email and password' });
      return;
    }

    setIsLoading(true);

    try {
      const { session } = await signUp(email, password, name);
      if (session) {
        toast.success('Welcome to WonderWhiz!');
        navigate(postAuthTarget);
      } else {
        toast.success('Account created!', {
          description: 'Check your email to confirm, then sign in.',
          duration: 5000,
        });
        switchTab('login');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setSignupError(mapSignUpError(error));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col">
      <Helmet>
        <title>Login to WonderWhiz | Access Your Child's Learning Journey</title>
        <meta name="description" content="Sign in to WonderWhiz to access your child's personalized learning dashboard and track their educational progress." />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="low" />
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center relative z-10">
        <Link to="/" className="flex items-center">
          <WonderWhizLogo className="h-12" />
          <span className="ml-3 text-xl font-baloo font-bold text-white">WonderWhiz</span>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-4"
            >
              <WonderWhizLogo className="h-16 mx-auto" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Welcome Back!</h1>
            <p className="text-gray-200">Continue your learning adventure</p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-white/10">
                <TabsTrigger value="login" className="data-[state=active]:bg-wonderwhiz-purple data-[state=active]:text-white">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
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
                        type="email" 
                        placeholder="Email" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="w-full text-center text-sm text-white/70 hover:text-white underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
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
                        type="email" 
                        placeholder="Email" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;