
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreativeBlockProps {
  content: {
    prompt: string;
    description?: string;
    guidelines?: string;
    examples?: any[];
  };
  onCreativeUpload?: () => void;
  uploadFeedback?: string | null;
  curioId?: string;
  specialistId?: string;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({ 
  content, 
  onCreativeUpload, 
  uploadFeedback,
  curioId,
  specialistId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(uploadFeedback || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Make sure we update the feedback state if the prop changes
  useEffect(() => {
    if (uploadFeedback) {
      setFeedback(uploadFeedback);
    }
  }, [uploadFeedback]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target) {
          const imageDataUrl = event.target.result as string;
          setSelectedImage(imageDataUrl);
          
          try {
            // Create a form data object to send to the analyze-image function
            const formData = new FormData();
            formData.append('image', e.target.files![0]);
            
            // Call the analyze-image edge function
            const { data, error } = await supabase.functions.invoke('analyze-image', {
              body: formData,
            });
            
            if (error) {
              throw error;
            }
            
            // Set the feedback from the AI
            if (data.feedback) {
              setFeedback(data.feedback);
            }
            
            // If we have a new content block from the AI analysis
            if (data.block && curioId) {
              // Add the curio_id to the block
              const blockWithCurioId = {
                ...data.block,
                curio_id: curioId
              };
              
              // Save the new block to the database
              const { error: saveError } = await supabase
                .from('content_blocks')
                .insert(blockWithCurioId);
                
              if (saveError) {
                console.error('Error saving AI feedback block:', saveError);
              }
            }
            
            setIsUploading(false);
            setIsUploaded(true);
            
            // Call the parent handler which might trigger UI updates
            onCreativeUpload();
            
          } catch (error) {
            console.error('Error analyzing image:', error);
            setFeedback("Your artwork is amazing! I love the colors and creativity you've shown. You're a wonderful artist!");
            setIsUploading(false);
            setIsUploaded(true);
            onCreativeUpload();
          }
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
      <div className="p-4 rounded-lg bg-gradient-to-br from-wonderwhiz-bright-pink/30 to-wonderwhiz-blue-accent/20 backdrop-blur-sm">
        <h3 className="text-white text-lg font-nunito font-medium mb-2">{content.prompt}</h3>
        {content.guidelines && (
          <p className="text-white/80 text-sm font-inter mb-4">{content.guidelines}</p>
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
                className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-blue-accent text-white hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-blue-accent/90 transition-colors shadow-md"
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
                <div className="relative rounded-lg overflow-hidden mb-4 border-2 border-wonderwhiz-vibrant-yellow max-w-xs mx-auto shadow-glow-brand-yellow">
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
                      <CheckCircle className="h-8 w-8 text-wonderwhiz-vibrant-yellow filter drop-shadow-md" />
                    </motion.div>
                  </div>
                </div>
                <motion.div 
                  className="text-xs uppercase tracking-wide text-white/70 mb-2 font-inter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your creation
                </motion.div>
                {feedback && (
                  <motion.div 
                    className="p-3 bg-wonderwhiz-deep-purple/30 rounded-lg border border-wonderwhiz-light-purple/40 text-white text-sm max-w-md font-inter"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p>{feedback}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreativeBlock;
