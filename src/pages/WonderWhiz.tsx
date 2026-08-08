import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfile } from '@/hooks/use-child-profile';
import KidsLoadingState from '@/components/kids/KidsLoadingState';
import CurioCanvas from '@/components/curio-adventure/CurioCanvas';

const WonderWhiz = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { childProfile, isLoading } = useChildProfile(childId);
  const [params] = useSearchParams();
  const initialQuestion = params.get('q') || undefined;

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
      <CurioCanvas
        childProfile={childProfile}
        initialQuestion={initialQuestion}
        onBack={() => navigate(`/dashboard/${childId}`)}
      />
    </>
  );
};

export default WonderWhiz;
