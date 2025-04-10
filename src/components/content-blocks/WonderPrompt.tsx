
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { createWonderQuestions } from './utils/specialistUtils';

interface WonderPromptProps {
  specialistId: string;
  blockType: string;
  blockContent: any;
  onRabbitHoleClick: (question: string) => void;
  narrativePosition?: string;
}

const WonderPrompt: React.FC<WonderPromptProps> = ({
  specialistId,
  blockType,
  blockContent,
  onRabbitHoleClick,
  narrativePosition = 'middle'
}) => {
  const wonderQuestions = createWonderQuestions(specialistId, blockType, blockContent);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-4 mb-2 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
    >
      <h4 className="text-white font-medium text-sm mb-2">I wonder...</h4>
      <div className="flex flex-col gap-2">
        {wonderQuestions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            className="justify-start text-left text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-md text-sm"
            onClick={() => onRabbitHoleClick(question)}
          >
            <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{question}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default WonderPrompt;
