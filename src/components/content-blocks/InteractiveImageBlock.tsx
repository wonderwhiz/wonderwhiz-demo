
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, RefreshCw, Download, Share2, Wand2 } from 'lucide-react';
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

const InteractiveImageBlock: React.FC<InteractiveImageBlockProps> = ({
  topic,
  childId,
  childAge = 10,
  onShare
}) => {
  const [currentStyle, setCurrentStyle] = useState('cartoon');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { 
    generateImage, 
    isGenerating, 
    imageUrl, 
    generationError, 
    resetImage, 
    fallbackSource 
  } = useGeminiImageGeneration({ childAge });
  
  useEffect(() => {
    if (topic) {
      handleGenerateImage();
    }
  }, [topic]);
  
  const handleGenerateImage = async () => {
    try {
      resetImage();
      setIsImageLoaded(false);
      
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
      console.log(`Generating image with prompt: ${prompt}`);
      
      const generatedImageUrl = await generateImage(prompt, currentStyle);
      if (generatedImageUrl) {
        console.log('Image generated successfully:', generatedImageUrl.substring(0, 50) + '...');
      } else {
        console.error('No image URL returned from generateImage');
        toast.error('Could not generate image');
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('Could not generate image at this time');
    }
  };
  
  const handleStyleChange = (style: string) => {
    setCurrentStyle(style);
    handleGenerateImage();
  };
  
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-${currentStyle}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image downloaded successfully!');
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
              disabled={!imageUrl || isGenerating}
              className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white/70"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              disabled={!imageUrl || isGenerating}
              className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white/70"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-lg overflow-hidden bg-gray-900/50 mb-4">
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center">
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
              />
              {fallbackSource && fallbackSource !== 'gemini' && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {fallbackSource === 'dalle' ? 'DALL-E' : fallbackSource === 'unsplash' ? 'Unsplash' : 'Reference Image'}
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
