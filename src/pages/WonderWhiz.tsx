
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import InstantWonderWhiz from '@/components/wonderwhiz/InstantWonderWhiz';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft } from 'lucide-react';
import MagicalBreadcrumbs from '@/components/navigation/MagicalBreadcrumbs';
import FloatingKidsMenu from '@/components/navigation/FloatingKidsMenu';

const WonderWhiz: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [childProfile, setChildProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!childId) {
      navigate('/profiles');
      return;
    }

    loadChildProfile();
  }, [user, childId, navigate]);

  const loadChildProfile = async () => {
    if (!childId) return;

    try {
      setIsLoading(true);
      console.log('Loading child profile for WonderWhiz:', childId);
      
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', childId)
        .single();

      if (error) {
        console.error('Error loading child profile:', error);
        throw error;
      }
      
      console.log('Child profile loaded:', data);
      setChildProfile(data);
    } catch (error) {
      console.error('Error loading child profile:', error);
      setError('Failed to load child profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicCreate = (topic: any) => {
    console.log('Topic created:', topic);
    // Refresh or handle new topic creation
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-wonderwhiz-bright-pink animate-pulse" />
            <div>
              <h2 className="text-xl font-bold text-white">Loading Wonder Whiz...</h2>
              <p className="text-white/70">Preparing your encyclopedia experience</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center p-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 max-w-md">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-white/70 mb-4">
              {error || 'Child profile not found'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleBackToDashboard}
                className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/profiles')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                All Profiles
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <InstantWonderWhiz childId={childId!} />
  );
};

export default WonderWhiz;
