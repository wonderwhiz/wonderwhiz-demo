
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Lock } from 'lucide-react';

interface ConstellationNode {
  id: string;
  title: string;
  x: number;
  y: number;
  size: number;
  color: string;
  locked?: boolean;
}

interface ConstellationEdge {
  source: string;
  target: string;
  strength: number;
}

interface KnowledgeConstellationProps {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  onNodeClick: (nodeId: string) => void;
  activeNodeId?: string;
}

const KnowledgeConstellation: React.FC<KnowledgeConstellationProps> = ({ 
  nodes, 
  edges, 
  onNodeClick,
  activeNodeId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw constellation edges on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawEdges();
      }
    };
    
    // Draw the edges between nodes
    const drawEdges = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        
        if (source && target) {
          ctx.beginPath();
          
          // Calculate absolute positions based on percentage
          const sourceX = canvas.width * (source.x / 100);
          const sourceY = canvas.height * (source.y / 100);
          const targetX = canvas.width * (target.x / 100);
          const targetY = canvas.height * (target.y / 100);
          
          ctx.moveTo(sourceX, sourceY);
          ctx.lineTo(targetX, targetY);
          
          // Gradient based on strength
          const gradient = ctx.createLinearGradient(sourceX, sourceY, targetX, targetY);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 + edge.strength * 0.2})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, ${0.05 + edge.strength * 0.1})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1 + edge.strength;
          ctx.stroke();
        }
      });
    };
    
    // Initialize and handle resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodes, edges]);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            zIndex: node.id === activeNodeId ? 20 : 10
          }}
          animate={{
            scale: node.id === activeNodeId ? 1.2 : 1,
            filter: `brightness(${node.id === activeNodeId ? 1.5 : 1})`
          }}
          whileHover={{ scale: node.locked ? 1 : 1.1 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <button
            className={`relative flex items-center justify-center rounded-full overflow-hidden
              ${node.locked ? 'bg-gray-700/50 cursor-not-allowed' : 'cursor-pointer bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-bright-pink'}`}
            style={{ 
              width: `${node.size}px`, 
              height: `${node.size}px`,
              boxShadow: node.id === activeNodeId 
                ? '0 0 15px 5px rgba(255,255,255,0.3)' 
                : '0 0 10px 2px rgba(255,255,255,0.1)'
            }}
            onClick={() => !node.locked && onNodeClick(node.id)}
          >
            {node.locked ? (
              <Lock className="w-1/3 h-1/3 text-white/60" />
            ) : (
              <Star 
                className="w-1/2 h-1/2 text-white animate-pulse" 
                fill={node.id === activeNodeId ? "white" : node.color} 
              />
            )}
            
            <motion.div 
              className="absolute inset-0 bg-white/10 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          </button>
          
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2
            text-xs font-medium text-center whitespace-nowrap
            ${node.id === activeNodeId ? 'text-white' : 'text-white/70'}
            ${node.locked ? 'text-white/40' : ''}`}>
            {node.title}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KnowledgeConstellation;
