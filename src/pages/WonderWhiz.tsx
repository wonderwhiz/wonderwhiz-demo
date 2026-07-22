import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfile } from '@/hooks/use-child-profile';
import KidsLoadingState from '@/components/kids/KidsLoadingState';
import WonderCanvas from '@/components/wonderwhiz/WonderCanvas';

const WonderWhiz = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { childProfile, isLoading } = useChildProfile(childId);

  useEffect(() => {
    if (!user) navigate('/login');
    else if (!childId) navigate('/profiles');
  }, [user, childId, navigate]);

  if (isLoading || !childProfile) {
    return <KidsLoadingState message="Loading Wonder…" emoji="📚" />;
  }

  return (
    <>
      <Helmet>
        <title>{`Wonder — ${childProfile.name} | WonderWhiz`}</title>
        <meta name="description" content="Ask anything. Learn deeply. A curiosity engine designed for kids." />
      </Helmet>
      <WonderCanvas
        childProfile={childProfile}
        onBack={() => navigate('/profiles')}
      />
    </>
  );
};

export default WonderWhiz;
