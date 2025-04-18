
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentGeneratorProps {
  childId: string;
  childAge: number;
  userInterests: Array<{ topic: string; affinity: number }>;
  onContentGenerated: (content: any) => void;
  isVisible: boolean;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  childId,
  childAge,
  userInterests,
  onContentGenerated,
  isVisible
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Simulate content generation process
    const simulateGeneration = () => {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Create a progress interval
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 5 + 2;
        });
      }, 300);
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        // Generate content based on user's top interests
        const topInterests = userInterests
          .sort((a, b) => b.affinity - a.affinity)
          .slice(0, 3)
          .map(i => i.topic);
        
        const content = generatePersonalizedContent(topInterests, childAge);
        setGeneratedContent(content);
        onContentGenerated(content);
        
        // Reset after a short delay
        setTimeout(() => {
          setIsGenerating(false);
        }, 1000);
      }, 3000);
    };
    
    simulateGeneration();
  }, [isVisible, childAge, userInterests, onContentGenerated]);
  
  // Generate simulated personalized content
  const generatePersonalizedContent = (topics: string[], age: number) => {
    // Adjust content complexity based on age
    const complexity = age < 8 ? 'simple' : age < 12 ? 'moderate' : 'advanced';
    
    // Create a content object based on top interests and age-appropriate complexity
    return {
      title: `Exploring ${topics[0]}${topics[1] ? ` and ${topics[1]}` : ''}`,
      sections: [
        {
          type: 'introduction',
          content: `Let's learn about ${topics[0]}${topics[1] ? ` and ${topics[1]}` : ''}!`,
          complexity
        },
        {
          type: 'facts',
          content: [
            `${topics[0]} is really interesting because...`,
            `Did you know that ${topics[0]} can...`,
            topics[1] ? `${topics[1]} is connected to ${topics[0]} by...` : null
          ].filter(Boolean),
          complexity
        },
        {
          type: 'activity',
          content: `Try this fun experiment about ${topics[0]}...`,
          complexity
        },
        {
          type: 'connections',
          relatedTopics: topics.concat(
            ['Science', 'History', 'Geography', 'Art'].filter(t => !topics.includes(t))
          ).slice(0, 5),
          complexity
        }
      ],
      mediaElements: [
        { type: 'image', subject: topics[0] },
        { type: 'animation', subject: topics[0] },
        topics[1] ? { type: 'interactive', subject: topics[1] } : null
      ].filter(Boolean),
      ageAppropriate: true,
      generatedTimestamp: Date.now()
    };
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div className="bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-light-purple p-8 rounded-2xl max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              AI Content Generation
            </h3>
            
            {isGenerating ? (
              <div className="space-y-4">
                <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
                    animate={{ width: `${generationProgress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>Analyzing interests...</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white"
                        animate={{
                          opacity: [0.2, 1, 0.2],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/80 mb-2">
                  Content successfully generated based on your interests!
                </p>
                <p className="text-wonderwhiz-vibrant-yellow font-bold">
                  {generatedContent?.title}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentGenerator;
