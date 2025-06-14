
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Sparkles, Settings, Menu, X, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FloatingKidsMenuProps {
  childId: string;
  className?: string;
}

const FloatingKidsMenu: React.FC<FloatingKidsMenuProps> = ({
  childId,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Home',
      path: `/dashboard/${childId}`,
      icon: Home,
      emoji: '🏠',
      color: 'from-wonderwhiz-vibrant-yellow to-orange-400',
      description: 'Back to your adventure hub!'
    },
    {
      label: 'Encyclopedia',
      path: `/wonderwhiz/${childId}`,
      icon: BookOpen,
      emoji: '📚',
      color: 'from-wonderwhiz-bright-pink to-purple-500',
      description: 'Deep dive into topics you love!'
    },
    {
      label: 'Quick Explore',
      path: `/dashboard/${childId}`,
      icon: Sparkles,
      emoji: '✨',
      color: 'from-wonderwhiz-purple to-blue-500',
      description: 'Fast facts and fun discoveries!'
    },
    {
      label: 'Profiles',
      path: '/profiles',
      icon: Settings,
      emoji: '👥',
      color: 'from-green-400 to-emerald-500',
      description: 'Switch between profiles'
    }
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path.includes('/dashboard') && location.pathname.includes('/dashboard')) ||
           (path.includes('/wonderwhiz') && location.pathname.includes('/wonderwhiz'));
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Main Menu Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple shadow-xl border-4 border-white/20 backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Menu className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 20 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              >
                <Button
                  onClick={() => handleItemClick(item.path)}
                  className={cn(
                    "h-14 px-4 rounded-2xl shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-300",
                    `bg-gradient-to-r ${item.color}`,
                    isActive(item.path) && "ring-4 ring-white/30 scale-105"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-lg"
                    >
                      {item.emoji}
                    </motion.span>
                    <item.icon className="h-5 w-5 text-white" />
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-xs text-white/80">{item.description}</div>
                    </div>
                    {isActive(item.path) && (
                      <motion.div
                        animate={{ rotate: [0, 180, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
                      </motion.div>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cute floating hearts when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-10 -left-10 pointer-events-none"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                className="absolute"
                style={{
                  left: `${i * 15}px`,
                  top: `${i * 10}px`
                }}
              >
                <Heart className="h-4 w-4 text-wonderwhiz-bright-pink opacity-60" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingKidsMenu;
