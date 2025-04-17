
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, FileText, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import SpecialistAvatar from '@/components/SpecialistAvatar';

interface CreativeBlockProps {
  prompt: string;
  examples?: string[];
  specialistId?: string;
  childAge?: number;
  onUpload?: (file: File) => void;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({
  prompt,
  examples = [],
  specialistId = 'spark',
  childAge = 10,
  onUpload
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState<string>('');
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'text' | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    setUploadType('image');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleTextClick = () => {
    setUploadType('text');
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Call the onUpload prop if provided
      if (onUpload) {
        onUpload(file);
      }
      
      // Create a local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setIsUploading(false);
        
        // Show success toast
        toast.success('Creative response uploaded!', {
          description: 'Your creation has been saved.'
        });
        
        setResponseSubmitted(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      toast.error('Upload failed', {
        description: 'There was a problem uploading your file. Please try again.'
      });
    }
  };
  
  const handleTextSubmit = () => {
    if (!textResponse.trim()) return;
    
    try {
      toast.success('Creative response submitted!', {
        description: 'Your creative writing has been saved.'
      });
      
      setResponseSubmitted(true);
    } catch (error) {
      console.error('Error submitting text response:', error);
      toast.error('Submission failed', {
        description: 'There was a problem submitting your response. Please try again.'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="rounded-2xl backdrop-blur-lg border border-white/10 bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-pink-500/20 shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <SpecialistAvatar specialistId={specialistId} size="lg" />
            
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white font-nunito">Creative Challenge</h3>
                <div className="ml-2 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                  <span className="text-xs text-yellow-400 font-medium">Imagination</span>
                </div>
              </div>
              <p className="text-sm text-white/70 font-inter">Express yourself!</p>
            </div>
          </div>

          <div className="text-white font-inter leading-relaxed mb-6">
            <p>{prompt}</p>
            
            {examples && examples.length > 0 && (
              <div className="mt-4 bg-white/10 p-4 rounded-lg">
                <p className="font-medium mb-2">Examples for inspiration:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                  {examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!uploadType && !responseSubmitted ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="flex flex-col items-center justify-center h-auto py-4 bg-gradient-to-r from-wonderwhiz-bright-pink/60 to-purple-500/60 hover:from-wonderwhiz-bright-pink/70 hover:to-purple-500/70"
                onClick={handleImageClick}
              >
                <ImageIcon className="h-6 w-6 mb-2" />
                <span>Upload Image</span>
              </Button>
              
              <Button
                className="flex flex-col items-center justify-center h-auto py-4 bg-gradient-to-r from-blue-500/60 to-cyan-500/60 hover:from-blue-500/70 hover:to-cyan-500/70"
                onClick={handleTextClick}
              >
                <FileText className="h-6 w-6 mb-2" />
                <span>Write Response</span>
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : responseSubmitted ? (
            <div className="text-center p-4 bg-green-500/20 rounded-xl">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-300" />
              <p className="text-white font-medium">Great job!</p>
              <p className="text-white/80 text-sm mt-1">
                Your creative response has been submitted.
              </p>
            </div>
          ) : uploadType === 'image' ? (
            <div>
              {isUploading ? (
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-xl bg-white/5">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderwhiz-bright-pink"></div>
                  <p className="mt-2 text-white/70">Uploading...</p>
                </div>
              ) : uploadedImage ? (
                <div className="rounded-xl overflow-hidden border border-white/20">
                  <img
                    src={uploadedImage}
                    alt="Uploaded creation"
                    className="w-full h-auto object-contain max-h-64"
                  />
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={handleImageClick}
                >
                  <Upload className="h-8 w-8 text-white/60 mb-2" />
                  <p className="text-white/70">Click to upload an image</p>
                </div>
              )}
              
              {!uploadedImage && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => setUploadType(null)}
                    className="text-white/70 hover:text-white"
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                placeholder={childAge && childAge < 8 ? "Write your thoughts here..." : "Write your creative response here..."}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white min-h-[120px] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50 resize-none"
              />
              
              <div className="mt-4 flex justify-between items-center">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setUploadType(null)}
                  className="text-white/70 hover:text-white"
                >
                  Back
                </Button>
                
                <Button
                  onClick={handleTextSubmit}
                  disabled={!textResponse.trim()}
                  className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreativeBlock;
