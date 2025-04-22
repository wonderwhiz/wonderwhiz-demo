import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brush, FileEdit, Box } from 'lucide-react';
import { useHaptic } from '@/hooks/use-haptic';

interface CreativeBlockProps {
  content: {
    prompt: string;
    description?: string;
    guidelines?: string;
    examples?: string[];
  };
  specialistId: string;
  onCreativeUpload?: () => void;
  uploadFeedback?: string | null;
  childAge?: number;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({
  content,
  specialistId = 'spark',
  onCreativeUpload,
  uploadFeedback,
  childAge = 10
}) => {
  const { triggerHaptic } = useHaptic();

  const prompt = content.prompt || '';
  const examples = content.examples || [];

  const handleCreativeOptionClick = (option: string) => {
    triggerHaptic('success');
    if (onCreativeUpload) {
      onCreativeUpload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#9b87f5]/30 to-[#F97316]/30 rounded-xl p-4 sm:p-6 my-4 sm:my-6 border border-[#7E69AB]/20 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <div className="bg-[#FFDEE2]/60 p-2 rounded-full mr-3">
          <Sparkles className="h-5 w-5 text-[#F97316]" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[#1EAEDB] leading-tight">{prompt}</h3>
      </div>

      {content.description && (
        <p className="mb-4 text-[#8E9196] text-sm sm:text-base">{content.description}</p>
      )}

      {examples.length > 0 && (
        <div className="mb-4">
          <p className="text-[#7E69AB] font-medium mb-2 text-sm sm:text-base">Examples:</p>
          <ul className="space-y-2">
            {examples.map((example, idx) => (
              <li key={idx} className="flex items-start text-[#8E9196] text-sm sm:text-base">
                <span className="inline-block mr-2 text-[#F97316]">•</span>
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {['Draw', 'Write', 'Make'].map((type) => (
          <CreativeOption
            key={type}
            icon={type === 'Draw' ? <Brush className="h-5 w-5" /> :
                  type === 'Write' ? <FileEdit className="h-5 w-5" /> :
                  <Box className="h-5 w-5" />}
            title={`${type} ${type === 'Draw' ? 'a picture' : 
                         type === 'Write' ? 'a story' : 
                         'a model'}`}
            description={childAge < 10 ? 
              `${type} something fun!` : 
              `Express your ideas through ${type.toLowerCase()}ing`}
            onClick={() => handleCreativeOptionClick(type)}
          />
        ))}
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/20 hover:bg-[#FFDEE2]/50 p-4 rounded-lg text-left border border-[#F97316]/10 shadow hover:shadow-lg transition-colors active:bg-[#FFDEE2]/60 touch-manipulation"
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
