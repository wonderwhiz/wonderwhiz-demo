
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGroqGeneration } from '@/hooks/useGroqGeneration';
import { useChildProfile } from '@/hooks/use-child-profile';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, Share, MessageCircle } from 'lucide-react';

interface IllustratedContentBlockProps {
  topic: string;
  childId?: string;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onReply?: (reply: string) => void;
}

const IllustratedContentBlock: React.FC<IllustratedContentBlockProps> = ({
  topic,
  childId,
  onLike,
  onSave,
  onShare,
  onReply
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [fact, setFact] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { generateContextualImage } = useGroqGeneration();
  const { childProfile } = useChildProfile(childId);
  
  useEffect(() => {
    async function loadContentWithImage() {
      if (!topic) return;
      
      setIsLoading(true);
      try {
        const childAge = childProfile?.age ? Number(childProfile.age) : 10;
        const generatedImageUrl = await generateContextualImage(topic, childAge);
        if (generatedImageUrl) {
          setImageUrl(generatedImageUrl);
          setFact(`Explorers and scientists have spent centuries trying to understand all the secrets of ${topic}!`);
        }
      } catch (error) {
        console.error('Error loading contextual image:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadContentWithImage();
  }, [topic, childProfile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
            🚀
          </div>
          <div>
            <div className="text-white font-medium">Nova</div>
            <div className="text-white/60 text-xs">Space Expert</div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="aspect-video bg-white/10 rounded-lg mb-4 w-full"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
          </div>
        ) : (
          <>
            {imageUrl && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={`Illustration about ${topic}`}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            
            <p className="text-white/90 mb-4">{fact}</p>
            
            <p className="text-white/70 text-sm mb-4">
              What does this make you wonder about our incredible world?
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Heart className="h-4 w-4 mr-1" />
                <span>Like</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Bookmark className="h-4 w-4 mr-1" />
                <span>Save</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Share className="h-4 w-4 mr-1" />
                <span>Share</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply && onReply('')}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>Reply</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default IllustratedContentBlock;
