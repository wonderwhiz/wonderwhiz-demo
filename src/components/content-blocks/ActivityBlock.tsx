
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, Upload, Image, ArrowUpFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityBlockProps } from './interfaces';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ActivityBlock: React.FC<ActivityBlockProps> = ({
  content,
  specialistId,
  onActivityComplete,
  updateHeight,
  childAge = 10
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { textSize, interactionStyle, messageStyle } = useAgeAdaptation(childAge);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleComplete = () => {
    setIsCompleted(true);
    if (onActivityComplete) {
      onActivityComplete();
    }
  };
  
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(childAge <= 7 
        ? "Oops! The picture is too big!" 
        : "The file size exceeds the 5MB limit.");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error(childAge <= 7 
        ? "Hmm, that's not a picture!" 
        : "Please upload an image file.");
      return;
    }
    
    // Create a preview
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);
    
    // Start the "upload" animation
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress (this would be real in a production app with Supabase)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // In a real app, this would actually upload the file to Supabase storage
    // For now, we're just simulating the upload
    /*
    try {
      // Actual file upload code (currently commented out)
      const { data, error } = await supabase.storage
        .from('activity-uploads')
        .upload(`${Date.now()}-${file.name}`, file);
        
      if (error) throw error;
      
      // Get the URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('activity-uploads')
        .getPublicUrl(data.path);
        
      setUploadedImage(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
    */
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const getTitle = () => {
    return content.title || (messageStyle === 'playful' ? 
      "Fun Activity Time!" : 
      messageStyle === 'casual' ? 
        "Let's Try This Activity" : 
        "Activity"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-6 rounded-lg border border-white/10 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/30 rounded-full shadow-inner">
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
        <h3 className={`text-white font-medium ${textSize}`}>{getTitle()}</h3>
      </div>
      
      <div className={`mb-6 ${textSize}`}>
        <p className="text-white/90 mb-4">{content.activity || content.instructions}</p>
        
        {content.steps && Array.isArray(content.steps) && content.steps.length > 0 && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-inner">
            <h4 className={`text-white/90 font-medium mb-2 ${
              childAge <= 7 ? 'text-base' : 'text-sm'
            }`}>
              {childAge <= 7 ? "Here's what to do:" : "Steps:"}
            </h4>
            <ol className={`list-decimal pl-5 ${
              childAge <= 7 ? 'space-y-3 text-base' : 'space-y-2 text-sm'
            }`}>
              {content.steps.map((step, index) => (
                <li key={index} className="text-white/80">{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      
      {/* Image upload section */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />
          
          {!uploadedImage ? (
            <div 
              className="border-2 border-dashed border-blue-400/30 rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 transition-colors"
              onClick={triggerFileInput}
            >
              <div className="p-3 bg-blue-500/20 rounded-full">
                <ArrowUpFromLine className="h-6 w-6 text-blue-300" />
              </div>
              <div className="text-center">
                <p className="text-white/80 font-medium mb-1">
                  {childAge <= 7 ? "Add a picture of what you made!" : "Upload an image of your activity"}
                </p>
                <p className="text-white/60 text-xs">
                  Click to choose a file or drag and drop
                </p>
                <p className="text-white/50 text-xs mt-1">
                  JPEG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-white/20">
              <img 
                src={uploadedImage} 
                alt="Uploaded activity" 
                className="w-full h-48 object-cover"
              />
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={triggerFileInput}
                  className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="mt-2">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white/60 text-xs mt-1 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>
      
      {!isCompleted ? (
        <Button
          onClick={handleComplete}
          className={`w-full bg-blue-500/80 hover:bg-blue-500 shadow-md shadow-blue-500/20 ${interactionStyle}`}
        >
          {childAge <= 7 ? "I Did It!" : "Mark as Completed"}
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 p-4 bg-green-500/20 backdrop-blur-sm rounded-lg text-white border border-green-500/30">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className={textSize}>
            {messageStyle === 'playful' ? 
              "Awesome job! You completed the activity!" : 
              messageStyle === 'casual' ? 
                "Great work! Activity completed." : 
                "Activity completed successfully."
            }
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityBlock;
