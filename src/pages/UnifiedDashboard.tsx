
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import SimplifiedDashboard from '@/components/kids/SimplifiedDashboard';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UnifiedDashboard: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [childProfile, setChildProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load child profile
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
      toast.error('Failed to load profile');
      navigate('/profiles');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading || !childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-center">
            <div className="text-8xl mb-4 animate-bounce">🌟</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Getting your magical space ready...
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const handleSearch = async (query: string) => {
    // Create Wonder Whiz topic 
    try {
      const { data: topicResponse, error } = await supabase.functions
        .invoke('generate-wonderwhiz-topic', {
          body: {
            topic: query,
            childAge: childProfile?.age || 10,
            childId
          }
        });

      if (error) throw error;
      
      toast.success('Creating your learning adventure! 📚');
      // Navigate to Wonder Whiz after brief delay
      setTimeout(() => {
        navigate(`/wonderwhiz/${childId}`);
      }, 1000);
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Something went wrong. Try again!');
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`${childProfile?.name}'s Learning Adventure | WonderWhiz`}</title>
        <meta name="description" content="Ask questions, discover amazing facts, and go on learning adventures!" />
      </Helmet>
      
      <SimplifiedDashboard
        childProfile={childProfile}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default UnifiedDashboard;
