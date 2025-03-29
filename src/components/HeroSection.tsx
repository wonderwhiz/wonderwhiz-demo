import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import MagicWand from './MagicWand';
import { Sparkles, Star, Lightbulb, BookOpen, Rocket, Heart, Brain, Globe } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [curioAnimations, setCurioAnimations] = useState({
    nova: false,
    spark: false,
    prism: false
  });
  const handleCurioHover = (curio: keyof typeof curioAnimations) => {
    setCurioAnimations(prev => ({
      ...prev,
      [curio]: true
    }));
    setTimeout(() => {
      setCurioAnimations(prev => ({
        ...prev,
        [curio]: false
      }));
    }, 700);
  };
  const personas = [{
    name: "Nova",
    icon: <Star className="h-6 w-6 text-yellow-300 filter drop-shadow-md" />,
    title: "Nova the Explorer",
    content: "Did you know penguins can't fly but are amazing swimmers?",
    gradient: "from-purple-500 to-pink-500",
    type: "fact"
  }, {
    name: "Spark",
    icon: <Lightbulb className="h-6 w-6 text-yellow-300 filter drop-shadow-md" />,
    title: "Spark the Scientist",
    content: "Let's test your penguin knowledge!",
    gradient: "from-blue-500 to-cyan-400",
    options: ["They live only in Antarctica", "They can be found in both hemispheres"],
    type: "quiz"
  }, {
    name: "Prism",
    icon: <BookOpen className="h-6 w-6 text-purple-700 filter drop-shadow-md" />,
    title: "Prism the Artist",
    content: "Can you draw a penguin? Upload your art!",
    gradient: "from-amber-400 to-yellow-300",
    textColor: "text-gray-800",
    type: "creative"
  }];
  const handleSliderChange = (value: number[]) => {
    setActiveTab(Math.round(value[0] / 100 * (personas.length - 1)));
  };
  return <section className="pt-10 pb-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-white group">
            The discovery engine that <span className="text-wonderwhiz-pink relative">
              feeds kids' curiosity
              <span className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-8 w-8 text-wonderwhiz-pink filter drop-shadow-lg" />
              </span>
            </span>—one scroll at a time.
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Turn screen time into growth time. WonderWhiz transforms your child's natural curiosity into daily habits, smart thinking, and joyful learning.
          </p>
          <p className="text-sm md:text-base mb-10 text-gray-300">Trusted by parents building smarter habits at home.</p>
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
              <Button variant="outline" className="w-full sm:w-auto border-wonderwhiz-blue border-2 bg-opacity-20 hover:bg-opacity-30 text-lg group text-wonderwhiz-purple">
                <span className="group-hover:scale-105 transition-transform inline-block flex items-center gap-2 text-wonderwhiz-purple">
                  See the demo
                  <Heart className="h-5 w-5 text-wonderwhiz-pink transition-transform group-hover:scale-125" />
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="relative">
          <div className="relative mx-auto max-w-[350px]">
            <div className="absolute -top-10 -right-10 animate-float">
              <MagicWand />
            </div>
            
            {/* Phone mockup */}
            <div className="relative bg-black rounded-[40px] p-3 border-[10px] border-gray-800 shadow-2xl transform hover:rotate-1 transition-transform duration-500">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-lg"></div>
              <div className="rounded-[30px] overflow-hidden bg-wonderwhiz-gradient pt-6 pb-10 px-4">
                {/* Header with profile and sparks */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-wonderwhiz-blue/20 flex items-center justify-center">
                      <Star className="h-4 w-4 text-wonderwhiz-gold" />
                    </div>
                    <span className="ml-2 font-medium text-white text-sm">Alex's Feed</span>
                  </div>
                  <div className="flex items-center bg-wonderwhiz-gold/20 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 text-wonderwhiz-gold mr-1" />
                    <span className="text-xs font-medium text-wonderwhiz-gold">137 sparks</span>
                  </div>
                </div>
                
                {/* Curios Feed Title */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2">Today's Curios</h3>
                  
                  {/* Categories Filter */}
                  <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                    <div className="bg-wonderwhiz-blue/30 text-white text-xs px-3 py-1 rounded-full flex-shrink-0">
                      All
                    </div>
                    <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
                      Science
                    </div>
                    <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
                      Art
                    </div>
                    <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
                      History
                    </div>
                    <div className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full flex-shrink-0">
                      Space
                    </div>
                  </div>
                  
                  {/* Specialists Strip */}
                  <div className="flex space-x-3 mb-4 justify-center">
                    {[{
                    emoji: "🔭",
                    color: "bg-gradient-to-r from-blue-500 to-purple-500"
                  }, {
                    emoji: "🎨",
                    color: "bg-gradient-to-r from-pink-500 to-orange-400"
                  }, {
                    emoji: "🌿",
                    color: "bg-gradient-to-r from-green-500 to-teal-400"
                  }, {
                    emoji: "🧠",
                    color: "bg-gradient-to-r from-purple-500 to-indigo-500"
                  }].map((specialist, idx) => <div key={idx} className={`w-8 h-8 rounded-full ${specialist.color} flex items-center justify-center text-sm shadow-lg ${idx === 0 ? 'ring-2 ring-white' : ''}`}>
                        {specialist.emoji}
                      </div>)}
                  </div>
                </div>
                
                {/* Curio Cards */}
                <div className="space-y-3">
                  {/* First Curio - Fact */}
                  <div className="bg-gradient-to-r from-wonderwhiz-purple/70 to-wonderwhiz-blue/70 rounded-xl p-3 shadow-lg">
                    <div className="flex items-start">
                      <div className="rounded-full w-8 h-8 mr-2 bg-white/20 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-white">
                        <h4 className="text-sm font-bold">Fun Space Fact</h4>
                        <p className="text-xs">A year on Venus is shorter than a day on Venus! Venus rotates so slowly that it takes 243 Earth days to spin once.</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-[10px] text-white/60">Astronomy</div>
                          <div className="flex space-x-2">
                            <button className="p-1 rounded-full hover:bg-white/10 text-white/70">
                              <Star className="h-3 w-3" />
                            </button>
                            <button className="p-1 rounded-full hover:bg-white/10 text-white/70">
                              <Globe className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Second Curio - Quiz */}
                  <div className="bg-gradient-to-r from-green-500/70 to-teal-500/70 rounded-xl p-3 shadow-lg">
                    <div className="flex items-start">
                      <div className="rounded-full w-8 h-8 mr-2 bg-white/20 flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-yellow-200" />
                      </div>
                      <div className="text-white flex-1">
                        <h4 className="text-sm font-bold">Pop Quiz!</h4>
                        <p className="text-xs mb-2">What's the largest ocean on Earth?</p>
                        <div className="space-y-1">
                          <button className="bg-white/20 w-full text-left px-2 py-1 rounded text-xs hover:bg-white/30">
                            Atlantic Ocean
                          </button>
                          <button className="bg-white/20 w-full text-left px-2 py-1 rounded text-xs hover:bg-white/30">
                            Pacific Ocean
                          </button>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <div className="text-[10px] text-white/60">+5 sparks for correct answer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Third Curio - Creative */}
                  <div className="bg-gradient-to-r from-amber-400/80 to-yellow-300/80 rounded-xl p-3 shadow-lg">
                    <div className="flex items-start">
                      <div className="rounded-full w-8 h-8 mr-2 bg-white/20 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-purple-700" />
                      </div>
                      <div className="text-gray-800 flex-1">
                        <h4 className="text-sm font-bold">Draw Challenge</h4>
                        <p className="text-xs mb-2">Can you draw your favorite animal? Upload your creation!</p>
                        <div className="p-1.5 bg-white/30 rounded border border-dashed border-gray-500 flex items-center justify-center">
                          <span className="text-[10px]">Tap to upload your drawing</span>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <div className="text-[10px] text-gray-700">+10 sparks for uploading</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sparkles */}
            <div className="absolute -top-5 left-0 h-5 w-5 star-sparkle" style={{
            animationDelay: "0.2s"
          }}></div>
            <div className="absolute top-1/4 -right-4 h-4 w-4 star-sparkle" style={{
            animationDelay: "0.5s"
          }}></div>
            <div className="absolute bottom-10 -left-6 h-6 w-6 star-sparkle" style={{
            animationDelay: "0.8s"
          }}></div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;