
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home, BookOpen, Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

interface SmartBreadcrumbsProps {
  childId: string;
  currentTopic?: string;
  currentSection?: string;
  onBack?: () => void;
  className?: string;
}

const SmartBreadcrumbs: React.FC<SmartBreadcrumbsProps> = ({
  childId,
  currentTopic,
  currentSection,
  onBack,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        path: `/dashboard/${childId}`,
        icon: Home
      }
    ];

    if (location.pathname.includes('/wonderwhiz')) {
      items.push({
        label: 'Encyclopedia',
        path: `/wonderwhiz/${childId}`,
        icon: BookOpen
      });

      if (currentTopic) {
        items.push({
          label: currentTopic.length > 30 ? `${currentTopic.substring(0, 27)}...` : currentTopic,
          path: location.pathname,
          icon: Compass,
          isActive: true
        });

        if (currentSection) {
          items.push({
            label: currentSection.length > 20 ? `${currentSection.substring(0, 17)}...` : currentSection,
            path: location.pathname,
            isActive: true
          });
        }
      }
    } else if (location.pathname.includes('/curio')) {
      items.push({
        label: 'Learning Session',
        path: location.pathname,
        icon: Sparkles,
        isActive: true
      });
    }

    return items;
  }, [childId, location.pathname, currentTopic, currentSection]);

  const handleNavigate = (path: string, isActive?: boolean) => {
    if (!isActive) {
      navigate(path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 py-2 px-4 bg-white/5 backdrop-blur-sm rounded-lg",
        className
      )}
    >
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1 h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          <button
            onClick={() => handleNavigate(item.path, item.isActive)}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors rounded px-2 py-1",
              item.isActive
                ? "text-white font-medium cursor-default"
                : "text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            )}
            disabled={item.isActive}
          >
            {item.icon && (
              <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
            )}
            <span className="truncate">{item.label}</span>
          </button>

          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-3 w-3 text-white/40 flex-shrink-0" />
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default SmartBreadcrumbs;
