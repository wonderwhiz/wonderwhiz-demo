
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Brain, BadgeInfo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [activeNode, setActiveNode] = useState<{id: string, title: string} | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  // Extract common topics from curio history
  const getTopicsFromCurios = () => {
    const topics = new Map();
    
    pastCurios.forEach(curio => {
      const title = curio.title || curio.query || '';
      const words = title.toLowerCase().split(' ');
      
      // Track commonly occurring meaningful words
      words.forEach(word => {
        if (word.length > 3 && !['what', 'when', 'where', 'why', 'how', 'does', 'about', 'that', 'with', 'this'].includes(word)) {
          if (topics.has(word)) {
            topics.set(word, topics.get(word) + 1);
          } else {
            topics.set(word, 1);
          }
        }
      });
    });
    
    // Convert to array and sort by frequency
    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  };
  
  const handleNodeClick = (nodeId: string, nodeTitle: string) => {
    setActiveNode({ id: nodeId, title: nodeTitle });
    toast.info("Knowledge connection found!", {
      description: `This connects to your curiosity about "${nodeTitle}"`,
    });
  };
  
  const handleInsightsToggle = () => {
    setShowInsights(prev => !prev);
  };
  
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
      const nodeSize = 5 + Math.min(15, (curio.title?.length || 0) / 3);
      return {
        id: curio.id || `node-${index}`,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: nodeSize,
        color: getNodeColor(curio),
        speed: 0.1 + Math.random() * 0.2,
        angle: Math.random() * Math.PI * 2,
        title: curio.title || 'Untitled',
        connections: []
      };
    });
    
    // Create intelligent connections between related nodes
    if (nodes.length > 1) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const sourceTitle = node.title.toLowerCase();
        
        // Connect nodes with related content
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const targetTitle = nodes[j].title.toLowerCase();
            
            // Check for keyword overlap or topic relation
            const words1 = sourceTitle.split(' ');
            const words2 = targetTitle.split(' ');
            
            const commonWords = words1.filter(word => 
              word.length > 3 && 
              words2.includes(word) && 
              !['what', 'when', 'where', 'why', 'how', 'about'].includes(word)
            );
            
            if (commonWords.length > 0 && !node.connections.includes(j)) {
              node.connections.push(j);
            }
          }
        }
        
        // Ensure each node has at least one connection for visual appeal
        if (node.connections.length === 0 && nodes.length > 1) {
          const randomNodeIndex = Math.floor(Math.random() * nodes.length);
          if (randomNodeIndex !== i) {
            node.connections.push(randomNodeIndex);
          }
        }
      }
    }
    
    // Track mouse position for interactivity
    let mouseX = 0;
    let mouseY = 0;
    let hoveredNode: any = null;
    
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Check if hovering over a node
      hoveredNode = nodes.find(node => {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        return Math.sqrt(dx * dx + dy * dy) <= node.radius;
      });
      
      if (hoveredNode) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    });
    
    canvas.addEventListener('click', () => {
      if (hoveredNode) {
        handleNodeClick(hoveredNode.id, hoveredNode.title);
      }
    });
    
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
          ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
          ctx.stroke();
        });
      });
      
      // Update and draw nodes
      nodes.forEach(node => {
        // Update position with gentle movement
        node.x += Math.cos(node.angle) * node.speed;
        node.y += Math.sin(node.angle) * node.speed;
        
        // Slight angle variation for natural movement
        node.angle += Math.random() * 0.02 - 0.01;
        
        // Bounce off edges
        if (node.x <= node.radius || node.x >= canvas.width - node.radius) {
          node.angle = Math.PI - node.angle;
        }
        if (node.y <= node.radius || node.y >= canvas.height - node.radius) {
          node.angle = -node.angle;
        }
        
        // Check if this is the hovered node
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const isActive = activeNode && activeNode.id === node.id;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isHovered || isActive ? 2 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isHovered || isActive ? lightenColor(node.color) : node.color;
        ctx.fill();
        
        // Draw subtle glow for hovered/active nodes
        if (isHovered || isActive) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = node.color.replace(')', ', 0.1)');
          ctx.fill();
          
          // Show title on hover
          ctx.font = '12px Arial';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.fillText(node.title, node.x, node.y - node.radius - 8, 150);
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pastCurios, activeNode]);
  
  // Function to determine node color based on curio content
  function getNodeColor(curio: any) {
    const title = (curio.title || curio.query || '').toLowerCase();
    
    if (title.includes('space') || title.includes('planet') || title.includes('star')) {
      return 'rgba(59, 130, 246, 0.8)'; // blue
    }
    if (title.includes('animal') || title.includes('dinosaur')) {
      return 'rgba(16, 185, 129, 0.8)';  // green
    }
    if (title.includes('history') || title.includes('ancient')) {
      return 'rgba(245, 158, 11, 0.8)';  // amber
    }
    if (title.includes('science') || title.includes('experiment')) {
      return 'rgba(139, 92, 246, 0.8)';  // purple
    }
    
    // Default to a range of colors for variety
    const colors = [
      'rgba(59, 130, 246, 0.8)', // blue
      'rgba(236, 72, 153, 0.8)',  // pink
      'rgba(139, 92, 246, 0.8)',  // purple
      'rgba(245, 158, 11, 0.8)',  // amber
      'rgba(16, 185, 129, 0.8)'   // emerald
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Function to lighten a color for hover effects
  function lightenColor(color: string) {
    return color.replace('0.8', '1');
  }
  
  // Get top topics for insights
  const topTopics = getTopicsFromCurios();

  return (
    <motion.div 
      className="relative h-72 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-md border border-white/10"
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
      
      {/* Floating info panel */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <h3 className="text-white text-sm font-medium flex items-center">
          <Brain className="h-3.5 w-3.5 mr-1.5 text-indigo-300" />
          <span>Knowledge Universe</span>
          <span className="ml-2 bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
            {pastCurios.length} {pastCurios.length === 1 ? 'discovery' : 'discoveries'}
          </span>
        </h3>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs bg-white/5 hover:bg-white/10 text-white/80"
          onClick={handleInsightsToggle}
        >
          <BadgeInfo className="h-3 w-3 mr-1.5" />
          {showInsights ? 'Hide' : 'Show'} Insights
        </Button>
      </div>
      
      {/* Brain insights panel */}
      <AnimatedPanel show={showInsights}>
        <div className="absolute bottom-4 right-4 w-64 bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-3">
          <h4 className="text-white text-xs font-medium mb-2 flex items-center">
            <Zap className="h-3 w-3 mr-1.5 text-amber-300" />
            Brain Insights
          </h4>
          
          {topTopics.length > 0 ? (
            <div className="space-y-2">
              <p className="text-white/70 text-xs">You're most curious about:</p>
              <div className="flex flex-wrap gap-1">
                {topTopics.map((topic, i) => (
                  <span 
                    key={i} 
                    className="text-xs bg-white/10 hover:bg-white/20 text-white/90 px-2 py-0.5 rounded-full cursor-pointer"
                    onClick={() => toast.info(`Explore more about "${topic}"`, {
                      description: "Click on related nodes to learn more.",
                      action: {
                        label: "Explore",
                        onClick: () => console.log(`User wants to explore ${topic}`)
                      }
                    })}
                  >
                    {topic}
                  </span>
                ))}
              </div>
              
              <p className="text-white/70 text-xs pt-1">Pro tip:</p>
              <p className="text-white/60 text-xs">Click on any glowing dot to see how your knowledge connects!</p>
            </div>
          ) : (
            <p className="text-white/60 text-xs">
              Keep exploring to build your knowledge patterns!
            </p>
          )}
        </div>
      </AnimatedPanel>
      
      {/* Search help */}
      <div className="absolute bottom-4 left-4 flex items-center">
        <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
          <Search className="h-3 w-3 text-white/60 mr-1" />
          <span className="text-white/60 text-xs">Tap nodes to explore connections</span>
        </div>
      </div>
    </motion.div>
  );
};

// Helper component for animated panels
const AnimatedPanel: React.FC<{show: boolean, children: React.ReactNode}> = ({ show, children }) => (
  <motion.div
    initial={false}
    animate={{ 
      opacity: show ? 1 : 0,
      scale: show ? 1 : 0.9,
      y: show ? 0 : 10
    }}
    transition={{ duration: 0.2 }}
    style={{ display: show ? 'block' : 'none' }}
  >
    {children}
  </motion.div>
);

export default KnowledgeGlobe;
