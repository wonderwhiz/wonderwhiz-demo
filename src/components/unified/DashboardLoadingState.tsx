
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardLoadingStateProps {
  isLoading: boolean;
  childProfile: any;
}

const DashboardLoadingState: React.FC<DashboardLoadingStateProps> = ({ isLoading, childProfile }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink"></div>
            <div>
              <h2 className="text-xl font-bold text-white">Loading your adventure...</h2>
              <p className="text-white/70">Getting everything ready!</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Profile not found</h2>
            <Button onClick={() => navigate('/profiles')} className="bg-wonderwhiz-bright-pink">
              Back to Profiles
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default DashboardLoadingState;

