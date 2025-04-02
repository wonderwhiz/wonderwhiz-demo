import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CurioPage from '@/pages/CurioPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* This additional route file will be imported into the main App.tsx */}
      <Route path="/curio/:curioId" element={<CurioPage />} />
    </Routes>
  );
};

export default AppRoutes;
