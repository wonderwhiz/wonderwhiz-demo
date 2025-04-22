
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Image as ImageIcon, Share2, RotateCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { BlockError } from '@/components/content-blocks/BlockError';

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

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.info(`Calling generate-gemini-image with prompt: "${getPrompt()}" and style: ${style}`);
      
      const { data, error } = await supabase.functions.invoke('generate-gemini-image', {
        body: { 
          prompt: getPrompt(),
          style,
          childAge,
          retryOnFail: true
        }
      });
      
      console.info('Image generation response:', JSON.stringify(data, null, 2));
      
      if (error) {
        throw new Error(`Image generation failed: ${error.message}`);
      }
      
      if (!data || data.success === false) {
        // Try fallback to Unsplash if AI generation fails
        const unsplashUrl = await getFallbackImageUrl();
        setImageUrl(unsplashUrl);
        if (data?.error) {
          console.warn('AI image generation failed, using fallback image. Error:', data.error);
        }
      } else if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        // If data exists but no imageUrl, try Unsplash fallback
        const fallbackUrl = await getFallbackImageUrl();
        setImageUrl(fallbackUrl);
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(err);
      
      // Try to get a fallback image
      try {
        const fallbackUrl = await getFallbackImageUrl();
        setImageUrl(fallbackUrl);
      } catch (fallbackErr) {
        // If even fallback fails, show error state
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
    
    toast.success("Image downloaded!");
  };

  useEffect(() => {
    generateImage();
  }, [topic, style, childAge, retries]);

  // Display skeleton while loading
  if (isLoading) {
    return (
      <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/20 p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <ImageIcon className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
            <h3 className="text-lg font-semibold text-white">Generating Wonder Image</h3>
          </div>
        </div>
        
        <Skeleton className="h-64 w-full bg-white/5" />
        
        <div className="mt-3 text-sm text-white/70 text-center">
          Creating a visual for "{topic}"...
        </div>
      </div>
    );
  }

  // Display error if something went wrong and we have no image
  if (error && !imageUrl) {
    return (
      <BlockError 
        error={error}
        message="We couldn't generate an image for this topic."
        onRetry={handleRetry}
        childAge={childAge}
      />
    );
  }

  // Display the generated or fallback image
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
            <ImageIcon className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
            <h3 className="text-lg font-semibold text-white">Wonder Image</h3>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRetry}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
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
          </div>
        </div>
        
        {imageUrl && (
          <div className="relative rounded-lg overflow-hidden bg-black/20">
            <img 
              src={imageUrl} 
              alt={`Illustration of ${topic}`}
              className="w-full h-auto object-cover rounded-lg"
              onError={handleRetry}
            />
          </div>
        )}
        
        <div className="mt-3 text-sm text-white/70 text-center">
          {error ? 
            "Using a backup image - we'll try to generate a better one next time!" : 
            `Visual representation of "${topic}"`
          }
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveImageBlock;
