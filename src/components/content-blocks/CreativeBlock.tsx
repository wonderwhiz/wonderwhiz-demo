
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CreativeBlockProps {
  content: {
    prompt: string;
    type?: string;
  };
  onCreativeUpload: () => void;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({ content, onCreativeUpload }) => {
  const [creativeUploaded, setCreativeUploaded] = useState(false);

  const handleCreativeUpload = () => {
    if (!creativeUploaded) {
      setCreativeUploaded(true);
      onCreativeUpload();
    }
  };
  
  return (
    <div>
      <p className="text-white mb-2 sm:mb-3 text-sm sm:text-base">{content.prompt}</p>
      {!creativeUploaded ? (
        <div>
          <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">
            When you're ready, upload your {content.type || 'creation'} to earn 10 sparks!
          </p>
          <Button
            onClick={handleCreativeUpload}
            className="bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80 text-xs sm:text-sm h-8 sm:h-10"
          >
            Upload My {content.type === 'drawing' ? 'Drawing' : 'Creation'}
          </Button>
        </div>
      ) : (
        <p className="text-green-400 text-xs sm:text-sm">
          Uploaded successfully! You earned 10 sparks for your creativity!
        </p>
      )}
    </div>
  );
};

export default CreativeBlock;
