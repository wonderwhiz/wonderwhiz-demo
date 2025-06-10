
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import ImprovedWonderWhizDashboard from '@/components/wonderwhiz/ImprovedWonderWhizDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft } from 'lucide-react';

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
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', childId)
        .single();

      if (error) throw error;
      
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
            <Button
              onClick={() => navigate('/profiles')}
              className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profiles
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink">
      <ImprovedWonderWhizDashboard
        childProfile={childProfile}
        onTopicCreate={handleTopicCreate}
      />
    </div>
  );
};

export default WonderWhiz;
