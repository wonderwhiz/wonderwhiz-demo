
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import WonderWhizDashboard from '@/components/wonderwhiz/WonderWhizDashboard';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { LearningTopic } from '@/types/wonderwhiz';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WonderWhiz = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  
  const {
    childProfile,
    isLoading
  } = useDashboardProfile(profileId);

  const handleTopicCreate = (topic: LearningTopic) => {
    console.log('New topic created:', topic);
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${profileId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>Wonder Whiz Encyclopedia - Interactive Learning</title>
        <meta name="description" content="Explore topics through interactive, age-appropriate encyclopedia content designed by education experts." />
      </Helmet>
      
      {/* Header with back button */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      
      <WonderWhizDashboard 
        childProfile={childProfile}
        onTopicCreate={handleTopicCreate}
      />
    </div>
  );
};

export default WonderWhiz;
