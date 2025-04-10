
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Sparkles, ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionsPanelProps {
  blockType: string;
  blockContent: any;
  specialistId: string;
  onRabbitHoleClick: (question: string) => void;
}

const ConnectionsPanel: React.FC<ConnectionsPanelProps> = ({
  blockType,
  blockContent,
  specialistId,
  onRabbitHoleClick
}) => {
  const [connections, setConnections] = useState<{ title: string; description: string }[]>([]);
  
  useEffect(() => {
    // Generate connections based on content type and specialist
    const topic = extractMainTopic(blockContent, blockType);
    
    const generateConnections = () => {
      const newConnections: { title: string; description: string }[] = [];
      
      // Create connections based on specialist expertise
      switch (specialistId) {
        case 'nova':
          newConnections.push(
            { 
              title: `The Science Behind ${topic}`, 
              description: `Discover the physics and chemistry that makes ${topic} possible.`
            },
            { 
              title: `${topic} Throughout History`, 
              description: `How has our understanding of ${topic} evolved over time?`
            }
          );
          break;
        case 'prism':
          newConnections.push(
            { 
              title: `${topic} in Different Cultures`, 
              description: `How do different societies around the world approach ${topic}?`
            },
            { 
              title: `Technology and ${topic}`, 
              description: `How modern innovations are transforming our understanding of ${topic}.`
            }
          );
          break;
        case 'atlas':
          newConnections.push(
            { 
              title: `Modern Applications of ${topic}`, 
              description: `How ${topic} influences our world today.`
            },
            { 
              title: `The Future of ${topic}`, 
              description: `What might ${topic} look like in 50 years?`
            }
          );
          break;
        case 'spark':
          newConnections.push(
            { 
              title: `${topic} in Art and Literature`, 
              description: `How creative minds have been inspired by ${topic}.`
            },
            { 
              title: `The Psychology of ${topic}`, 
              description: `How ${topic} affects our thinking and emotions.`
            }
          );
          break;
        case 'pixel':
          newConnections.push(
            { 
              title: `${topic} Data Visualization`, 
              description: `Using technology to understand ${topic} in new ways.`
            },
            { 
              title: `DIY Projects Related to ${topic}`, 
              description: `Hands-on activities to explore ${topic} at home.`
            }
          );
          break;
        case 'lotus':
          newConnections.push(
            { 
              title: `${topic} in Nature`, 
              description: `Natural world connections and examples of ${topic}.`
            },
            { 
              title: `Mindfulness Practices for Understanding ${topic}`, 
              description: `Reflective approaches to deepen your knowledge of ${topic}.`
            }
          );
          break;
        default:
          newConnections.push(
            { 
              title: `More About ${topic}`, 
              description: `Continue your exploration of ${topic}.`
            },
            { 
              title: `Related Topics to ${topic}`, 
              description: `Discover subjects connected to ${topic}.`
            }
          );
      }
      
      setConnections(newConnections);
    };
    
    generateConnections();
  }, [blockContent, blockType, specialistId]);
  
  // Extract main topic from content
  const extractMainTopic = (content: any, type: string): string => {
    if (!content) return "this topic";
    
    if (type === 'fact' || type === 'funFact') {
      const words = content.fact?.split(' ') || [];
      // Extract likely noun phrases - simplified version
      if (words.length > 5) {
        return words.slice(0, 3).join(' ');
      }
      return content.fact?.split(' ').slice(0, 2).join(' ') || "this topic";
    }
    
    if (content.title) return content.title;
    if (content.topic) return content.topic;
    
    return "this topic";
  };

  const handleConnectionClick = (title: string) => {
    if (onRabbitHoleClick) {
      onRabbitHoleClick(title);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-4 bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-purple/20 backdrop-blur-sm rounded-lg p-4 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <Network className="h-5 w-5 text-wonderwhiz-bright-pink" />
        <h4 className="text-white font-medium">Knowledge Connections</h4>
      </div>
      
      <div className="space-y-3">
        {connections.map((connection, idx) => (
          <motion.button
            key={idx}
            className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnectionClick(connection.title)}
          >
            <div className="flex items-start">
              <div className="mt-0.5 mr-3 w-6 h-6 rounded-full bg-wonderwhiz-gold/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-gold" />
              </div>
              
              <div>
                <h5 className="text-white font-medium text-sm group-hover:text-wonderwhiz-bright-pink transition-colors">
                  {connection.title}
                </h5>
                <p className="text-white/70 text-xs mt-1">
                  {connection.description}
                </p>
              </div>
              
              <div className="ml-auto pl-2 flex-shrink-0">
                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-wonderwhiz-bright-pink group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
          onClick={() => onRabbitHoleClick("More topics to explore")}
        >
          <Compass className="mr-2 h-4 w-4 text-wonderwhiz-gold" />
          <span>Explore Your Wonder Path</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ConnectionsPanel;
