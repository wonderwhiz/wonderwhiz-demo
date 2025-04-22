
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Download, Share2, Sparkles, AlertCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BlockError } from './BlockError';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface InteractiveImageBlockProps {
  topic: string;
  childId: string;
  childAge?: number;
  onShare?: () => void;
  className?: string;
  showHeader?: boolean;
}

const InteractiveImageBlock: React.FC<InteractiveImageBlockProps> = ({
  topic,
  childId,
  childAge = 10,
  onShare,
  className = '',
  showHeader = true
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [fallbackSource, setFallbackSource] = useState<string | null>(null);
  
  // Determine the appropriate image style based on child age
  const getImageStyle = () => {
    if (childAge <= 7) {
      return 'vivid'; // Bright, colorful style for young children
    } else {
      return 'natural'; // More realistic style for older children
    }
  };
  
  // Clean up the topic to make a better prompt
  const cleanTopic = (topic: string) => {
    return topic
      .replace(/^(why|how|what|when|where|who)\s(can|do|does|is|are|did|would|will|should|could|has|have|had)\s/i, '')
      .replace(/\?$/, '')
      .trim();
  };
  
  // Generate an appropriate prompt based on the topic and child age
  const generatePrompt = () => {
    const cleanedTopic = cleanTopic(topic);
    
    if (childAge <= 7) {
      return `A simple, colorful, cartoon-style educational illustration about "${cleanedTopic}" for a ${childAge} year old child. Child-friendly, engaging, and fun.`;
    } else if (childAge <= 11) {
      return `An engaging educational illustration about "${cleanedTopic}" with vibrant colors and details, appropriate for a ${childAge} year old. Educational and accessible.`;
    } else {
      return `A detailed educational illustration about "${cleanedTopic}" with modern style, appropriate for a teenager. Informative and visually interesting.`;
    }
  };
  
  // Generate a fallback colored background as last resort
  const generateColorBackground = (seed: string) => {
    // Generate a deterministic but seemingly random color based on the topic string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the hash to generate an HSL color
    // Use a pleasing saturation and lightness, but let hue vary
    const hue = Math.abs(hash) % 360;
    
    // Return a linear gradient
    return `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${(hue + 40) % 360}, 70%, 50%))`;
  };
  
  const generateImage = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setProgress(10);
    setError(null);
    setFallbackSource(null);
    
    try {
      const prompt = generatePrompt();
      const style = getImageStyle();
      
      toast.loading("Generating image...");
      setProgress(30);
      
      console.log('Calling generate-dalle-image with prompt:', prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-dalle-image', {
        body: JSON.stringify({
          prompt,
          style,
          childAge,
          retryOnFail: true
        })
      });
      
      setProgress(90);
      
      if (error) {
        console.error('Error generating image:', error);
        setError(`Failed to generate image: ${error.message || 'Unknown error'}`);
        toast.error("Could not generate image");
        return;
      }
      
      if (data.error) {
        console.error('API Error:', data.error);
        setError(`Failed to generate image: ${data.error}`);
        toast.error("Could not generate image");
        
        // Try a fallback color background
        const colorBackground = generateColorBackground(topic);
        setFallbackSource('color');
        setImageUrl(colorBackground);
        return;
      }
      
      // If we got a fallback image from Unsplash
      if (data.source === 'fallback') {
        console.log('Using fallback image from Unsplash');
        setFallbackSource('unsplash');
        toast.success("Generated an alternative image");
      } else {
        toast.success("Image generated!");
      }
      
      setImageUrl(data.imageUrl);
      setProgress(100);
      
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(`Error: ${err.message || 'Unknown error'}`);
      toast.error("Could not generate image");
      
      // Try a fallback color background
      const colorBackground = generateColorBackground(topic);
      setFallbackSource('color');
      setImageUrl(colorBackground);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate the image when the component mounts or when the topic changes significantly
  useEffect(() => {
    if (topic) {
      generateImage();
    }
  }, [topic, retryCount]);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    }
    
    toast.success("Image shared with your parent!");
  };
  
  const handleDownload = () => {
    if (!imageUrl || fallbackSource === 'color') return;
    
    // If it's a real image URL (not a CSS gradient), create a download link
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `wonderwhiz-${cleanTopic(topic).replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Image saved!");
  };
  
  // Age-appropriate messages
  const getLoadingMessage = () => {
    if (childAge <= 7) {
      return "Drawing a picture for you...";
    } else if (childAge <= 11) {
      return "Creating your illustration...";
    } else {
      return "Generating visualization...";
    }
  };
  
  const getErrorMessage = () => {
    if (childAge <= 7) {
      return "Oops! I couldn't draw that picture.";
    } else if (childAge <= 11) {
      return "Sorry! We had trouble creating that image.";
    } else {
      return "Error: Could not generate the requested image.";
    }
  };
  
  return (
    <div className={cn("mb-6", className)}>
      {showHeader && (
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-wonderwhiz-light-purple/50 flex items-center justify-center mr-3">
            <Image className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white font-nunito">Visualize This</h2>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 backdrop-blur-md border border-wonderwhiz-light-purple/30 rounded-xl p-4 text-center"
          >
            <div className="py-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-wonderwhiz-vibrant-yellow animate-pulse" />
              <p className="text-white mb-4">{getLoadingMessage()}</p>
              <div className="w-full max-w-xs mx-auto mb-2">
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>
              <p className="text-white/60 text-sm">{progress}% complete</p>
            </div>
          </motion.div>
        ) : error && !imageUrl ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BlockError
              message={getErrorMessage()}
              error={new Error(error)}
              onRetry={handleRetry}
              childAge={childAge}
            />
          </motion.div>
        ) : imageUrl ? (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 backdrop-blur-md border border-wonderwhiz-light-purple/30 rounded-xl overflow-hidden"
          >
            {fallbackSource === 'color' ? (
              <div 
                className="w-full aspect-video rounded-t-xl flex items-center justify-center"
                style={{ background: imageUrl }}
              >
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-white/80" />
                  <p className="text-white text-center text-sm">
                    {childAge <= 7 
                      ? "Use your imagination!" 
                      : "No image available - use your imagination"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-t-xl overflow-hidden bg-black/30">
                <img 
                  src={imageUrl} 
                  alt={`Visualization of ${topic}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {fallbackSource === 'unsplash' && (
              <div className="bg-wonderwhiz-deep-purple/80 text-white/80 px-3 py-1 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {childAge <= 7 
                  ? "We found a nice picture instead!" 
                  : "We used an alternative image source"}
              </div>
            )}
            
            <div className="p-4">
              <p className="text-white/90 text-sm mb-4 font-inter">
                {childAge <= 7 
                  ? `A picture about ${cleanTopic(topic)}` 
                  : `Visual representation of ${cleanTopic(topic)}`}
              </p>
              
              <div className="flex space-x-2">
                {fallbackSource !== 'color' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Save
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                >
                  <Share2 className="h-3.5 w-3.5 mr-1.5" />
                  Share
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white ml-auto"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  New Image
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveImageBlock;
