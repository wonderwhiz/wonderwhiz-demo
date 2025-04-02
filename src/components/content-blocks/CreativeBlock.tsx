
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Check, Loader2, X } from 'lucide-react';
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Function to simulate progress for better UX
  const simulateProgress = () => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        progress = 95; // Cap at 95% until actual completion
      }
      setUploadProgress(progress);
    }, 300);
    return interval;
  };

  const handleCreativeUpload = async (file: File) => {
    if (!file) return;
    
    try {
      // Generate a preview immediately for perceived speed
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setUploading(true);
      
      // Start simulated progress
      const progressInterval = simulateProgress();
      progressIntervalRef.current = progressInterval;
      
      // Start with a placeholder analysis for immediate feedback
      setAnalysis("Analyzing your creative work...");
      
      // Use base64 encoding instead of storage bucket
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        if (!base64Image) {
          throw new Error('Failed to encode image');
        }
        
        // Send to Claude for analysis through our Edge Function
        toast.promise(
          supabase.functions.invoke('analyze-creative-work', {
            body: { 
              imageUrl: base64Image,
              prompt: content.prompt,
              type: content.type || 'creation'
            }
          }),
          {
            loading: 'Analyzing your creation...',
            success: (response) => {
              // Clear the progress simulation
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                setUploadProgress(100);
              }
              
              if (response.error) {
                throw new Error(response.error.message);
              }
              
              setAnalysis(response.data.analysis);
              setCreativeUploaded(true);
              onCreativeUpload();
              return 'Analysis complete!';
            },
            error: (err) => {
              console.error('Error analyzing creative work:', err);
              // Provide a fallback analysis if Claude fails
              setTimeout(() => {
                setAnalysis("Amazing work! You've put a lot of creativity into this. Keep exploring and creating!");
                setCreativeUploaded(true);
                onCreativeUpload();
              }, 500);
              return 'Could not analyze your creation, but we still love it!';
            }
          }
        );
      };
      
      reader.onerror = () => {
        throw new Error('Error reading file');
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading creative work:', error);
      toast.error('Something went wrong with your upload. Please try again.');
      
      // Still provide a positive experience even if there's an error
      setTimeout(() => {
        setAnalysis("Wonderful creation! Even though we had some technical issues, we can see your amazing talent!");
        setCreativeUploaded(true);
        onCreativeUpload();
      }, 1000);
    } finally {
      setShowUploadOptions(false);
      // Clear interval if it exists
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
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
      
      // Show the user feedback that camera is initializing
      toast.loading('Preparing camera...', { id: 'camera-init' });
      
      videoElement.srcObject = stream;
      videoElement.play();
      
      // Take the picture after a short delay to allow camera to initialize
      setTimeout(() => {
        toast.dismiss('camera-init');
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

  const cancelUpload = () => {
    setUploading(false);
    setPreviewImage(null);
    setShowUploadOptions(false);
    setUploadProgress(0);
    // Clear interval if it exists
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
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
      
      <AnimatePresence mode="wait">
        {!creativeUploaded ? (
          <>
            {!showUploadOptions && !uploading ? (
              <motion.div
                key="upload-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Button
                  onClick={() => setShowUploadOptions(true)}
                  className="bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80 text-xs sm:text-sm h-8 sm:h-10"
                >
                  Upload My {content.type === 'drawing' ? 'Drawing' : 'Creation'}
                </Button>
              </motion.div>
            ) : uploading && previewImage ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="relative rounded-lg overflow-hidden border-2 border-wonderwhiz-purple/50 max-w-xs mx-auto">
                  <img 
                    src={previewImage} 
                    alt="Your creation" 
                    className="w-full object-contain max-h-60"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-black/60 p-3 rounded-full">
                      <Loader2 className="animate-spin h-6 w-6 text-wonderwhiz-gold" />
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                  <motion.div
                    className="bg-wonderwhiz-purple h-2.5 rounded-full"
                    initial={{ width: '5%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                  ></motion.div>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={cancelUpload}
                    variant="outline"
                    size="sm"
                    className="text-xs border-white/20 text-white/70 hover:bg-white/10"
                  >
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="upload-options"
                className="flex flex-col sm:flex-row gap-2 mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleCameraCapture}
                  className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-xs sm:text-sm h-8 sm:h-10"
                >
                  <Camera className="mr-1 h-4 w-4" />
                  Take Picture
                </Button>
                
                <Button
                  onClick={triggerFileInput}
                  className="bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80 text-xs sm:text-sm h-8 sm:h-10"
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
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {previewImage && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-3 rounded-lg overflow-hidden border border-wonderwhiz-pink/30 max-w-xs"
              >
                <img 
                  src={previewImage} 
                  alt="Your creation" 
                  className="w-full object-contain max-h-48"
                />
              </motion.div>
            )}
            
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
      </AnimatePresence>
    </div>
  );
};

export default CreativeBlock;
