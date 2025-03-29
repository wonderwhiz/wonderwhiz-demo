
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Sparkles, Star, Rocket, Brain, Award, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const features = [
  { 
    name: 'Personalized Curiosity Feed', 
    wonderWhiz: true, 
    chatGPT: false, 
    schoolApps: false,
    icon: <Sparkles className="h-6 w-6 text-wonderwhiz-blue" />,
    description: "Content tailored to your child's unique interests and learning style, evolving as they grow."
  },
  { 
    name: 'XP Points (Sparks)', 
    wonderWhiz: true, 
    chatGPT: false, 
    schoolApps: false,
    icon: <Star className="h-6 w-6 text-wonderwhiz-gold" />,
    description: "Earn points for every discovery, question asked, and challenge completed."
  },
  { 
    name: 'Parent Dashboard', 
    wonderWhiz: true, 
    chatGPT: false, 
    schoolApps: true,
    icon: <Rocket className="h-6 w-6 text-wonderwhiz-pink" />,
    description: "Track progress, insights into interests, and recommendations for family activities."
  },
  { 
    name: 'Gamified Habits', 
    wonderWhiz: true, 
    chatGPT: false, 
    schoolApps: false,
    icon: <Brain className="h-6 w-6 text-green-400" />,
    description: "Turn learning into a fun game with daily streaks, challenges, and rewards."
  },
  { 
    name: 'Rabbit Hole Learning', 
    wonderWhiz: true, 
    chatGPT: false, 
    schoolApps: true,
    icon: <Zap className="h-6 w-6 text-purple-400" />,
    description: "Follow your curiosity down exciting paths of discovery with related content."
  },
];

const FeatureCheck = ({ available, variant = "default" }: { available: boolean, variant?: "default" | "highlighted" }) => {
  return available ? (
    <div className={`flex items-center justify-center p-2 rounded-full ${
      variant === "highlighted" 
        ? "bg-wonderwhiz-purple/30 ring-2 ring-wonderwhiz-blue animate-pulse" 
        : "bg-wonderwhiz-purple/20"
    }`}>
      <CheckCircle className="h-6 w-6 text-wonderwhiz-blue" />
    </div>
  ) : (
    <div className="flex items-center justify-center bg-red-500/20 p-2 rounded-full">
      <XCircle className="h-6 w-6 text-red-500" />
    </div>
  );
};

const FeatureCard = ({ feature, isActive }: { feature: typeof features[0], isActive: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 border ${
        isActive 
          ? "border-wonderwhiz-blue/70 shadow-lg shadow-wonderwhiz-blue/20 scale-105" 
          : "border-wonderwhiz-purple/30 hover:border-wonderwhiz-blue/50"
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-wonderwhiz-purple/20 rounded-lg">
          {feature.icon}
        </div>
        <h3 className="text-xl font-bold">{feature.name}</h3>
      </div>
      <p className="text-gray-300 mb-4">{feature.description}</p>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="flex flex-col items-center">
          <FeatureCheck available={feature.wonderWhiz} variant="highlighted" />
          <span className="text-xs mt-1 text-wonderwhiz-blue font-medium">WonderWhiz</span>
        </div>
        <div className="flex flex-col items-center">
          <FeatureCheck available={feature.chatGPT} />
          <span className="text-xs mt-1 text-gray-400">ChatGPT</span>
        </div>
        <div className="flex flex-col items-center">
          <FeatureCheck available={feature.schoolApps} />
          <span className="text-xs mt-1 text-gray-400">School Apps</span>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [sliderValue, setSliderValue] = useState([0]);
  
  const handleSliderChange = (value: number[]) => {
    const featureIndex = Math.min(Math.floor((value[0] / 100) * features.length), features.length - 1);
    setActiveFeature(featureIndex);
    setSliderValue(value);
  };
  
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

        {/* Interactive feature slider */}
        <div className="max-w-2xl mx-auto mb-12">
          <Slider 
            value={sliderValue}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-gray-400">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`cursor-pointer ${idx === activeFeature ? 'text-wonderwhiz-blue font-bold' : ''}`}
                onClick={() => {
                  setActiveFeature(idx);
                  setSliderValue([idx * (100 / (features.length - 1))]);
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, idx) => (
            <FeatureCard 
              key={idx} 
              feature={feature} 
              isActive={idx === activeFeature}
            />
          ))}
        </div>

        {/* Comparison table (visual upgrade from previous version) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl overflow-hidden border border-wonderwhiz-purple border-opacity-30 shadow-lg shadow-wonderwhiz-purple/20 mt-20"
        >
          <div className="grid grid-cols-4 text-center py-5 bg-wonderwhiz-dark bg-opacity-50">
            <div className="font-bold text-white text-lg flex items-center justify-center"><Award className="mr-2 h-5 w-5 text-wonderwhiz-gold" /> Features</div>
            <div className="font-bold text-wonderwhiz-blue text-lg">WonderWhiz</div>
            <div className="font-bold text-red-400 text-lg">ChatGPT</div>
            <div className="font-bold text-green-400 text-lg">School Apps</div>
          </div>
          
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-4 text-center py-5 ${index % 2 === 0 ? 'bg-wonderwhiz-dark bg-opacity-30' : 'bg-wonderwhiz-dark bg-opacity-10'} transition-colors duration-300 hover:bg-wonderwhiz-purple/10`}
            >
              <div className="flex items-center px-6 text-white font-medium">
                {feature.icon}
                <span className="ml-2">{feature.name}</span>
              </div>
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
