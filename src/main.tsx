
import { createRoot } from 'react-dom/client'
import './index.css'

// Remove lazy loading and Suspense
import App from './App.tsx'

// Remove the LoadingFallback component
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<App />);
