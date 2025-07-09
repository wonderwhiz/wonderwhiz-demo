
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component is no longer needed since we're using UnifiedDashboard
const Dashboard = () => {
  return <Navigate to="/" replace />;
};

export default Dashboard;
