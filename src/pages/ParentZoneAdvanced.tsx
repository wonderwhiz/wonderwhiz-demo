import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const ParentZoneAdvanced: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to access the Parent Zone.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Parent Zone</h1>
        <p>Coming Soon - Advanced parent features</p>
      </div>
    </div>
  );
};

export default ParentZoneAdvanced;