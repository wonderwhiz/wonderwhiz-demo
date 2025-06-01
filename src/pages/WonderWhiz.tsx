
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import WonderWhizDashboard from '@/components/wonderwhiz/WonderWhizDashboard';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { LearningTopic } from '@/types/wonderwhiz';

const WonderWhiz = () => {
  const { profileId } = useParams<{ profileId: string }>();
  
  const {
    childProfile,
    isLoading
  } = useDashboardProfile(profileId);

  const handleTopicCreate = (topic: LearningTopic) => {
    console.log('New topic created:', topic);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Wonder Whiz Encyclopedia - Interactive Learning</title>
        <meta name="description" content="Explore topics through interactive, age-appropriate encyclopedia content designed by education experts." />
      </Helmet>
      
      <WonderWhizDashboard 
        childProfile={childProfile}
        onTopicCreate={handleTopicCreate}
      />
    </div>
  );
};

export default WonderWhiz;
