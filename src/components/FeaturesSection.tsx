
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const features = [
  { name: 'Personalized Curiosity Feed', wonderWhiz: true, chatGPT: false, schoolApps: false },
  { name: 'XP Points (Sparks)', wonderWhiz: true, chatGPT: false, schoolApps: false },
  { name: 'Parent Dashboard', wonderWhiz: true, chatGPT: false, schoolApps: true },
  { name: 'Gamified Habits', wonderWhiz: true, chatGPT: false, schoolApps: false },
  { name: 'Rabbit Hole Learning', wonderWhiz: true, chatGPT: false, schoolApps: true },
];

const FeatureCheck = ({ available }: { available: boolean }) => {
  return available ? (
    <div className="flex items-center justify-center bg-wonderwhiz-purple/20 p-2 rounded-full">
      <CheckCircle className="h-6 w-6 text-wonderwhiz-blue" />
    </div>
  ) : (
    <div className="flex items-center justify-center bg-red-500/20 p-2 rounded-full">
      <XCircle className="h-6 w-6 text-red-500" />
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-wonderwhiz-purple opacity-5 blur-3xl"></div>
      <div className="absolute bottom-40 -right-20 w-80 h-80 rounded-full bg-wonderwhiz-pink opacity-5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-lg text-wonderwhiz-blue uppercase tracking-wider mb-3 font-bold inline-block px-4 py-1 rounded-full bg-wonderwhiz-blue/10">WELCOME TO THE CURIOSITY FEED</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            It feels like magic.<br />
            It's just exceptionally thoughtful AI.
          </h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            WonderWhiz speaks your child's language. It adapts to their worldview and interests in real-time.
            It doesn't judge or criticize. It nudges, encourages, surprises, and rewards.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl overflow-hidden border border-wonderwhiz-purple border-opacity-30 shadow-lg shadow-wonderwhiz-purple/20"
        >
          <div className="grid grid-cols-4 text-center py-5 bg-wonderwhiz-dark bg-opacity-50">
            <div className="font-bold text-white text-lg">Feature</div>
            <div className="font-bold text-wonderwhiz-blue text-lg">WonderWhiz</div>
            <div className="font-bold text-red-400 text-lg">ChatGPT</div>
            <div className="font-bold text-green-400 text-lg">School Apps</div>
          </div>
          
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-4 text-center py-5 ${index % 2 === 0 ? 'bg-wonderwhiz-dark bg-opacity-30' : 'bg-wonderwhiz-dark bg-opacity-10'}`}
            >
              <div className="flex items-center px-6 text-white font-medium">{feature.name}</div>
              <div className="flex justify-center">
                {feature.wonderWhiz ? 
                  <div className="flex items-center gap-2 text-wonderwhiz-yellow font-bold px-4 py-1 rounded-full bg-wonderwhiz-purple bg-opacity-20">
                    <span className="text-lg">✓</span> Yes
                  </div> : 
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <span className="text-lg">✕</span> No
                  </div>
                }
              </div>
              <div className="flex justify-center">
                {feature.chatGPT ? 
                  <div className="flex items-center gap-2 text-green-400 font-bold px-4 py-1 rounded-full bg-green-400 bg-opacity-20">
                    <span className="text-lg">✓</span> Yes
                  </div> : 
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <span className="text-lg">✕</span> No
                  </div>
                }
              </div>
              <div className="flex justify-center">
                {feature.schoolApps ? 
                  <div className="flex items-center gap-2 text-green-400 font-bold px-4 py-1 rounded-full bg-green-400 bg-opacity-20">
                    <span className="text-lg">✓</span> Yes
                  </div> : 
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <span className="text-lg">✕</span> No
                  </div>
                }
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
