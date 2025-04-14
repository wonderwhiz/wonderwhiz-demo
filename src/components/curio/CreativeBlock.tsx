import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brush, FileEdit, Box } from 'lucide-react';

interface CreativeBlockProps {
  prompt: string;
  examples?: string[];
  specialistId?: string;
  onCreativeSubmit?: () => void;
  childAge?: number;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({
  prompt,
  examples = [],
  specialistId = 'spark',
  onCreativeSubmit,
  childAge = 10
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-xl p-6 my-6 border border-purple-500/20"
    >
      <div className="flex items-center mb-4">
        <div className="bg-pink-500/20 p-2 rounded-full mr-3">
          <Sparkles className="h-5 w-5 text-pink-300" />
        </div>
        <h3 className="text-xl font-bold text-white">{prompt}</h3>
      </div>
      
      {examples.length > 0 && (
        <div className="mb-6">
          <p className="text-white/80 font-medium mb-2">Examples:</p>
          <ul className="space-y-2">
            {examples.map((example, index) => (
              <li key={index} className="flex items-start text-white/70">
                <span className="inline-block mr-2 text-pink-300">•</span> 
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <CreativeOption 
          icon={<Brush className="h-5 w-5" />}
          title="Draw a picture"
          description={childAge < 10
            ? "Draw what you imagine!" 
            : "Express your ideas visually"
          }
          onClick={onCreativeSubmit}
        />
        
        <CreativeOption 
          icon={<FileEdit className="h-5 w-5" />}
          title="Write a story"
          description={childAge < 10
            ? "Tell a fun story!" 
            : "Create a narrative about this topic"
          }
          onClick={onCreativeSubmit}
        />
        
        <CreativeOption 
          icon={<Box className="h-5 w-5" />}
          title="Make a model"
          description={childAge < 10
            ? "Build something cool!" 
            : "Create a physical representation"
          }
          onClick={onCreativeSubmit}
        />
      </div>
    </motion.div>
  );
};

interface CreativeOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const CreativeOption: React.FC<CreativeOptionProps> = ({
  icon,
  title,
  description,
  onClick
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/10 hover:bg-white/15 p-4 rounded-lg text-left transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className="bg-white/10 p-1.5 rounded-full mr-2 text-pink-300">
          {icon}
        </div>
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      <p className="text-sm text-white/70">{description}</p>
    </motion.button>
  );
};

export default CreativeBlock;
