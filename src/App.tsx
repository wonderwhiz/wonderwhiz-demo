
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
              <title>WonderWhiz - Personalized Learning for Curious Kids</title>
              <meta name="description" content="WonderWhiz provides personalized, age-appropriate learning experiences that spark curiosity and make education fun for children of all ages." />
              <meta name="keywords" content="children education, personalized learning, STEM education, curiosity-driven learning, interactive education" />
            </Helmet>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profiles" element={<ProfileSelector />} />
              <Route path="/dashboard/:childId" element={<UnifiedDashboard />} />
              <Route path="/legacy-dashboard/:childId" element={<Dashboard />} />
              <Route path="/wonderwhiz/:childId" element={<WonderWhiz />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster 
              position="bottom-right" 
              expand={true}
              richColors
              closeButton
            />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
