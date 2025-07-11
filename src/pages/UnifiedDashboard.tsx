
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import ElevatedDashboard from '@/components/kids/ElevatedDashboard';
import KidsLoadingState from '@/components/kids/KidsLoadingState';
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
    return <KidsLoadingState />;
  }

  const handleSearch = async (query: string) => {
    // Just show a mock response for now - the real content creation happens in WonderWhiz
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`${childProfile?.name}'s Learning Adventure | WonderWhiz`}</title>
        <meta name="description" content="Ask questions, discover amazing facts, and go on learning adventures!" />
      </Helmet>
      
      <ElevatedDashboard
        childProfile={childProfile}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default UnifiedDashboard;
