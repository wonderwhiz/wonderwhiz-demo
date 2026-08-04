import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated! You are signed in.');
      navigate('/profiles');
    } catch (error: any) {
      toast.error('Could not update password', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col items-center justify-center p-6">
      <Helmet>
        <title>Reset Password | WonderWhiz</title>
        <meta name="description" content="Choose a new password for your WonderWhiz parent account." />
      </Helmet>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <WonderWhizLogo className="h-14 mx-auto" />
          <h1 className="text-3xl font-bold mt-4 text-white">Set a new password</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          {!ready && (
            <p className="text-sm text-white/70 mb-4">
              Open this page from the reset link in your email. If you already did, give it a second.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-4 w-4" />
              <Input
                type="password"
                placeholder="New password"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-4 w-4" />
              <Input
                type="password"
                placeholder="Confirm new password"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90">
              {isLoading ? 'Updating...' : 'Update password'}
            </Button>
          </form>
          <Link to="/login" className="block mt-4 text-center text-sm text-white/70 hover:text-white">
            Back to sign in
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
