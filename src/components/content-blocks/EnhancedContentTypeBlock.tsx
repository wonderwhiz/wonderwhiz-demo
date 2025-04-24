
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Lightbulb, Music, Video, Image, PencilRuler, Award, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedContentTypeBlockProps {
  contentType: 'text' | 'video' | 'image' | 'audio' | 'quiz' | 'activity' | 'challenge';
  title: string;
  description: string;
  onSelect: () => void;
  childAge?: number;
}

const EnhancedContentTypeBlock: React.FC<EnhancedContentTypeBlockProps> = ({
  contentType,
  title,
  description,
  onSelect,
  childAge = 10
}) => {
  // Content type specific styling
  const getContentTypeStyles = () => {
    switch (contentType) {
      case 'text':
        return {
          icon: <Book />,
          gradient: 'from-blue-600/30 to-blue-700/10',
          hoverGradient: 'hover:from-blue-500/40 hover:to-blue-600/20'
        };
      case 'video':
        return {
          icon: <Video />,
          gradient: 'from-red-600/30 to-red-700/10',
          hoverGradient: 'hover:from-red-500/40 hover:to-red-600/20'
        };
      case 'image':
        return {
          icon: <Image />,
          gradient: 'from-emerald-600/30 to-emerald-700/10',
          hoverGradient: 'hover:from-emerald-500/40 hover:to-emerald-600/20'
        };
      case 'audio':
        return {
          icon: <Music />,
          gradient: 'from-purple-600/30 to-purple-700/10',
          hoverGradient: 'hover:from-purple-500/40 hover:to-purple-600/20'
        };
      case 'quiz':
        return {
          icon: <Lightbulb />,
          gradient: 'from-amber-600/30 to-amber-700/10',
          hoverGradient: 'hover:from-amber-500/40 hover:to-amber-600/20'
        };
      case 'activity':
        return {
          icon: <PencilRuler />,
          gradient: 'from-cyan-600/30 to-cyan-700/10',
          hoverGradient: 'hover:from-cyan-500/40 hover:to-cyan-600/20'
        };
      case 'challenge':
        return {
          icon: childAge <= 10 ? <Award /> : <Medal />,
          gradient: 'from-pink-600/30 to-pink-700/10',
          hoverGradient: 'hover:from-pink-500/40 hover:to-pink-600/20'
        };
      default:
        return {
          icon: <Lightbulb />,
          gradient: 'from-gray-600/30 to-gray-700/10',
          hoverGradient: 'hover:from-gray-500/40 hover:to-gray-600/20'
        };
    }
  };

  const { icon, gradient, hoverGradient } = getContentTypeStyles();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${gradient} ${hoverGradient} cursor-pointer border border-white/10 transition-all duration-300`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className={`font-medium text-white ${childAge <= 10 ? 'text-lg' : 'text-base'}`}>
            {title}
          </h3>
          <p className={`text-white/80 ${childAge <= 10 ? 'text-sm' : 'text-xs'}`}>
            {description}
          </p>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
          Explore
        </Button>
      </div>
    </motion.div>
  );
};

export default EnhancedContentTypeBlock;
