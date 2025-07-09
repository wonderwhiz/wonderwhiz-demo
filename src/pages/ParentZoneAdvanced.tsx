import React from 'react';
import { useParams } from 'react-router-dom';
import ParentDashboard from '@/components/dashboard/ParentDashboard';
import { useAuth } from '@/hooks/useAuth';

const ParentZone: React.FC = () => {
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

  return <ParentDashboard parentId={user.id} />;
};

export default ParentZone;