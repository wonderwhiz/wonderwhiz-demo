
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, BookOpen, Compass, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MagicalBreadcrumbsProps {
  childId: string;
  currentTopic?: string;
  onBack?: () => void;
  className?: string;
}

const MagicalBreadcrumbs: React.FC<MagicalBreadcrumbsProps> = ({
  childId,
  currentTopic,
  onBack,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const crumbs = [
      {
        label: 'Home',
        path: `/dashboard/${childId}`,
        icon: Home,
        color: 'text-wonderwhiz-vibrant-yellow',
        emoji: '🏠'
      }
    ];

    if (location.pathname.includes('/wonderwhiz')) {
      crumbs.push({
        label: 'Encyclopedia',
        path: `/wonderwhiz/${childId}`,
        icon: BookOpen,
        color: 'text-wonderwhiz-bright-pink',
        emoji: '📚'
      });

      if (currentTopic) {
        crumbs.push({
          label: currentTopic.length > 25 ? `${currentTopic.substring(0, 22)}...` : currentTopic,
          path: location.pathname,
          icon: Compass,
          color: 'text-wonderwhiz-purple',
          emoji: '🔍',
          isActive: true
        });
      }
    } else if (location.pathname.includes('/curio')) {
      crumbs.push({
        label: 'Adventure',
        path: location.pathname,
        icon: Sparkles,
        color: 'text-wonderwhiz-bright-pink',
        emoji: '✨',
        isActive: true
      });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-lg",
        className
      )}
    >
      <AnimatePresence>
        {breadcrumbs.map((crumb, index) => (
          <motion.div
            key={crumb.path}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => !crumb.isActive && navigate(crumb.path)}
              className={cn(
                "flex items-center gap-2 text-sm transition-all duration-300 rounded-full px-3 py-2",
                crumb.isActive
                  ? "text-white font-bold bg-white/20 cursor-default"
                  : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-105"
              )}
              disabled={crumb.isActive}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-base"
              >
                {crumb.emoji}
              </motion.span>
              <crumb.icon className={cn("h-4 w-4", crumb.color)} />
              <span>{crumb.label}</span>
              {crumb.isActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Star className="h-3 w-3 text-wonderwhiz-vibrant-yellow" />
                </motion.div>
              )}
            </Button>

            {index < breadcrumbs.length - 1 && (
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="h-4 w-4 text-white/40" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default MagicalBreadcrumbs;
