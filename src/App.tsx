
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import ProfileSelector from '@/pages/ProfileSelector';
import Dashboard from '@/pages/Dashboard';
import UnifiedDashboard from '@/pages/UnifiedDashboard';
import WonderWhiz from '@/pages/WonderWhiz';
import ParentZone from '@/pages/ParentZone';
import ProtectedRoute from '@/components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Helmet>
              <title>WonderWhiz - The World's Best AI App for Kids! 🌟</title>
              <meta name="description" content="WonderWhiz provides the most intuitive, magical, and engaging personalized learning experiences that spark curiosity and make education incredibly fun for children of all ages." />
              <meta name="keywords" content="best kids AI app, children education, personalized learning, STEM education, curiosity-driven learning, interactive education, magical learning experience" />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profiles" element={
                  <ProtectedRoute>
                    <ProfileSelector />
                  </ProtectedRoute>
                } />
                <Route path="/parent-zone" element={
                  <ProtectedRoute>
                    <ParentZone />
                  </ProtectedRoute>
                } />
                <Route path="/parent-zone/:profileId" element={
                  <ProtectedRoute>
                    <ParentZone />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/:childId" element={<UnifiedDashboard />} />
                <Route path="/legacy-dashboard/:childId" element={<Dashboard />} />
                <Route path="/wonderwhiz/:childId" element={<WonderWhiz />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Toaster 
              position="bottom-left" 
              expand={true}
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 192, 203, 0.3)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }
              }}
            />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
