
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreativeBlockProps } from './interfaces';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

const CreativeBlock: React.FC<CreativeBlockProps> = ({
  content,
  specialistId,
  onCreativeUpload,
  uploadFeedback,
  updateHeight,
  curioId,
  childAge = 10
}) => {
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [feedback, setFeedback] = useState(uploadFeedback);
  const { textSize, interactionStyle, messageStyle } = useAgeAdaptation(childAge);
  
  const getPromptText = () => {
    switch (messageStyle) {
      case 'playful':
        return "Let's create something amazing!";
      case 'casual':
        return "Time to get creative!";
      default:
        return "Creative Challenge";
    }
  };
  
  const handleUpload = () => {
    setShowUploadButton(false);
    if (onCreativeUpload) {
      onCreativeUpload();
      setFeedback("Great job! Your creation has been saved.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-lg border border-white/10"
    >
      <div className="p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-full">
            <Palette className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className={`text-white font-medium ${textSize}`}>{getPromptText()}</h3>
        </div>
        
        <div className={`mb-4 ${textSize}`}>
          <p className="text-white/90 mb-3">{content.prompt}</p>
          
          {content.description && (
            <p className="text-white/80 mb-3">{content.description}</p>
          )}
        </div>
        
        {content.guidelines && (
          <div className="mb-4 bg-white/5 p-3 rounded-lg">
            <h4 className={`text-white/90 font-medium mb-2 ${childAge <= 7 ? 'text-base' : 'text-sm'}`}>Tips:</h4>
            <ul className={`list-disc pl-5 text-white/80 ${childAge <= 7 ? 'text-base space-y-2' : 'text-sm space-y-1'}`}>
              {Array.isArray(content.guidelines) ? 
                content.guidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                )) : 
                <li>{String(content.guidelines)}</li>
              }
            </ul>
          </div>
        )}
        
        {content.examples && Array.isArray(content.examples) && content.examples.length > 0 && (
          <div className="mb-4">
            <h4 className={`text-white/90 font-medium mb-2 ${childAge <= 7 ? 'text-base' : 'text-sm'}`}>Examples:</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
              {content.examples.map((example, index) => (
                <div key={index} className="min-w-[150px] h-[100px] bg-white/10 rounded-lg flex items-center justify-center text-white/70 p-2 text-center text-sm">
                  {example}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showUploadButton ? (
          <Button
            onClick={handleUpload}
            className={`w-full bg-purple-500/80 hover:bg-purple-500 ${interactionStyle}`}
          >
            <Upload className="h-4 w-4 mr-2" />
            {childAge <= 7 ? "Share My Creation!" : "Upload Your Creation"}
          </Button>
        ) : (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center">
            <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
            <p className={`text-white ${childAge <= 7 ? 'text-base' : 'text-sm'}`}>
              {feedback || uploadFeedback || "Great job! Your creation has been saved."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CreativeBlock;
