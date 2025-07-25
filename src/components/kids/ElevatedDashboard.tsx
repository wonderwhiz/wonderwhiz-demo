import React from 'react';
import FreshMobileDashboard from './FreshMobileDashboard';

interface ElevatedDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
}

const ElevatedDashboard: React.FC<ElevatedDashboardProps> = (props) => {
  return <FreshMobileDashboard {...props} />;
};

export default ElevatedDashboard;