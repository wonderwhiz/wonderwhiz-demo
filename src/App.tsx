
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfileSelector from "./pages/ProfileSelector";
import CreateProfile from "./pages/CreateProfile";
import ParentZone from "./pages/ParentZone";
import WonderWhiz from "./pages/WonderWhiz";
import Authentication from "./pages/Authentication";
import Demo from "./pages/Demo";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth" element={<Authentication />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/profiles" element={
                  <ProtectedRoute>
                    <ProfileSelector />
                  </ProtectedRoute>
                } />
                <Route path="/select-profile" element={
                  <ProtectedRoute>
                    <ProfileSelector />
                  </ProtectedRoute>
                } />
                <Route path="/create-profile" element={
                  <ProtectedRoute>
                    <CreateProfile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ProfileSelector />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/:profileId" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/wonderwhiz/:profileId" element={
                  <ProtectedRoute>
                    <WonderWhiz />
                  </ProtectedRoute>
                } />
                <Route path="/parent-zone" element={
                  <ProtectedRoute>
                    <ParentZone />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
