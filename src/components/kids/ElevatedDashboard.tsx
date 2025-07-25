import React from 'react';
import ModernDashboard from './ModernDashboard';

interface ElevatedDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
}

const ElevatedDashboard: React.FC<ElevatedDashboardProps> = (props) => {
  return <ModernDashboard {...props} />;
};

export default ElevatedDashboard;