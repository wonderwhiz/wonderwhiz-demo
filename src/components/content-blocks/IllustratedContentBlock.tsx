
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
  
  // Fallback images based on topics
  const fallbackImages = {
    ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
    volcano: "https://images.unsplash.com/photo-1562117532-14a6c72858c9?q=80&w=1000&auto=format&fit=crop",
    space: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
    dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1000&auto=format&fit=crop",
    robot: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop",
    animal: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1000&auto=format&fit=crop",
    plant: "https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1000&auto=format&fit=crop",
    earth: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
  };
  
  // Relevant facts based on topics
  const topicFacts = {
    ocean: "The ocean contains 97% of Earth's water and covers more than 70% of the planet's surface. Scientists believe we've explored less than 20% of our oceans, making them one of Earth's last great frontiers!",
    volcano: "Volcanoes aren't just on Earth - they exist on other planets too! Venus has more volcanoes than any other planet in our solar system, with over 1,600 major ones covering its surface.",
    space: "Space is completely silent because there is no air or atmosphere for sound waves to travel through. Any explosion you might see in space would be completely silent!",
    dinosaur: "Scientists have discovered over 700 different species of dinosaurs, but believe there are many more to find. Some estimates suggest we may have only found 25% of all dinosaur species that ever lived!",
    robot: "The word 'robot' comes from the Czech word 'robota' which means forced labor or work. It was first used in a 1920 play called 'R.U.R.' by Karel Čapek about artificial people who rebelled against their human creators.",
    animal: "There are over 8.7 million species of animals on Earth, but scientists believe that up to 86% of land species and 91% of sea species have yet to be discovered and cataloged!",
    plant: "Plants communicate with each other through an underground network of fungi called mycelium, sometimes called the 'Wood Wide Web.' They can share nutrients and even warn each other about threats!",
    earth: "Earth is the only planet not named after a god. All other planets in our solar system are named after Roman gods or goddesses."
  };
  
  const getFallbackImage = (topic: string) => {
    // Find the most relevant fallback image by checking if the topic contains any of our keywords
    const relevantTopic = Object.keys(fallbackImages).find(key => 
      topic.toLowerCase().includes(key)
    );
    
    return relevantTopic ? fallbackImages[relevantTopic] : fallbackImages.earth;
  };
  
  const getTopicFact = (topic: string) => {
    // Find the most relevant fact by checking if the topic contains any of our keywords
    const relevantTopic = Object.keys(topicFacts).find(key => 
      topic.toLowerCase().includes(key)
    );
    
    return relevantTopic ? 
      topicFacts[relevantTopic] : 
      `Explorers and scientists have spent centuries trying to understand all the secrets of ${topic}! This journey of discovery continues today with new technologies helping us learn more every day.`;
  };
  
  useEffect(() => {
    async function loadContentWithImage() {
      if (!topic) return;
      
      setIsLoading(true);
      try {
        const childAge = childProfile?.age ? Number(childProfile.age) : 10;
        const generatedImageUrl = await generateContextualImage(topic, childAge);
        if (generatedImageUrl) {
          setImageUrl(generatedImageUrl);
          setFact(getTopicFact(topic));
        } else {
          // If no image was generated, use a fallback
          setImageUrl(getFallbackImage(topic));
          setFact(getTopicFact(topic));
        }
      } catch (error) {
        console.error('Error loading contextual image:', error);
        // Use fallback image and fact if there's an error
        setImageUrl(getFallbackImage(topic));
        setFact(getTopicFact(topic));
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
                  onError={() => {
                    console.log("Image failed to load, using fallback");
                    setImageUrl(getFallbackImage(topic));
                  }}
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
