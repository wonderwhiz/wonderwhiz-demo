import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Settings, Menu, X, Star, Heart } from 'lucide-react';
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
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Keyboard: Close menu when Tab/Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Trap focus inside when open
  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isOpen]);

  const menuItems = [
    {
      label: 'Home',
      path: `/dashboard/${childId}`,
      icon: Home,
      emoji: '🏠',
      color: 'from-wonderwhiz-vibrant-yellow to-orange-400',
      description: 'Back to your adventure hub!',
      ariaLabel: 'Go to Home Dashboard'
    },
    {
      label: 'Encyclopedia',
      path: `/wonderwhiz/${childId}`,
      icon: BookOpen,
      emoji: '📚',
      color: 'from-wonderwhiz-bright-pink to-purple-500',
      description: 'Deep dive into topics you love!',
      ariaLabel: 'Go to Encyclopedia'
    },
    {
      label: 'Profiles',
      path: '/profiles',
      icon: Settings,
      emoji: '👥',
      color: 'from-green-400 to-emerald-500',
      description: 'Switch between profiles',
      ariaLabel: 'Switch Profiles'
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
    <div 
      className={cn("fixed bottom-6 right-6 z-50", className)}
      ref={menuRef}
      tabIndex={isOpen ? 0 : -1}
      aria-label="Main Navigation for Children"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      role="menu"
    >
      {/* Main Menu Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
          className={cn(
            "h-16 w-16 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple shadow-xl border-4 border-white/20 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-wonderwhiz-bright-pink focus-visible:outline-none focus-visible:ring-offset-2",
            isOpen && "ring-4 ring-wonderwhiz-vibrant-yellow"
          )}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 space-y-3 outline-none bg-white/90 rounded-3xl px-2 pt-2 pb-2 shadow-2xl z-40"
            tabIndex={0}
            aria-label="Menu Items"
            role="menu"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 20 }}
                transition={{
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                role="menuitem"
                aria-current={isActive(item.path) ? "page" : undefined}
                tabIndex={0}
              >
                <Button
                  onClick={() => handleItemClick(item.path)}
                  aria-label={item.ariaLabel}
                  className={cn(
                    "h-14 px-4 rounded-2xl shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-wonderwhiz-bright-pink focus-visible:outline-none focus-visible:ring-offset-2 bg-gradient-to-r group",
                    item.color,
                    isActive(item.path) && "ring-4 ring-wonderwhiz-vibrant-yellow scale-105 font-bold text-gray-900 shadow-2xl"
                  )}
                  tabIndex={0}
                  role="menuitem"
                  title={item.label}
                >
                  <div className="flex items-center gap-3 truncate">
                    <motion.span
                      animate={{ scale: [1, 1.18, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-lg"
                    >
                      {item.emoji}
                    </motion.span>
                    <item.icon className="h-5 w-5 text-white drop-shadow filter" />
                    <div className="text-left min-w-[80px] max-w-[120px] truncate">
                      <div className="text-sm font-bold truncate">{item.label}</div>
                      <div className="text-xs text-gray-700/80 group-hover:text-black group-focus:text-black">{item.description}</div>
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
