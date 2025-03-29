
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import MagicWand from './MagicWand';

const HeroSection = () => {
  return (
    <section className="pt-10 pb-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-white">
            The discovery engine that <span className="text-wonderwhiz-pink">sparks kids' curiosity</span>—one scroll at a time.
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Turn screen time into growth time. WonderWhiz transforms your child's natural curiosity into daily habits, smart thinking, and joyful learning.
          </p>
          <p className="text-sm md:text-base mb-10 text-gray-300">
            Trusted by 14,000+ parents building smarter habits at home.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start">
            <Link to="/register">
              <Button className="jelly-button w-full sm:w-auto text-lg">
                Join the waitlist
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" className="w-full sm:w-auto border-wonderwhiz-blue border-2 text-wonderwhiz-blue bg-opacity-20 hover:bg-opacity-30 text-lg">
                See the demo
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
            <div className="relative bg-black rounded-[40px] p-3 border-[10px] border-gray-800 shadow-2xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-lg"></div>
              <div className="rounded-[30px] overflow-hidden bg-wonderwhiz-gradient pt-6 pb-10 px-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2">Today's Curios</h3>
                </div>
                
                {/* App content preview */}
                <div className="space-y-4">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-start">
                      <img src="https://via.placeholder.com/40" alt="Nova" className="rounded-full w-10 h-10 mr-3" />
                      <div>
                        <h4 className="font-bold text-white">Nova the Explorer</h4>
                        <p className="text-sm text-white">Did you know penguins can't fly but are amazing swimmers?</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-4 transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-start">
                      <img src="https://via.placeholder.com/40" alt="Spark" className="rounded-full w-10 h-10 mr-3" />
                      <div>
                        <h4 className="font-bold text-white">Spark the Scientist</h4>
                        <p className="text-sm text-white">Let's test your penguin knowledge!</p>
                        <div className="mt-2 space-y-2">
                          <button className="bg-white bg-opacity-20 w-full text-left px-3 py-2 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors">
                            They live only in Antarctica
                          </button>
                          <button className="bg-white bg-opacity-20 w-full text-left px-3 py-2 rounded-lg text-white text-sm hover:bg-opacity-30 transition-colors">
                            They can be found in both hemispheres
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card 3 */}
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl p-4 transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-start">
                      <img src="https://via.placeholder.com/40" alt="Prism" className="rounded-full w-10 h-10 mr-3" />
                      <div>
                        <h4 className="font-bold text-gray-800">Prism the Artist</h4>
                        <p className="text-sm text-gray-800">Can you draw a penguin? Upload your art!</p>
                        <div className="mt-2 p-2 bg-white bg-opacity-30 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center">
                          <span className="text-xs text-gray-700">Tap to upload your penguin drawing</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
