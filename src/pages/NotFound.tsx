
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { motion } from "framer-motion";
import ParticleEffect from "@/components/ParticleEffect";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Check if this is a curio page with wrong format
    if (location.pathname.includes('/curio/')) {
      // Extract the profileId if possible, to redirect back to dashboard
      const pathParts = location.pathname.split('/');
      if (pathParts.length > 2) {
        const possibleProfileId = pathParts[2];
        if (possibleProfileId && possibleProfileId.length > 10) {
          // After a delay, redirect to dashboard
          const timer = setTimeout(() => {
            navigate(`/dashboard/${possibleProfileId}`);
          }, 3000);
          
          return () => clearTimeout(timer);
        }
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-wonderwhiz-gradient overflow-hidden">
      <Helmet>
        <title>Page Not Found | WonderWhiz - Kids Learning Platform</title>
        <meta name="description" content="Oops! We couldn't find the page you were looking for. Return to WonderWhiz to continue exploring our educational content for children." />
        <meta name="robots" content="noindex, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="medium" />
      
      <div className="text-center p-8 max-w-md relative z-10">
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <WonderWhizLogo className="h-24 w-24" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-2xl text-wonderwhiz-blue mb-6 font-bold">
            Oops! This page has gone on an adventure.
          </p>
          
          {location.pathname.includes('/curio/') && (
            <p className="text-amber-300 mb-6 text-lg">
              We're taking you back to your dashboard in a few seconds...
            </p>
          )}
          
          <p className="text-gray-300 mb-10 text-lg">
            The page you're looking for seems to have wandered off. Let's find something more magical!
          </p>
          
          <div className="flex space-x-4 justify-center">
            <Link to="/">
              <motion.button 
                className="jelly-button inline-block text-lg px-8 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Wonder
              </motion.button>
            </Link>
            
            {location.pathname.includes('/curio/') && (
              <Link to="/profiles">
                <Button
                  variant="outline"
                  className="inline-block text-lg px-8 py-3 bg-transparent border border-white/30 text-white hover:bg-white/10"
                >
                  Choose Profile
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
        
        {/* Animation: floating stars */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-wonderwhiz-gold"
            initial={{
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              opacity: 0
            }}
            animate={{
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100, 
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.5
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
