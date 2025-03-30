
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import About from '@/pages/About';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ProfileSelector from '@/pages/ProfileSelector';
import CreateProfile from '@/pages/CreateProfile';
import Dashboard from '@/pages/Dashboard';
import ParentZone from '@/pages/ParentZone';
import NotFound from '@/pages/NotFound';
import Demo from '@/pages/Demo';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async';
import CurioPage from './pages/CurioPage';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="dark" storageKey="wonderwhiz-theme">
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profiles" element={<ProfileSelector />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/dashboard/:profileId" element={<Dashboard />} />
            <Route path="/curio/:profileId/:curioId" element={<CurioPage />} />
            <Route path="/parent-zone/:profileId" element={<ParentZone />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
