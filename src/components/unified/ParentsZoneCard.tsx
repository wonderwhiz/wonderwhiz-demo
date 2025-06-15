
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, BarChart3, Shield, Users } from 'lucide-react';
import MagicalBorder from '@/components/MagicalBorder';
import { useNavigate } from 'react-router-dom';

interface ParentsZoneCardProps {
  to: string;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

const ParentsZoneCard: React.FC<ParentsZoneCardProps> = ({
  to,
  isHovered,
  onHover
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="w-full block text-left perspective-800 transform transition-all duration-500"
    >
      <MagicalBorder 
        active={isHovered} 
        type="purple"
        className="rounded-2xl"
      >
        <motion.div 
          className="rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white/10 backdrop-blur-sm hover:shadow-wonderwhiz-purple/20 h-full"
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="h-40 bg-gradient-to-br from-slate-600 via-purple-700 to-indigo-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-32 h-32 rounded-full bg-white/20 blur-xl -top-8 -right-8" />
              <div className="absolute w-16 h-16 rounded-full bg-white/15 blur-md bottom-4 left-4" />
            </div>
            
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 flex items-center gap-3"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Settings className="h-8 w-8 text-white drop-shadow-md" />
              </div>
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <BarChart3 className="h-6 w-6 text-white/80" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Shield className="h-6 w-6 text-white/80" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  <Users className="h-6 w-6 text-white/80" />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-baloo">Parents Zone</h3>
            <div className="flex items-center justify-center text-slate-200">
              <span className="text-sm opacity-90 font-medium">Manage profiles & view progress</span>
            </div>
          </div>
        </motion.div>
      </MagicalBorder>
    </button>
  );
};

export default ParentsZoneCard;
