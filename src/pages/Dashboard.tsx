
import React from 'react';
import { Navigate } from 'react-router-dom';

// Legacy redirect to main dashboard
const Dashboard = () => {
  return <Navigate to="/" replace />;
};

export default Dashboard;
