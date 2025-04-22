
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '@/components/ui/breadcrumb';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

interface ExplorationBreadcrumbProps {
  paths: {title: string, id?: string}[];
  profileId: string;
  onPathClick?: (index: number) => void;
  childAge?: number;
}

const ExplorationBreadcrumb: React.FC<ExplorationBreadcrumbProps> = ({
  paths,
  profileId,
  onPathClick,
  childAge = 10
}) => {
  const { textSize } = useAgeAdaptation(childAge);
  
  // Limit number of visible paths based on screen size and age
  const getVisiblePaths = () => {
    if (paths.length <= 3) return paths;
    
    // For young children, show just first and last for simplicity
    if (childAge <= 7) {
      return [
        paths[0],
        { title: '...', id: 'ellipsis' },
        paths[paths.length - 1]
      ];
    }
    
    // For others, show first, ellipsis, and last two
    return [
      paths[0],
      { title: '...', id: 'ellipsis' },
      paths[paths.length - 2],
      paths[paths.length - 1]
    ];
  };
  
  const visiblePaths = getVisiblePaths();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Breadcrumb>
        <BreadcrumbList className={`${textSize} px-2 py-1 bg-white/5 rounded-lg`}>
          <BreadcrumbItem>
            <BreadcrumbLink 
              href={`/dashboard/${profileId}`}
              className="flex items-center text-white/70 hover:text-white"
            >
              <Home className="h-3.5 w-3.5 mr-1" />
              {childAge <= 7 ? "Home" : "Dashboard"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbSeparator>
            <ChevronRight className="h-3 w-3 text-white/40" />
          </BreadcrumbSeparator>
          
          {visiblePaths.map((path, index) => (
            <React.Fragment key={`path-${index}-${path.title}`}>
              {path.title === '...' ? (
                <BreadcrumbItem>
                  <BreadcrumbEllipsis className="text-white/60" />
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  {index === visiblePaths.length - 1 ? (
                    <BreadcrumbPage className="text-white font-medium">
                      {path.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      className="text-white/70 hover:text-white cursor-pointer"
                      onClick={() => onPathClick && onPathClick(paths.indexOf(path))}
                    >
                      {path.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )}
              
              {index < visiblePaths.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3 w-3 text-white/40" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  );
};

export default ExplorationBreadcrumb;
