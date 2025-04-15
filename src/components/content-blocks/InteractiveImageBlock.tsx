
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, RefreshCw, Download, Share2, Wand2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeminiImageGeneration } from '@/hooks/useGeminiImageGeneration';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InteractiveImageBlockProps {
  topic: string;
  childId?: string;
  childAge?: number;
  onShare?: () => void;
}

const imageStyles = [
  { id: 'cartoon', name: 'Cartoon', description: 'Fun, colorful cartoon style' },
  { id: 'realistic', name: 'Realistic', description: 'Photo-realistic depiction' },
  { id: 'painting', name: 'Painting', description: 'Artistic painting style' },
  { id: 'sketch', name: 'Sketch', description: 'Hand-drawn sketch look' },
  { id: 'isometric', name: 'Isometric', description: '3D isometric illustration' }
];

// Fallback images by topic category
const fallbackImages = {
  space: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop",
  astronomy: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop",
  stars: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&auto=format&fit=crop",
  night: "https://images.unsplash.com/photo-1534841090574-cba2d662b62e?w=800&auto=format&fit=crop",
  planets: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800&auto=format&fit=crop",
  animals: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop",
  ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&auto=format&fit=crop",
  science: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
  volcanoes: "https://images.unsplash.com/photo-1577131313276-8276f3ffc538?w=800&auto=format&fit=crop"
};

const InteractiveImageBlock: React.FC<InteractiveImageBlockProps> = ({
  topic,
  childId,
  childAge = 10,
  onShare
}) => {
  const [currentStyle, setCurrentStyle] = useState('cartoon');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  
  const { 
    generateImage, 
    isGenerating, 
    imageUrl, 
    setImageUrl, 
    generationError, 
    resetImage, 
    fallbackSource,
    setFallbackSource 
  } = useGeminiImageGeneration({ childAge, maxRetries: 3 });
  
  useEffect(() => {
    if (topic) {
      handleGenerateImage();
    }
  }, [topic]);
  
  const getTopicCategory = (topic: string): string => {
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('volcano')) {
      return 'volcanoes';
    } else if (lowerTopic.includes('star') || lowerTopic.includes('night sky') || 
        lowerTopic.includes('constellation') || lowerTopic.includes('astronomy')) {
      return 'stars';
    } else if (lowerTopic.includes('planet') || lowerTopic.includes('solar system') || 
               lowerTopic.includes('galaxy') || lowerTopic.includes('universe')) {
      return 'planets';
    } else if (lowerTopic.includes('space') || lowerTopic.includes('cosmos')) {
      return 'space';
    } else if (lowerTopic.includes('animal') || lowerTopic.includes('wildlife')) {
      return 'animals';
    } else if (lowerTopic.includes('ocean') || lowerTopic.includes('sea') || 
               lowerTopic.includes('marine')) {
      return 'ocean';
    } else if (lowerTopic.includes('science') || lowerTopic.includes('experiment') || 
               lowerTopic.includes('chemistry') || lowerTopic.includes('physics')) {
      return 'science';
    }
    
    return 'science'; // Default to science for the current topic
  };
  
  const getFallbackImage = () => {
    const category = getTopicCategory(topic);
    return fallbackImages[category] || fallbackImages.science;
  };
  
  const handleGenerateImage = async () => {
    try {
      resetImage();
      setIsImageLoaded(false);
      setImageLoadError(false);
      
      // Create style-specific prompt
      let stylePrompt = '';
      switch (currentStyle) {
        case 'cartoon':
          stylePrompt = ', cartoon style, vibrant colors, simple shapes, kid-friendly illustration';
          break;
        case 'realistic':
          stylePrompt = ', realistic style, detailed, photographic quality';
          break;
        case 'painting':
          stylePrompt = ', digital painting style, artistic, colorful, illustrative';
          break;
        case 'sketch':
          stylePrompt = ', hand-drawn sketch style, pencil drawing, line art';
          break;
        case 'isometric':
          stylePrompt = ', isometric 3D illustration style, geometric, colorful';
          break;
        default:
          stylePrompt = ', colorful illustration, educational';
      }
      
      // Generate a prompt based on the topic
      const prompt = `Educational illustration about ${topic}${stylePrompt}`;
      
      const generatedImageUrl = await generateImage(prompt, currentStyle);
      if (!generatedImageUrl) {
        console.log('No image URL returned from generateImage');
        setImageLoadError(true);
        setConsecutiveFailures(prev => prev + 1);
        
        // If we've had multiple failures, use a reliable fallback
        if (consecutiveFailures >= 1) {
          const fallback = getFallbackImage();
          setImageUrl(fallback);
          setFallbackSource('unsplash');
          toast.info("Using a reference image instead", {
            duration: 3000
          });
        }
      } else {
        setConsecutiveFailures(0);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      setImageLoadError(true);
      setConsecutiveFailures(prev => prev + 1);
      
      toast.error('Could not generate image at this time');
      
      // Use fallback immediately after failure
      const fallback = getFallbackImage();
      setImageUrl(fallback);
      setFallbackSource('unsplash');
      toast.info("Using a reference image instead", {
        duration: 3000
      });
    }
  };
  
  const handleStyleChange = (style: string) => {
    setCurrentStyle(style);
    handleGenerateImage();
  };
  
  const handleImageError = () => {
    setImageLoadError(true);
    setIsImageLoaded(false);
    
    // If image loading fails, try a fallback
    if (!fallbackSource || fallbackSource === 'error') {
      const fallback = getFallbackImage();
      setImageUrl(fallback);
      setFallbackSource('unsplash');
      toast.info("Using a reference image instead", {
        duration: 3000
      });
    }
  };
  
  const handleDownload = () => {
    if (imageUrl) {
      // For placeholder images or data URLs, we need to handle differently
      if (imageUrl.startsWith('data:')) {
        // For data URLs
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-${currentStyle}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For remote URLs, fetch the image first
        fetch(imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-${currentStyle}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          })
          .catch(err => {
            console.error('Failed to download image:', err);
            toast.error('Could not download image');
          });
      }
      
      toast.success('Image downloading...');
    }
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      toast.success('Image shared successfully!');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-wonderwhiz-purple border border-white/10 rounded-xl overflow-hidden mb-8"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Image className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium text-white">Visual Exploration</h3>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white/70"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              disabled={!imageUrl || isGenerating || imageLoadError}
              className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white/70"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              disabled={!imageUrl || isGenerating || imageLoadError}
              className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white/70"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-lg overflow-hidden bg-gray-900/50 mb-4">
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center space-y-2">
                <Wand2 className="h-8 w-8 text-purple-400 animate-pulse" />
                <p className="text-white/70 text-sm">Creating your visualization...</p>
              </div>
            </div>
          )}
          
          {imageUrl ? (
            <>
              <img 
                src={imageUrl} 
                alt={`Visualization of ${topic}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
                onError={handleImageError}
              />
              
              {isImageLoaded && fallbackSource && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {fallbackSource === 'dalle' ? 'DALL-E' : 
                   fallbackSource === 'gemini' ? 'Gemini AI' : 
                   fallbackSource === 'unsplash' ? 'Reference Image' :
                   fallbackSource === 'error' ? 'Placeholder' : 
                   fallbackSource}
                </div>
              )}
              
              {imageLoadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70">
                  <div className="text-center p-4">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-white/90 font-medium mb-1">Failed to load image</p>
                    <p className="text-white/60 text-sm mb-3">The image couldn't be generated or loaded</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateImage}
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            !isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/50 text-sm">
                  {generationError ? 'Unable to generate image' : 'No image generated yet'}
                </p>
              </div>
            )
          )}
        </div>
        
        <Tabs defaultValue="cartoon" value={currentStyle} onValueChange={handleStyleChange}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-5 bg-black/20">
            {imageStyles.map(style => (
              <TabsTrigger
                key={style.id}
                value={style.id}
                disabled={isGenerating}
                className="data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-100"
              >
                {style.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-2">
            <p className="text-xs text-white/60 text-center">
              {imageStyles.find(style => style.id === currentStyle)?.description || 'Select a visualization style'}
            </p>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default InteractiveImageBlock;
