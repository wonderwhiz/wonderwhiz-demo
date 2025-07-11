import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfile } from '@/hooks/use-child-profile';
import { LearningTopic } from '@/types/wonderwhiz';
import { Button } from '@/components/ui/button';
import KidsLoadingState from '@/components/kids/KidsLoadingState';
import ElevatedStreamlinedDashboard from '@/components/wonderwhiz/ElevatedStreamlinedDashboard';

const WonderWhiz = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { childProfile, isLoading: isLoadingProfile } = useChildProfile(childId);
  const [currentTopic, setCurrentTopic] = useState<LearningTopic | null>(null);

  // Redirect if no user or childId
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!childId) {
      navigate('/profiles');
      return;
    }
  }, [user, childId, navigate]);

  // Loading state
  if (isLoadingProfile || !childProfile) {
    return <KidsLoadingState message="Loading Wonder Encyclopedia..." emoji="📚" />;
  }

  const handleTopicCreate = async (topic: LearningTopic) => {
    setCurrentTopic(topic);
    toast.success(`Created encyclopedia for: ${topic.title}`);
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Helmet>
        <title>{`Wonder Encyclopedia - ${childProfile?.name} | WonderWhiz`}</title>
        <meta name="description" content="Explore amazing topics and learn with WonderWhiz Encyclopedia!" />
      </Helmet>

      {/* Main Content */}
      <div className="flex-1">
        <ElevatedStreamlinedDashboard
          childProfile={childProfile}
          onTopicCreate={handleTopicCreate}
        />
      </div>
    </div>
  );
};

export default WonderWhiz;