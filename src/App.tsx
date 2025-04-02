
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CurioPage from '@/pages/CurioPage';
import Dashboard from '@/pages/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/curio/:curioId" element={<CurioPage />} />
      <Route path="/dashboard/:profileId" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
