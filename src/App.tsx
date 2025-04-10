
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from 'react-helmet-async';
import React from 'react'; // Add explicit React import
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import Authentication from "./pages/Authentication";
import CreateProfile from "./pages/CreateProfile";
import ProfileSelector from "./pages/ProfileSelector";
import Dashboard from "./pages/Dashboard";
import ParentZone from "./pages/ParentZone";
import CurioPage from "./pages/CurioPage";
import EnhancedCurioPage from '@/components/curio/EnhancedCurioPage';
import SimplifiedCurioPage from '@/components/curio/SimplifiedCurioPage';

// Import the spark animations CSS
import './components/sparkAnimations.css';

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Create a new helmetContext
const helmetContext = {};

// Define custom cursor styles
const CustomCursorStyles = () => (
  <style>
    {`
    @keyframes cursor-pulse {
      0% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 0.7; }
    }
    
    .magic-cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background: #FF5EBA;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: cursor-pulse 2s infinite;
      box-shadow: 0 0 10px rgba(255, 94, 186, 0.6);
      mix-blend-mode: screen;
    }
    
    .magic-cursor-outline {
      position: fixed;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(255, 94, 186, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, border-color 0.2s;
      mix-blend-mode: exclusion;
    }
    
    .magic-cursor-outline.hover {
      width: 60px;
      height: 60px;
      border-color: rgba(255, 199, 44, 0.7);
    }
    
    .magic-cursor-active {
      cursor: none !important;
    }
    
    /* Only show custom cursor on desktop */
    @media (max-width: 768px) {
      .magic-cursor-dot, .magic-cursor-outline {
        display: none;
      }
    }
    
    /* Floating particles */
    .floating-particle {
      position: fixed;
      border-radius: 50%;
      z-index: 1;
      pointer-events: none;
      opacity: 0.7;
      animation: floatParticle 15s linear infinite;
    }
    
    @keyframes floatParticle {
      0% {
        transform: translateY(100vh) translateX(0) rotate(0deg);
      }
      
      100% {
        transform: translateY(-100px) translateX(var(--rand-x)) rotate(360deg);
      }
    }
    
    @keyframes sparkleRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .spotlight-hover {
      position: relative;
    }
    
    .spotlight-hover::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle 400px at var(--cursor-x) var(--cursor-y),
        rgba(126, 48, 225, 0.1),
        transparent 40%
      );
      pointer-events: none;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .spotlight-hover:hover::before {
      opacity: 1;
    }
    
    .award-badge {
      position: fixed;
      top: 90px;
      right: 20px;
      background: linear-gradient(90deg, #FFE883 0%, #FFC72C 100%);
      padding: 5px 10px;
      border-radius: 20px;
      z-index: 50;
      box-shadow: 0 4px 10px rgba(255, 199, 44, 0.4);
      transform: rotate(5deg);
    }
    
    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }
    
    .animate-pop {
      animation: pop 0.5s ease-out;
    }
    
    /* Responsive improvements */
    @media (max-width: 640px) {
      .award-badge {
        top: auto;
        bottom: 20px;
        right: 20px;
        padding: 3px 8px;
        font-size: 0.75rem;
      }
    }
    `}
  </style>
);

// App component with proper viewport setup for mobile
const App = () => {
  // Set proper viewport meta tag for all pages
  React.useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    } else {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Add touch-friendly class to body
    document.body.classList.add('touch-friendly');
    
    return () => {
      document.body.classList.remove('touch-friendly');
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider context={helmetContext}>
        <TooltipProvider>
          <BrowserRouter>
            <Helmet>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#000000" />
              <meta name="description" content="WonderWhiz - AI-powered educational platform for kids" />
            </Helmet>
            <Toaster />
            <Sonner />
            <CustomCursorStyles />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Authentication />} />
              <Route path="/register" element={<Authentication />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/profiles" element={<ProfileSelector />} />
              <Route path="/dashboard/:profileId" element={<Dashboard />} />
              <Route path="/parent-zone/:profileId" element={<ParentZone />} />
              <Route path="/curio/:childId/:curioId" element={<EnhancedCurioPage />} />
              <Route path="/simple-curio/:childId/:curioId" element={<SimplifiedCurioPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
