
import React, { useEffect, useRef } from 'react';

interface ParticleEffectProps {
  type: 'stars' | 'confetti';
  intensity?: 'low' | 'medium' | 'high';
  triggerAnimation?: boolean;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ 
  type = 'stars', 
  intensity = 'medium',
  triggerAnimation = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<any>>([]);
  
  const particleCount = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 200;
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Initialize particles
    particles.current = [];
    
    if (type === 'stars') {
      // Create star particles
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.2 + 0.1,
          opacity: Math.random() * 0.5 + 0.3,
          color: getStarColor()
        });
      }
      
      // Animation loop for stars
      const animateStars = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.current.forEach((p: any) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
          ctx.fill();
          
          // Move star
          p.y += p.speed;
          
          // Reset star position if it goes off screen
          if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
          }
          
          // Twinkle effect
          p.opacity += Math.random() * 0.01 - 0.005;
          p.opacity = Math.max(0.2, Math.min(0.7, p.opacity));
        });
        
        requestAnimationFrame(animateStars);
      };
      
      animateStars();
    } else if (type === 'confetti' && triggerAnimation) {
      // Create confetti particles
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          size: Math.random() * 8 + 4,
          color: getConfettiColor(),
          speedX: (Math.random() - 0.5) * 15,
          speedY: Math.random() * -15 - 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          gravity: 0.2,
          opacity: 1
        });
      }
      
      // Animation loop for confetti
      const animateConfetti = () => {
        if (particles.current.length === 0) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let stillActive = false;
        
        particles.current.forEach((p: any, index: number) => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
          
          ctx.restore();
          
          // Move confetti
          p.x += p.speedX;
          p.y += p.speedY;
          p.speedY += p.gravity;
          p.rotation += p.rotationSpeed;
          
          // Fade out confetti
          if (p.y > canvas.height * 0.8) {
            p.opacity -= 0.02;
          }
          
          // Remove confetti if it's no longer visible
          if (p.opacity <= 0 || p.y > canvas.height || p.x < -100 || p.x > canvas.width + 100) {
            particles.current.splice(index, 1);
          } else {
            stillActive = true;
          }
        });
        
        if (stillActive) {
          requestAnimationFrame(animateConfetti);
        }
      };
      
      animateConfetti();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [type, particleCount, triggerAnimation]);
  
  const getStarColor = () => {
    const colors = [
      { r: 255, g: 255, b: 255 }, // white
      { r: 173, g: 216, b: 230 }, // light blue
      { r: 255, g: 223, b: 186 }, // light orange
      { r: 200, g: 200, b: 255 }  // light purple
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getConfettiColor = () => {
    const colors = [
      { r: 255, g: 94, b: 186 },  // pink
      { r: 126, g: 48, b: 225 },  // purple
      { r: 255, g: 199, b: 44 },  // gold
      { r: 0, g: 224, b: 255 },   // blue
      { r: 255, g: 232, b: 131 }  // yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${type === 'confetti' ? 'opacity-70' : 'opacity-30'}`}
    />
  );
};

export default ParticleEffect;
