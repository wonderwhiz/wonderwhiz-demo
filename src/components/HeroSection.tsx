
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import MagicWand from './MagicWand';
import { Sparkles, Star, Lightbulb, BookOpen, Rocket, Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [curioAnimations, setCurioAnimations] = useState({
    nova: false,
    spark: false,
    prism: false
  });
  
  const handleCurioHover = (curio: keyof typeof curioAnimations) => {
    setCurioAnimations(prev => ({ ...prev, [curio]: true }));
    setTimeout(() => {
      setCurioAnimations(prev => ({ ...prev, [curio]: false }));
    }, 700);
  };
  
  const personas = [
    { 
      name: "Nova",
      icon: <Star className="h-6 w-6 text-yellow-300 filter drop-shadow-md" />,
      title: "Nova the Explorer", 
      content: "Did you know penguins can't fly but are amazing swimmers?",
      gradient: "from-purple-500 to-pink-500" 
    },
    { 
      name: "Spark",
      icon: <Lightbulb className="h-6 w-6 text-yellow-300 filter drop-shadow-md" />,
      title: "Spark the Scientist", 
      content: "Let's test your penguin knowledge!",
      gradient: "from-blue-500 to-cyan-400",
      options: ["They live only in Antarctica", "They can be found in both hemispheres"]
    },
    { 
      name: "Prism",
      icon: <BookOpen className="h-6 w-6 text-purple-700 filter drop-shadow-md" />,
      title: "Prism the Artist", 
      content: "Can you draw a penguin? Upload your art!",
      gradient: "from-amber-400 to-yellow-300",
      textColor: "text-gray-800"
    }
  ];
  
  const handleSliderChange = (value: number[]) => {
    setActiveTab(Math.round((value[0] / 100) * (personas.length - 1)));
  };
  
  return (
    <section className="pt-10 pb-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-white group">
            The discovery engine that <span className="text-wonderwhiz-pink relative">
              sparks kids' curiosity
              <span className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-8 w-8 text-wonderwhiz-pink filter drop-shadow-lg" />
              </span>
            </span>—one scroll at a time.
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Turn screen time into growth time. WonderWhiz transforms your child's natural curiosity into daily habits, smart thinking, and joyful learning.
          </p>
          <p className="text-sm md:text-base mb-10 text-gray-300">
            Trusted by 14,000+ parents building smarter habits at home.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start">
            <Link to="/register">
              <Button className="jelly-button w-full sm:w-auto text-lg group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Join the waitlist 
                  <Rocket className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white bg-opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" className="w-full sm:w-auto border-wonderwhiz-blue border-2 text-wonderwhiz-blue bg-opacity-20 hover:bg-opacity-30 text-lg group">
                <span className="group-hover:scale-105 transition-transform inline-block flex items-center gap-2">
                  See the demo
                  <Heart className="h-5 w-5 text-wonderwhiz-pink transition-transform group-hover:scale-125" />
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative mx-auto max-w-[350px]">
            <div className="absolute -top-10 -right-10 animate-float">
              <MagicWand />
            </div>
            
            {/* Phone mockup */}
            <div className="relative bg-black rounded-[40px] p-3 border-[10px] border-gray-800 shadow-2xl transform hover:rotate-1 transition-transform duration-500">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-lg"></div>
              <div className="rounded-[30px] overflow-hidden bg-wonderwhiz-gradient pt-6 pb-10 px-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2">Today's Curios</h3>
                  
                  {/* Slider to navigate between cards */}
                  <div className="px-4 mb-6">
                    <Slider 
                      defaultValue={[0]} 
                      max={100} 
                      step={1}
                      onValueChange={handleSliderChange}
                      className="mt-2"
                    />
                    <div className="flex justify-between mt-1 text-xs text-white/70">
                      {personas.map((persona, idx) => (
                        <span 
                          key={idx} 
                          className={activeTab === idx ? "font-bold text-white" : ""}
                        >
                          {persona.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* App content preview */}
                <div className="space-y-4">
                  {personas.map((persona, idx) => (
                    <div 
                      key={idx}
                      className={`bg-gradient-to-r ${persona.gradient} rounded-2xl p-4 transform transition-all duration-500 cursor-pointer shadow-lg ${
                        activeTab === idx 
                          ? 'scale-100 opacity-100 translate-y-0' 
                          : 'scale-95 opacity-0 translate-y-12 absolute pointer-events-none'
                      } ${curioAnimations[persona.name.toLowerCase() as keyof typeof curioAnimations] ? 'animate-pop' : ''}`}
                      style={{ 
                        position: activeTab === idx ? 'relative' : 'absolute',
                        zIndex: activeTab === idx ? 10 : 0
                      }}
                      onMouseEnter={() => handleCurioHover(persona.name.toLowerCase() as keyof typeof curioAnimations)}
                    >
                      <div className="flex items-start">
                        <div className="rounded-full w-10 h-10 mr-3 bg-white bg-opacity-20 flex items-center justify-center">
                          {persona.icon}
                        </div>
                        <div className={persona.textColor || "text-white"}>
                          <h4 className="font-bold">{persona.title}</h4>
                          <p className="text-sm">{persona.content}</p>
                          
                          {/* Conditional content */}
                          {persona.options && (
                            <div className="mt-2 space-y-2">
                              {persona.options.map((option, i) => (
                                <button 
                                  key={i}
                                  className="bg-white bg-opacity-20 w-full text-left px-3 py-2 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {persona.name === "Prism" && (
                            <div className="mt-2 p-2 bg-white bg-opacity-30 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center hover:bg-opacity-40 transition-colors">
                              <span className="text-xs text-gray-700">Tap to upload your penguin drawing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sparkles */}
            <div className="absolute -top-5 left-0 h-5 w-5 star-sparkle" style={{ animationDelay: "0.2s" }}></div>
            <div className="absolute top-1/4 -right-4 h-4 w-4 star-sparkle" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute bottom-10 -left-6 h-6 w-6 star-sparkle" style={{ animationDelay: "0.8s" }}></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
