
import React from 'react';
import StreamlinedDashboard from './StreamlinedDashboard';

interface ImprovedWonderWhizDashboardProps {
  childProfile: any;
  onTopicCreate: (topic: any) => void;
}

const ImprovedWonderWhizDashboard: React.FC<ImprovedWonderWhizDashboardProps> = (props) => {
  return <StreamlinedDashboard {...props} />;
};

export default ImprovedWonderWhizDashboard;
