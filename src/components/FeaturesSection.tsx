
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const features = [
  { name: 'Personalized Curiosity Feed', wonderWhiz: true, chatGPT: false, schoolApps: false },
  { name: 'XP Points (Sparks)', wonderWhiz: true, chatGPT: false, schoolApps: false },
  { name: 'Parent Dashboard', wonderWhiz: true, chatGPT: false, schoolApps: true },
  { name: 'Gamified Habits', wonderWhiz: true, chatGPT: false, schoolApps: false },
  { name: 'Rabbit Hole Learning', wonderWhiz: true, chatGPT: false, schoolApps: true },
];

const FeatureCheck = ({ available }: { available: boolean }) => {
  return available ? (
    <div className="flex items-center justify-center bg-wonderwhiz-purple bg-opacity-20 p-2 rounded-full">
      <Check className="h-5 w-5 text-wonderwhiz-blue" />
    </div>
  ) : (
    <div className="flex items-center justify-center bg-red-500 bg-opacity-20 p-2 rounded-full">
      <X className="h-5 w-5 text-red-500" />
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-lg text-wonderwhiz-blue uppercase tracking-wider mb-3">WELCOME TO THE CURIOSITY FEED</h2>
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
          className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl overflow-hidden border border-wonderwhiz-purple border-opacity-30"
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
              <div className="flex items-center px-4 text-white">{feature.name}</div>
              <div className="flex justify-center">
                {feature.wonderWhiz ? <div className="text-green-400 font-bold">✓ Yes</div> : <div className="text-red-400 font-bold">✕ No</div>}
              </div>
              <div className="flex justify-center">
                {feature.chatGPT ? <div className="text-green-400 font-bold">✓ Yes</div> : <div className="text-red-400 font-bold">✕ No</div>}
              </div>
              <div className="flex justify-center">
                {feature.schoolApps ? <div className="text-green-400 font-bold">✓ Yes</div> : <div className="text-red-400 font-bold">✕ No</div>}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
