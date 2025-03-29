
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import ParticleEffect from '@/components/ParticleEffect';
import ConfettiTrigger from '@/components/ConfettiTrigger';
import AnimatedTooltip from '@/components/AnimatedTooltip';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Only enable custom cursor on non-mobile devices
    if (!isMobile) {
      // Initialize custom cursor
      document.documentElement.classList.add('magic-cursor-active');
      
      // Create cursor elements
      const cursorDot = document.createElement('div');
      cursorDot.classList.add('magic-cursor-dot');
      document.body.appendChild(cursorDot);
      
      const cursorOutline = document.createElement('div');
      cursorOutline.classList.add('magic-cursor-outline');
      document.body.appendChild(cursorOutline);
      
      // Track cursor position
      const updateCursorPosition = (e: MouseEvent) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        // Update CSS variables for spotlight effect
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
        
        // Update cursor elements
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        
        // Add slight delay for outline for smooth effect
        setTimeout(() => {
          cursorOutline.style.left = `${e.clientX}px`;
          cursorOutline.style.top = `${e.clientY}px`;
        }, 50);
      };
      
      // Handle hover state for interactive elements
      const handleMouseEnter = () => {
        setCursorHover(true);
        cursorOutline.classList.add('hover');
      };
      
      const handleMouseLeave = () => {
        setCursorHover(false);
        cursorOutline.classList.remove('hover');
      };
      
      // Add event listeners
      document.addEventListener('mousemove', updateCursorPosition);
      
      // Add hover effect for all interactive elements
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, .interactive-card');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
      
      // Create floating particles
      setTimeout(() => {
        setShowParticles(true);
        createFloatingParticles();
      }, 1000);
      
      // Cleanup
      return () => {
        document.removeEventListener('mousemove', updateCursorPosition);
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
        document.documentElement.classList.remove('magic-cursor-active');
        
        if (cursorDot.parentNode) document.body.removeChild(cursorDot);
        if (cursorOutline.parentNode) document.body.removeChild(cursorOutline);
        
        // Remove particles
        const particles = document.querySelectorAll('.floating-particle');
        particles.forEach(particle => {
          if (particle.parentNode) document.body.removeChild(particle);
        });
      };
    }
  }, [isMobile]);
  
  const createFloatingParticles = () => {
    // Create fewer particles on mobile
    const particleCount = isMobile ? 8 : 15;
    
    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');
        
        // Randomize particle properties
        const size = Math.random() * (isMobile ? 6 : 8) + (isMobile ? 3 : 4);
        const randomX = Math.random() * window.innerWidth;
        const randomColor = getRandomColor();
        const randomDelay = Math.random() * 10;
        const randomDuration = Math.random() * 15 + 10;
        const randomXMove = (Math.random() - 0.5) * 200;
        
        // Set particle styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${randomX}px`;
        particle.style.bottom = '0';
        particle.style.background = randomColor;
        particle.style.boxShadow = `0 0 ${size}px ${randomColor}`;
        particle.style.animationDelay = `${randomDelay}s`;
        particle.style.animationDuration = `${randomDuration}s`;
        particle.style.setProperty('--rand-x', `${randomXMove}px`);
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          if (particle.parentNode) document.body.removeChild(particle);
        }, randomDuration * 1000 + randomDelay * 1000);
      }, i * 1000);
    }
  };
  
  const getRandomColor = () => {
    const colors = [
      '#FF5EBA', // pink
      '#7E30E1', // purple
      '#FFC72C', // gold
      '#00E0FF', // blue
      '#FFE883', // yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient spotlight-hover relative overflow-x-hidden">
      <Helmet>
        <title>WonderWhiz - Feed Your Child's Curiosity</title>
        <meta name="description" content="WonderWhiz is an AI-powered learning platform that transforms screen time into growth time for kids. Turn curiosity into daily habits, smart thinking, and joyful learning." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      {/* Background particles */}
      <ParticleEffect type="stars" intensity={isMobile ? "low" : "medium"} />
      
      {/* Award-winning site badge - hide on small mobile */}
      {!isMobile && (
        <AnimatedTooltip 
          content={
            <div className="text-center">
              <p className="font-bold">Webby Award Nominee 2023</p>
              <p className="text-xs mt-1">For Excellence in Innovation</p>
            </div>
          }
        >
          <ConfettiTrigger>
            <div className="award-badge cursor-pointer hidden sm:flex">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-wonderwhiz-dark" />
                <span className="text-xs font-bold text-wonderwhiz-dark">Award Winner</span>
              </div>
            </div>
          </ConfettiTrigger>
        </AnimatedTooltip>
      )}
      
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      
      {/* Interactive sparkle that follows cursor with delay - only on non-mobile */}
      {!isMobile && (
        <div 
          className="fixed pointer-events-none z-50 transition-all duration-300 opacity-70"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Sparkles 
            className="h-6 w-6 text-wonderwhiz-gold animate-pulse" 
            style={{ filter: 'drop-shadow(0 0 5px rgba(255, 199, 44, 0.7))' }}
          />
        </div>
      )}
      
      {/* Add CSS Variables for cursor-following spotlight effect */}
      <style>
        {`
        .spotlight-hover::before {
          --x: ${cursorPosition.x}px;
          --y: ${cursorPosition.y}px;
        }
        `}
      </style>
    </div>
  );
};

export default Index;
