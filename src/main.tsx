
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'
import { Loader2 } from 'lucide-react'

// Lazy load the App component for faster initial load
const App = lazy(() => import('./App.tsx'))

const LoadingFallback = () => (
  <div className="min-h-screen bg-wonderwhiz-gradient flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 text-wonderwhiz-gold animate-spin" />
      <p className="text-white font-medium">Loading WonderWhiz magic...</p>
    </div>
  </div>
)

// Add default OG meta tags to ensure they're always present
const addDefaultOgTags = () => {
  // Only add if not already present
  if (!document.querySelector('meta[property="og:image"]')) {
    const ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', 'https://wonderwhiz.lovable.app/wonderwhiz-og.png');
    document.head.appendChild(ogImage);
  }
  
  if (!document.querySelector('meta[name="twitter:image"]')) {
    const twitterImage = document.createElement('meta');
    twitterImage.setAttribute('name', 'twitter:image');
    twitterImage.setAttribute('content', 'https://wonderwhiz.lovable.app/wonderwhiz-og.png');
    document.head.appendChild(twitterImage);
  }
};

// Add default OG tags
addDefaultOgTags();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <Suspense fallback={<LoadingFallback />}>
    <App />
  </Suspense>
);
