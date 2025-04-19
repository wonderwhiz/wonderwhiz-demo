import React, { useState } from 'react';

export interface CreativeBlockProps {
  content: {
    prompt: string;
    description: string;
    guidelines: string[];
    examples: string[];
  };
  specialistId: string;
  onCreativeUpload?: () => void;
  uploadFeedback?: string | null;
  updateHeight?: (height: number) => void;
  curioId?: string;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({
  content,
  specialistId,
  onCreativeUpload,
  uploadFeedback,
  updateHeight,
  curioId
}) => {
  const [showUploadButton, setShowUploadButton] = useState(true);
  
  return (
    <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
      <div className="p-4 border border-white/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">Creative Prompt</h3>
        <p className="text-white/90 mb-4">{content.prompt}</p>
        
        <h4 className="text-white font-medium mb-2">Description</h4>
        <p className="text-white/90 mb-4">{content.description}</p>
        
        {content.guidelines && content.guidelines.length > 0 && (
          <>
            <h4 className="text-white font-medium mb-2">Guidelines</h4>
            <ul className="list-disc pl-5 text-white/90 mb-4">
              {content.guidelines.map((guideline, index) => (
                <li key={index}>{guideline}</li>
              ))}
            </ul>
          </>
        )}
        
        {content.examples && content.examples.length > 0 && (
          <>
            <h4 className="text-white font-medium mb-2">Examples</h4>
            <div className="flex gap-3 overflow-x-auto mb-4">
              {content.examples.map((example, index) => (
                <div key={index} className="min-w-[150px] h-[100px] bg-white/5 rounded-lg flex items-center justify-center text-white/60">
                  {example}
                </div>
              ))}
            </div>
          </>
        )}
        
        {showUploadButton && (
          <button
            onClick={() => {
              setShowUploadButton(false);
              if (onCreativeUpload) onCreativeUpload();
            }}
            className="w-full py-2 bg-indigo-500/60 hover:bg-indigo-500/80 text-white text-sm rounded-md transition-colors"
          >
            Upload Your Creation
          </button>
        )}
        
        {!showUploadButton && uploadFeedback && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
            <p className="text-white">{uploadFeedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeBlock;
