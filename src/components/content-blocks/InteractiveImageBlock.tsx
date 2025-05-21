
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Share, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGroqGeneration } from '@/hooks/useGroqGeneration';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface InteractiveImageBlockProps {
  topic: string;
  childId?: string;
  childAge?: number;
  onShare?: () => void;
}

const InteractiveImageBlock: React.FC<InteractiveImageBlockProps> = ({
  topic,
  childId,
  childAge = 10,
  onShare
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loadingImage, setLoadingImage] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { generateContextualImage } = useGroqGeneration();
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    let isMounted = true;
    setLoadingImage(true);
    setImageError(false);
    
    // First try to get from storage if we have it
    const tryGetStoredImage = async () => {
      try {
        const { data: imageRecords } = await supabase
          .from('curio_images')
          .select('image_url')
          .eq('topic', topic.toLowerCase())
          .maybeSingle();
        
        if (imageRecords?.image_url) {
          if (isMounted) {
            setImageUrl(imageRecords.image_url);
            setLoadingImage(false);
          }
          return true;
        }
        return false;
      } catch (err) {
        console.error('Error fetching stored image:', err);
        return false;
      }
    };
    
    const generateImage = async () => {
      try {
        const hasStoredImage = await tryGetStoredImage();
        
        if (hasStoredImage) return;
        
        // Add fallback imagery for specific topics
        const fallbackImages: Record<string, string> = {
          ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
          volcano: "https://images.unsplash.com/photo-1562117532-14a6c72858c9?q=80&w=1000&auto=format&fit=crop",
          space: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
          dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1000&auto=format&fit=crop",
          rainbow: "https://images.unsplash.com/photo-1600865511428-eadfb242ca8c?q=80&w=1000&auto=format&fit=crop",
          brain: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop",
          weather: "https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=1000&auto=format&fit=crop"
        };
        
        const topicLower = topic.toLowerCase();
        
        // Check if we have a matching fallback image
        for (const [key, url] of Object.entries(fallbackImages)) {
          if (topicLower.includes(key)) {
            if (isMounted) {
              setImageUrl(url);
              setLoadingImage(false);
              
              // Store this for future use
              try {
                await supabase.from('curio_images').insert({
                  topic: topicLower,
                  image_url: url,
                  generation_method: 'fallback'
                });
              } catch (err) {
                console.error('Error storing fallback image:', err);
              }
            }
            return;
          }
        }
        
        // If no fallback is found, try to generate one
        const generatedImageUrl = await generateContextualImage(topic, childAge);
        
        if (isMounted && generatedImageUrl) {
          setImageUrl(generatedImageUrl);
          
          // Store this for future use
          try {
            await supabase.from('curio_images').insert({
              topic: topicLower,
              image_url: generatedImageUrl,
              generation_method: 'groq'
            });
          } catch (err) {
            console.error('Error storing generated image:', err);
          }
        }
      } catch (error) {
        console.error('Error generating image:', error);
        if (isMounted) {
          setImageError(true);
          // Set a default image as fallback
          setImageUrl('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop');
        }
      } finally {
        if (isMounted) {
          setLoadingImage(false);
        }
      }
    };
    
    generateImage();
    
    return () => {
      isMounted = false;
    };
  }, [topic, childAge, generateContextualImage]);
  
  const handleImageError = () => {
    setImageError(true);
    // Set a default image as fallback
    setImageUrl('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop');
  };
  
  const handleToggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      toast.info('Sharing feature coming soon!');
    }
  };
  
  const handleDownload = () => {
    if (imageRef.current && imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image downloaded successfully!');
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-b from-indigo-900/30 to-black/30 border-indigo-500/20 mb-8">
      <div className="relative">
        {loadingImage ? (
          <div className="aspect-[16/9] flex items-center justify-center bg-black/20 animate-pulse">
            <span className="text-white/60 text-sm">Generating a stunning visualization...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={handleToggleZoom}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={`Visualization of ${topic}`}
              className={`w-full object-cover transition-all duration-300 ${isZoomed ? 'aspect-auto max-h-[80vh]' : 'aspect-[16/9]'}`}
              onError={handleImageError}
            />
            
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-white/80 text-sm px-4 py-2 rounded bg-black/50">
                  Could not load image for {topic}
                </span>
              </div>
            )}
          </motion.div>
        )}
        
        {!loadingImage && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
              onClick={handleToggleZoom}
              title={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
              onClick={handleShare}
              title="Share image"
            >
              <Share size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
              onClick={handleDownload}
              title="Download image"
            >
              <Download size={16} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InteractiveImageBlock;
