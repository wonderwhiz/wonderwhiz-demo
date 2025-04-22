
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExplorationBreadcrumbProps {
  paths: {
    title: string;
    id?: string;
  }[];
  profileId: string;
  onPathClick?: (index: number) => void;
}

const ExplorationBreadcrumb: React.FC<ExplorationBreadcrumbProps> = ({
  paths,
  profileId,
  onPathClick
}) => {
  const navigate = useNavigate();
  
  // Handles navigation to dashboard
  const handleDashboardClick = () => {
    navigate(`/dashboard/${profileId}`);
  };
  
  // Handles navigation to a specific path
  const handlePathClick = (index: number) => {
    if (onPathClick) {
      onPathClick(index);
    } else if (paths[index].id) {
      navigate(`/curio/${profileId}/${paths[index].id}`);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 5, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="flex items-center flex-wrap gap-1 text-white/70 text-sm mb-4 px-2 py-1 rounded-lg bg-black/10 overflow-x-auto scrollbar-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        variants={itemVariants}
        className="flex items-center hover:text-white transition-colors" 
        onClick={handleDashboardClick}
      >
        <Home className="h-3.5 w-3.5 mr-1" />
        <span>Dashboard</span>
      </motion.button>
      
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <motion.span variants={itemVariants} className="mx-0.5">
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.span>
          
          <motion.button
            variants={itemVariants}
            className={`hover:text-white transition-colors truncate max-w-[150px] ${
              index === paths.length - 1 ? 'text-white font-medium' : ''
            }`}
            onClick={() => handlePathClick(index)}
            title={path.title}
          >
            {path.title}
          </motion.button>
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default ExplorationBreadcrumb;
