
import React from 'react';
import { Network, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface KnowledgeConnectionsProps {
  mainTopic: string;
  childAge?: number;
  onTopicSelect: (topic: string) => void;
}

const KnowledgeConnections: React.FC<KnowledgeConnectionsProps> = ({
  mainTopic,
  childAge = 10,
  onTopicSelect
}) => {
  // Generate age-appropriate connections
  const generateConnections = () => {
    const connections = [];
    
    // Basic connections for younger kids
    if (childAge < 8) {
      connections.push(
        {
          title: `More about ${mainTopic}`,
          description: `Let's discover fun facts about ${mainTopic}!`,
          query: `Tell me fun facts about ${mainTopic} for kids`
        },
        {
          title: `${mainTopic} in our world`,
          description: `How do we see ${mainTopic} in everyday life?`,
          query: `How does ${mainTopic} affect our daily life? Explain for children`
        }
      );
    } 
    // Intermediate connections for middle-age kids
    else if (childAge < 13) {
      connections.push(
        {
          title: `How does ${mainTopic} work?`,
          description: `Discover the science behind ${mainTopic}`,
          query: `How does ${mainTopic} work? Explain the science simply`
        },
        {
          title: `History of ${mainTopic}`,
          description: `When and how was ${mainTopic} discovered or created?`,
          query: `What's the history of ${mainTopic}? Important milestones`
        },
        {
          title: `${mainTopic} facts and mysteries`,
          description: `Interesting things scientists are still learning`,
          query: `What are some mysteries or interesting facts about ${mainTopic}?`
        }
      );
    } 
    // Advanced connections for older kids
    else {
      connections.push(
        {
          title: `${mainTopic} in depth`,
          description: `Explore detailed concepts and principles`,
          query: `Explain the detailed concepts behind ${mainTopic}`
        },
        {
          title: `Future of ${mainTopic}`,
          description: `How might ${mainTopic} change or develop in the future?`,
          query: `How might ${mainTopic} evolve or change in the future? Current research and predictions`
        },
        {
          title: `${mainTopic} controversies`,
          description: `Different perspectives and debates`,
          query: `What are different perspectives or debates about ${mainTopic}?`
        },
        {
          title: `${mainTopic} careers`,
          description: `Jobs and studies related to this topic`,
          query: `What careers or studies are related to ${mainTopic}?`
        }
      );
    }
    
    return connections;
  };
  
  const connections = generateConnections();

  return (
    <div className="mt-6 bg-gradient-to-br from-wonderwhiz-deep-purple/20 to-wonderwhiz-purple/10 rounded-lg border border-white/10 p-4">
      <div className="flex items-center mb-3">
        <Network className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
        <h3 className="text-lg font-semibold text-white">
          {childAge < 8 ? "More Wonder Paths!" : "Knowledge Connections"}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {connections.map((connection, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            whileTap={{ y: 0 }}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 cursor-pointer group"
            onClick={() => onTopicSelect(connection.query)}
          >
            <div className="flex items-start">
              <div className="mt-0.5 bg-wonderwhiz-gold/20 p-1.5 rounded-full mr-3">
                <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-gold" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm group-hover:text-wonderwhiz-bright-pink transition-colors">
                  {connection.title}
                </h4>
                {childAge >= 8 && (
                  <p className="text-white/60 text-xs mt-1">
                    {connection.description}
                  </p>
                )}
              </div>
              
              <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-wonderwhiz-bright-pink group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeConnections;
