import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Zap, Lightbulb, Book, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ElevatedHeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/profiles');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: Lightbulb,
      label: 'AI-Powered Learning',
      description: 'Adaptive responses for every child'
    },
    {
      icon: Book,
      label: 'Interactive Encyclopedia',
      description: 'Explore endless topics together'
    },
    {
      icon: Target,
      label: 'Personalized Experience',
      description: 'Content that grows with your child'
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-light-purple">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                ['hsl(225 100% 64%)', 'hsl(188 100% 38%)', 'hsl(44 100% 58%)', 'hsl(327 100% 38%)', 'hsl(159 100% 33%)', 'hsl(264 77% 53%)'][i]
              } 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            initial={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
          />
        ))}
      </div>

      {/* Interactive glow effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(225 100% 64% / 0.1), transparent 40%)`
        }}
      />

      <motion.div 
        className="relative z-10 container mx-auto px-6 py-20 min-h-screen flex items-center"
        style={{ y }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-surface-glass backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-wonderwhiz-gold" />
              <span className="text-sm font-medium text-white">Trusted by 10,000+ families</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-6">
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Transform
                <span className="block bg-gradient-to-r from-wonderwhiz-cyan via-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink bg-clip-text text-transparent">
                  Screen Time
                </span>
                into Learning
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                WonderWhiz adapts to your child's curiosity, turning every question into an amazing learning adventure. Safe, smart, and designed for growing minds.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-blue hover:from-wonderwhiz-blue hover:to-wonderwhiz-cyan text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-300 shadow-2xl hover:shadow-wonderwhiz-cyan/25 hover:scale-105"
              >
                Start Free Adventure
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/demo')}
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              className="flex items-center gap-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-wonderwhiz-gold" />
                <span className="text-white/70 text-sm">10,000+ happy families</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                <span className="text-white/70 text-sm">1M+ questions answered</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="bg-surface-glass backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-wonderwhiz-vibrant-yellow to-wonderwhiz-gold rounded-2xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-wonderwhiz-deep-purple" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{feature.label}</h3>
                      <p className="text-white/70 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating achievement badge */}
            <motion.div
              className="absolute -top-4 -right-4 bg-gradient-to-br from-wonderwhiz-gold to-wonderwhiz-vibrant-yellow rounded-2xl p-4 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-wonderwhiz-deep-purple">4.9★</div>
                <div className="text-xs text-wonderwhiz-deep-purple/70">Parent Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-primary/20 to-transparent" />
    </section>
  );
};

export default ElevatedHeroSection;