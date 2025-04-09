
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface KnowledgeGlobeProps {
  pastCurios: any[];
  childProfile: any;
}

const KnowledgeGlobe: React.FC<KnowledgeGlobeProps> = ({ 
  pastCurios = [],
  childProfile
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || pastCurios.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create knowledge nodes from past curios
    const nodes = pastCurios.map((curio, index) => {
      return {
        id: curio.id || index,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 5 + Math.random() * 5,
        color: getRandomColor(),
        speed: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        title: curio.title || 'Untitled',
        connections: []
      };
    });
    
    // Create connections between nodes
    if (nodes.length > 1) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // Connect to 1-3 random nodes
        const connectionCount = 1 + Math.floor(Math.random() * 3);
        
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * nodes.length);
          if (targetIndex !== i && !node.connections.includes(targetIndex)) {
            node.connections.push(targetIndex);
          }
        }
      }
    }
    
    // Animation loop
    let animationFrameId: number;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.lineWidth = 0.5;
      nodes.forEach(node => {
        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
          ctx.stroke();
        });
      });
      
      // Update and draw nodes
      nodes.forEach(node => {
        // Update position
        node.x += Math.cos(node.angle) * node.speed;
        node.y += Math.sin(node.angle) * node.speed;
        
        // Bounce off edges
        if (node.x <= node.radius || node.x >= canvas.width - node.radius) {
          node.angle = Math.PI - node.angle;
        }
        if (node.y <= node.radius || node.y >= canvas.height - node.radius) {
          node.angle = -node.angle;
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pastCurios]);
  
  function getRandomColor() {
    const colors = [
      'rgba(59, 130, 246, 0.8)', // blue
      'rgba(236, 72, 153, 0.8)',  // pink
      'rgba(139, 92, 246, 0.8)',  // purple
      'rgba(245, 158, 11, 0.8)',  // amber
      'rgba(16, 185, 129, 0.8)'   // emerald
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <motion.div 
      className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-md border border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {pastCurios.length === 0 && (
          <div className="text-center">
            <h3 className="text-white font-medium">Your Knowledge Universe</h3>
            <p className="text-white/60 text-sm mt-1">
              Explore to see your universe grow
            </p>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white text-sm font-medium">
          Knowledge Universe
        </h3>
        <p className="text-white/60 text-xs">
          {pastCurios.length} {pastCurios.length === 1 ? 'discovery' : 'discoveries'}
        </p>
      </div>
    </motion.div>
  );
};

export default KnowledgeGlobe;
