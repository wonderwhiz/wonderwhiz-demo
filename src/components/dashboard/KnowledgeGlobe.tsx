
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KnowledgeGlobeProps {
  pastCurios: any[];
  childProfile: any;
}

const KnowledgeGlobe: React.FC<KnowledgeGlobeProps> = ({ pastCurios, childProfile }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  
  // Generate topics from past curios and child interests
  const topics = React.useMemo(() => {
    const fromCurios = pastCurios.map(curio => curio.title || curio.query || 'Exploration');
    const fromInterests = childProfile?.interests || [];
    const allTopics = [...fromCurios, ...fromInterests];
    
    // Deduplicate and take up to 30 topics
    return Array.from(new Set(allTopics)).slice(0, 30);
  }, [pastCurios, childProfile]);
  
  useEffect(() => {
    if (!canvasRef.current || topics.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Create nodes for visualization
    const nodes = topics.map((topic, index) => {
      const size = Math.random() * 10 + 5;
      const depth = Math.random() * 2 - 1;
      const angle = Math.random() * Math.PI * 2;
      
      return {
        topic,
        size,
        x: Math.cos(angle) * (100 + Math.random() * 50) + canvas.clientWidth / 2,
        y: Math.sin(angle) * (100 + Math.random() * 50) + canvas.clientHeight / 2,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        depth,
        color: getTopicColor(topic),
      };
    });
    
    // Animation loop
    let animationFrameId: number;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      
      // Draw connections
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.5 + (node.depth + 1) * 0.25;
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary check
        if (node.x < node.size || node.x > canvas.clientWidth - node.size) {
          node.vx *= -1;
        }
        if (node.y < node.size || node.y > canvas.clientHeight - node.size) {
          node.vy *= -1;
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    setTimeout(() => {
      setLoaded(true);
      render();
    }, 100);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [topics]);
  
  const getTopicColor = (topic: string) => {
    // Map topics to colors based on category
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('space') || topicLower.includes('planet') || topicLower.includes('star')) {
      return 'rgba(79, 70, 229, 0.8)'; // indigo
    } else if (topicLower.includes('animal') || topicLower.includes('nature')) {
      return 'rgba(16, 185, 129, 0.8)'; // emerald
    } else if (topicLower.includes('science') || topicLower.includes('experiment')) {
      return 'rgba(236, 72, 153, 0.8)'; // pink
    } else if (topicLower.includes('history') || topicLower.includes('ancient')) {
      return 'rgba(245, 158, 11, 0.8)'; // amber
    } else {
      return 'rgba(99, 102, 241, 0.8)'; // indigo
    }
  };
  
  return (
    <motion.div 
      className="relative w-full h-60 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full" 
          style={{ display: 'block' }}
        />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h3 className="text-xl font-medium text-white mb-1">Your Knowledge Universe</h3>
          <p className="text-white/60 text-sm">Explore {topics.length} topics and counting</p>
        </div>
      </div>
    </motion.div>
  );
};

export default KnowledgeGlobe;
