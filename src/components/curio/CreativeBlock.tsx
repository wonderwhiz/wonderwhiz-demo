
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
      className="bg-gradient-to-br from-[#9b87f5]/30 to-[#F97316]/30 rounded-xl p-6 my-6 border border-[#7E69AB]/20 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <div className="bg-[#FFDEE2]/60 p-2 rounded-full mr-3">
          <Sparkles className="h-5 w-5 text-[#F97316]" />
        </div>
        <h3 className="text-xl font-bold text-[#1EAEDB]">{prompt}</h3>
      </div>

      {examples.length > 0 && (
        <div className="mb-4">
          <p className="text-[#7E69AB] font-medium mb-2">Examples:</p>
          <ul className="space-y-2">
            {examples.map((example, idx) => (
              <li key={idx} className="flex items-start text-[#8E9196]">
                <span className="inline-block mr-2 text-[#F97316]">•</span>
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
          description={childAge < 10 ? "Draw what you imagine!" : "Express your ideas visually"}
          onClick={onCreativeSubmit}
        />
        <CreativeOption
          icon={<FileEdit className="h-5 w-5" />}
          title="Write a story"
          description={childAge < 10 ? "Tell a fun story!" : "Create a narrative about this topic"}
          onClick={onCreativeSubmit}
        />
        <CreativeOption
          icon={<Box className="h-5 w-5" />}
          title="Make a model"
          description={childAge < 10 ? "Build something cool!" : "Create a physical representation"}
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white/20 hover:bg-[#FFDEE2]/50 p-4 rounded-lg text-left border border-[#F97316]/10 shadow hover:shadow-lg transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className="bg-[#FFA99F]/20 p-1.5 rounded-full mr-2">{icon}</div>
        <h4 className="font-semibold text-[#7E69AB] text-base">{title}</h4>
      </div>
      <p className="text-sm text-[#8E9196]">{description}</p>
    </motion.button>
  );
};

export default CreativeBlock;
