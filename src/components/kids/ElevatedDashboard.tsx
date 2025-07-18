import React from 'react';
import MobileResponsiveDashboard from './MobileResponsiveDashboard';

interface ElevatedDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
}

const ElevatedDashboard: React.FC<ElevatedDashboardProps> = (props) => {
  return <MobileResponsiveDashboard {...props} />;
};

export default ElevatedDashboard;