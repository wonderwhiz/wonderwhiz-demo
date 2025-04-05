
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CreativeBlockProps {
  content: {
    prompt: string;
    guidelines?: string;
  };
  onCreativeUpload: () => void;
  uploadFeedback?: string | null;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({ content, onCreativeUpload, uploadFeedback }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setSelectedImage(event.target.result as string);
          
          // Simulate AI analysis with a brief delay
          setTimeout(() => {
            setIsUploading(false);
            setIsUploaded(true);
            onCreativeUpload();
          }, 1500);
        }
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <div className="p-4 rounded-lg bg-gradient-to-br from-wonderwhiz-purple/30 to-pink-500/30 backdrop-blur-sm">
        <h3 className="text-white text-lg font-medium mb-2">{content.prompt}</h3>
        {content.guidelines && (
          <p className="text-white/80 text-sm mb-4">{content.guidelines}</p>
        )}
        
        <AnimatePresence mode="wait">
          {!isUploaded ? (
            <motion.div 
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="upload-section"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <Button 
                onClick={triggerFileInput} 
                className="bg-white text-wonderwhiz-purple hover:bg-white/90 transition-colors shadow-md"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload your creation
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key="uploaded-section"
            >
              <div className="flex flex-col items-center">
                <div className="relative rounded-lg overflow-hidden mb-4 border-2 border-wonderwhiz-gold max-w-xs mx-auto">
                  <img 
                    src={selectedImage || ''} 
                    alt="Your creation" 
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 right-2">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <CheckCircle className="h-8 w-8 text-wonderwhiz-gold filter drop-shadow-md" />
                    </motion.div>
                  </div>
                </div>
                <motion.div 
                  className="text-xs uppercase tracking-wide text-white/70 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your creation
                </motion.div>
                <motion.div 
                  className="p-3 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/30 text-white text-sm max-w-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="font-medium mb-1 text-wonderwhiz-gold">Prism's Feedback</div>
                  <p>{uploadFeedback || "Your artwork is amazing! I love the colors and creativity you've shown. You're a wonderful artist!"}</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreativeBlock;
