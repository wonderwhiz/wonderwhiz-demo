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
import StreamlinedDashboard from '@/components/wonderwhiz/StreamlinedDashboard';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      <Helmet>
        <title>{`Wonder Encyclopedia - ${childProfile?.name} | WonderWhiz`}</title>
        <meta name="description" content="Explore amazing topics and learn with WonderWhiz Encyclopedia!" />
      </Helmet>

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Wonder Encyclopedia</h1>
                <p className="text-white/70 text-sm">Discover amazing topics, {childProfile?.name}!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <StreamlinedDashboard
          childProfile={childProfile}
          onTopicCreate={handleTopicCreate}
        />
      </div>
    </div>
  );
};

export default WonderWhiz;