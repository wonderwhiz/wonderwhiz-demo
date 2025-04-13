
import React from 'react';
import { motion } from 'framer-motion';
import { Network, ArrowRight, Compass, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Connection {
  title: string;
  description: string;
  type: 'related' | 'deeper' | 'broader';
}

interface ConnectionsVisualizerProps {
  currentTopic: string;
  connections: Connection[];
  onConnectionClick: (title: string) => void;
  childAge?: number;
}

const ConnectionsVisualizer: React.FC<ConnectionsVisualizerProps> = ({
  currentTopic,
  connections,
  onConnectionClick,
  childAge = 10
}) => {
  // Simplify for younger children
  const displayConnections = childAge < 8 
    ? connections.slice(0, 2) // Show fewer connections for young children
    : connections;
  
  // Get icon based on connection type
  const getConnectionIcon = (type: string) => {
    switch(type) {
      case 'deeper':
        return <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />;
      case 'broader':
        return <Network className="h-4 w-4 text-wonderwhiz-cyan" />;
      default:
        return <Lightbulb className="h-4 w-4 text-wonderwhiz-gold" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-wonderwhiz-deep-purple/30 border border-white/10 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Network className="h-5 w-5 text-wonderwhiz-bright-pink" />
        <h4 className="text-white font-medium">
          {childAge < 8 ? "More to Discover!" : "Knowledge Connections"}
        </h4>
      </div>
      
      {/* Visual connection map - Simplified for younger children */}
      <div className="relative mb-4">
        <div className="bg-wonderwhiz-purple/20 rounded-lg p-3 text-center border border-white/10 mb-3">
          <p className="text-white font-medium">{currentTopic}</p>
        </div>
        
        <div className={`grid ${childAge < 10 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
          {displayConnections.map((connection, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 group"
              onClick={() => onConnectionClick(connection.title)}
            >
              <div className="mr-3 mt-0.5 w-8 h-8 rounded-full bg-wonderwhiz-deep-purple/60 flex items-center justify-center flex-shrink-0">
                {getConnectionIcon(connection.type)}
              </div>
              
              <div className="flex-1">
                <h5 className="text-white font-medium text-sm group-hover:text-wonderwhiz-bright-pink transition-colors">
                  {connection.title}
                </h5>
                {(childAge >= 8 || idx === 0) && (
                  <p className="text-white/70 text-xs mt-1">
                    {connection.description}
                  </p>
                )}
              </div>
              
              <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-wonderwhiz-bright-pink group-hover:translate-x-1 transition-all self-center ml-2" />
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Age-adaptive prompt */}
      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
          onClick={() => onConnectionClick(childAge < 8 ? "Tell me more" : "Explore related topics")}
        >
          <Compass className="mr-2 h-4 w-4 text-wonderwhiz-gold" />
          <span>{childAge < 8 ? "Find More Wonders!" : "Explore Your Wonder Path"}</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ConnectionsVisualizer;
