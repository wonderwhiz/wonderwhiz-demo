
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Image as ImageIcon, Share2, RotateCw, Download, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { BlockError } from '@/components/content-blocks/BlockError';
import { Progress } from '@/components/ui/progress';

interface InteractiveImageBlockProps {
  topic: string;
  childId?: string;
  childAge?: number;
  onShare?: () => void;
  style?: 'cartoon' | 'realistic' | 'watercolor';
}

const InteractiveImageBlock: React.FC<InteractiveImageBlockProps> = ({
  topic,
  childId,
  childAge = 10,
  onShare,
  style = 'cartoon'
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    setGenerationProgress(0);
    
    // Start progress animation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev; // Cap at 90% until actual completion
        return prev + Math.random() * 15;
      });
    }, 1000);
    
    try {
      toast.info(
        childAge < 8 
          ? "Drawing something magical just for you!" 
          : "Generating your custom illustration...",
        { duration: 3000 }
      );
      
      console.info(`Generating image for topic: "${topic}" with style: ${style}`);
      
      const { data, error } = await supabase.functions.invoke('generate-dalle-image', {
        body: { 
          prompt: getPrompt(),
          style,
          childAge,
          retryOnFail: true
        }
      });
      
      clearInterval(progressInterval);
      
      if (error) {
        console.error('DALL-E generation error:', error);
        throw new Error(error.message || "Image generation failed");
      }
      
      if (data?.imageUrl) {
        setGenerationProgress(100);
        setImageUrl(data.imageUrl);
        
        toast.success(
          childAge < 8 
            ? "Ta-da! Your magical picture is ready!" 
            : "Image generated successfully!",
          { duration: 3000 }
        );
      } else if (data?.fallbackImageUrl) {
        setGenerationProgress(100);
        setImageUrl(data.fallbackImageUrl);
        console.log('Using fallback image from DALL-E function');
      } else {
        throw new Error("No image was generated");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Error generating image:', err);
      setError(err);
      
      // Try to get a fallback image
      try {
        const fallbackUrl = await getFallbackImageUrl();
        setImageUrl(fallbackUrl);
        setGenerationProgress(100);
      } catch (fallbackErr) {
        console.error('Fallback image also failed:', fallbackErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackImageUrl = async (): Promise<string> => {
    // For now, just return a simple color background as absolute fallback
    const searchTerm = topic.split(' ').slice(0, 2).join(' ');
    try {
      // Try to get an image from Unsplash
      const response = await fetch(`https://source.unsplash.com/400x300/?${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        return response.url;
      }
    } catch (err) {
      console.warn('Unsplash fallback failed, using solid color', err);
    }
    
    // If Unsplash fails, return a colored placeholder
    return `https://placehold.co/600x400/252238/FFFFFF?text=${encodeURIComponent(topic)}`;
  };

  const getPrompt = () => {
    // Create age-appropriate and style-specific prompts
    const basePrompt = `Educational illustration about ${topic}`;
    
    if (childAge <= 7) {
      return `${basePrompt}, ${style} style, vibrant colors, simple shapes, kid-friendly illustration, educational, vibrant colors, stylized, age-appropriate, learning material, engaging illustration`;
    } else if (childAge <= 11) {
      return `${basePrompt}, ${style} style, educational illustration, age-appropriate (${childAge} years old), engaging, colorful, informative, learning material`;
    } else {
      return `${basePrompt}, ${style} style, detailed educational illustration, informative visualization, age-appropriate for teens, educational content, learning material`;
    }
  };

  const handleRetry = () => {
    setRetries(retries + 1);
    generateImage();
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `wonderwhiz-${topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(
      childAge < 8 
        ? "Your magical picture has been saved!" 
        : "Image downloaded successfully!"
    );
  };

  useEffect(() => {
    generateImage();
  }, [topic, style, childAge, retries]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/20"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            {isLoading ? (
              <Wand2 className="h-5 w-5 text-wonderwhiz-bright-pink mr-2 animate-pulse" />
            ) : (
              <Sparkles className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
            )}
            <h3 className="text-lg font-semibold text-white">
              {isLoading ? "Creating Wonder" : "Wonder Image"}
            </h3>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRetry}
              disabled={isLoading}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            {imageUrl && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownload}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                {onShare && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onShare}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {isLoading && (
          <div className="space-y-4">
            <div className="h-64 w-full bg-white/5 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Wand2 className="h-8 w-8 text-wonderwhiz-bright-pink mx-auto mb-3 animate-pulse" />
                  <p className="text-white/70 text-sm px-4">
                    {childAge < 8 
                      ? "Drawing something amazing..." 
                      : "Generating your custom illustration..."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress value={generationProgress} className="h-2 bg-white/10" />
              <p className="text-white/50 text-xs text-center">
                {generationProgress < 100 
                  ? "Creating your unique image..." 
                  : "Almost there..."}
              </p>
            </div>
          </div>
        )}
        
        {!isLoading && imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-lg overflow-hidden bg-black/20 group"
          >
            <img 
              src={imageUrl} 
              alt={`Illustration of ${topic}`}
              className="w-full h-auto object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
              onError={handleRetry}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        )}
        
        {!isLoading && error && !imageUrl && (
          <BlockError 
            error={error}
            message={childAge < 8 
              ? "Oops! The magical drawing machine needs a break. Let's try again!" 
              : "We couldn't generate this image. Please try again."}
            onRetry={handleRetry}
            childAge={childAge}
          />
        )}
        
        <div className="mt-3 text-sm text-white/70 text-center">
          {error && imageUrl 
            ? (childAge < 8 
                ? "I found a similar picture for you!" 
                : "Using an alternative image for this topic")
            : `A magical illustration about "${topic}"`
          }
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveImageBlock;
