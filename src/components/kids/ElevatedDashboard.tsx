import React from 'react';
import WonderHub from './WonderHub';

interface ElevatedDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
}

const ElevatedDashboard: React.FC<ElevatedDashboardProps> = (props) => {
  return <WonderHub {...props} />;
};

export default ElevatedDashboard;
