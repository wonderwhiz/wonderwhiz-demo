
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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <Suspense fallback={<LoadingFallback />}>
    <App />
  </Suspense>
);
