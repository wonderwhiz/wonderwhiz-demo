
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Camera, Upload, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreativeBlockProps {
  content: {
    prompt: string;
    type?: string;
  };
  onCreativeUpload: () => void;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({ content, onCreativeUpload }) => {
  const [creativeUploaded, setCreativeUploaded] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreativeUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `creative-uploads/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('creative-uploads')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('creative-uploads')
        .getPublicUrl(filePath);
        
      // Send to Claude for analysis
      const response = await supabase.functions.invoke('analyze-creative-work', {
        body: { 
          imageUrl: publicUrlData.publicUrl,
          prompt: content.prompt,
          type: content.type || 'creation'
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setAnalysis(response.data.analysis);
      setCreativeUploaded(true);
      onCreativeUpload();
      
    } catch (error) {
      console.error('Error uploading creative work:', error);
      toast.error('Something went wrong with your upload. Please try again.');
    } finally {
      setUploading(false);
      setShowUploadOptions(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleCreativeUpload(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      const canvasElement = document.createElement('canvas');
      
      videoElement.srcObject = stream;
      videoElement.play();
      
      // Take the picture after a short delay to allow camera to initialize
      setTimeout(() => {
        // Set canvas dimensions to match video
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        
        // Draw the video frame to the canvas
        const context = canvasElement.getContext('2d');
        if (context) {
          context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        }
        
        // Convert canvas to file
        canvasElement.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            handleCreativeUpload(file);
          }
          
          // Stop all video tracks to turn off the camera
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }, 'image/jpeg');
      }, 500);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access your camera. Please try uploading a file instead.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div>
      <motion.p 
        className="text-white mb-2 sm:mb-3 text-sm sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.prompt}
      </motion.p>
      
      {!creativeUploaded ? (
        <>
          {!showUploadOptions ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setShowUploadOptions(true)}
                className="bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80 text-xs sm:text-sm h-8 sm:h-10"
              >
                Upload My {content.type === 'drawing' ? 'Drawing' : 'Creation'}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col sm:flex-row gap-2 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={handleCameraCapture}
                className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-xs sm:text-sm h-8 sm:h-10"
                disabled={uploading}
              >
                <Camera className="mr-1 h-4 w-4" />
                Take Picture
              </Button>
              
              <Button
                onClick={triggerFileInput}
                className="bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80 text-xs sm:text-sm h-8 sm:h-10"
                disabled={uploading}
              >
                <Upload className="mr-1 h-4 w-4" />
                Upload File
              </Button>
              
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Button
                onClick={() => setShowUploadOptions(false)}
                variant="outline"
                className="text-xs sm:text-sm border-white/20 text-white/70 hover:bg-white/10 h-8 sm:h-10"
                disabled={uploading}
              >
                Cancel
              </Button>
            </motion.div>
          )}
          
          {uploading && (
            <motion.div 
              className="flex items-center mt-2 text-xs sm:text-sm text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Processing your creation...
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-wonderwhiz-pink/20 rounded-lg p-3 sm:p-4 border border-wonderwhiz-pink/30 mt-2">
            <div className="flex items-center mb-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-white" />
              </div>
              <p className="text-white font-medium text-sm">Prism's Feedback</p>
            </div>
            <p className="text-white/90 text-xs sm:text-sm">{analysis || "Amazing work! Your creativity is absolutely wonderful! You've earned 10 sparks for your artistic talents!"}</p>
          </div>
          <p className="text-green-400 text-xs sm:text-sm mt-2 flex items-center">
            <Check className="h-4 w-4 mr-1" />
            Uploaded successfully! You earned 10 sparks for your creativity!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CreativeBlock;
