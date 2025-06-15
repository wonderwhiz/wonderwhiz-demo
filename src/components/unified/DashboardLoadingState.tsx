
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
        <Card className="bg-white/15 backdrop-blur-sm border-white/30 p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink"></div>
            <div>
              <h2 className="text-xl font-bold text-white">Loading your adventure...</h2>
              <p className="text-white/90 font-medium">Getting everything ready!</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center">
        <Card className="bg-white/15 backdrop-blur-sm border-white/30 p-8 shadow-xl max-w-md">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Profile not found</h2>
            <p className="text-white/90 mb-4 font-medium">We couldn't find your profile</p>
            <Button 
              onClick={() => navigate('/profiles')} 
              className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white font-semibold"
            >
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
