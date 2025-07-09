
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser } from '@/hooks/use-user';
import { useUnifiedDashboard } from '@/hooks/useUnifiedDashboard';
import MagicalDashboard from '@/components/kids/MagicalDashboard';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Home } from 'lucide-react';

const Dashboard = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    childProfile,
    isLoadingProfile,
    handleUnifiedSearch
  } = useUnifiedDashboard();

  // Redirect if no user
  React.useEffect(() => {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-center">
            <div className="text-8xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Getting your magical space ready...
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderwhiz-cyan"></div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const handleSearch = async (query: string) => {
    await handleUnifiedSearch(query);
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`${childProfile?.name}'s Learning Adventure | WonderWhiz`}</title>
        <meta name="description" content="Ask questions, discover amazing facts, and go on learning adventures!" />
      </Helmet>
      
      <MagicalDashboard
        childProfile={childProfile}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default Dashboard;
