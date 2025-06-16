
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface KidFriendlyLoadingStateProps {
  message?: string;
  childAge?: number;
  type?: 'content' | 'section' | 'quiz' | 'general';
}

const KidFriendlyLoadingState: React.FC<KidFriendlyLoadingStateProps> = ({
  message,
  childAge = 10,
  type = 'general'
}) => {
  const getLoadingMessages = () => {
    if (childAge <= 8) {
      return {
        content: [
          "🎨 Getting your story ready...",
          "✨ Making something amazing just for you!",
          "🌟 Our learning friends are preparing your adventure!",
          "🎯 Almost ready to explore!"
        ],
        section: [
          "📚 Opening your next chapter...",
          "🔍 Finding cool facts for you!",
          "🎪 Setting up your learning playground!",
          "🌈 Making everything colorful and fun!"
        ],
        quiz: [
          "🎮 Preparing your brain games...",
          "🧩 Getting puzzles ready!",
          "🎯 Setting up fun challenges!",
          "⭐ Making quiz time awesome!"
        ],
        general: [
          "🚀 Getting things ready...",
          "✨ Working some magic!",
          "🎈 Almost there!",
          "🌟 Just a moment more!"
        ]
      };
    } else {
      return {
        content: [
          "🔬 Preparing your learning content...",
          "📖 Organizing educational materials...",
          "🧠 Setting up your knowledge journey!",
          "⚡ Almost ready to learn!"
        ],
        section: [
          "📚 Loading section content...",
          "🔍 Gathering information...",
          "🎯 Preparing your next topic!",
          "🌟 Getting everything organized!"
        ],
        quiz: [
          "🧩 Creating your quiz...",
          "💡 Preparing brain teasers!",
          "🎯 Setting up challenges!",
          "⭐ Quiz time coming up!"
        ],
        general: [
          "⚡ Loading...",
          "🔄 Processing...",
          "🎯 Almost ready!",
          "✨ Just a moment!"
        ]
      };
    }
  };

  const messages = getLoadingMessages()[type];
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMessage = message || messages[currentMessageIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center items-center py-20"
    >
      <Card className="bg-white/15 backdrop-blur-sm border-white/30 p-8 max-w-sm mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Animated loading icon */}
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full flex items-center justify-center"
            >
              <BookOpen className="h-8 w-8 text-white" />
            </motion.div>
            
            {/* Floating sparkles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-wonderwhiz-vibrant-yellow rounded-full"
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-4px',
                  marginTop: '-4px'
                }}
              />
            ))}
          </div>

          {/* Loading message */}
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <h3 className={`font-bold text-white ${childAge <= 8 ? 'text-xl' : 'text-lg'}`}>
              {currentMessage}
            </h3>
            <p className={`text-white/80 ${childAge <= 8 ? 'text-base' : 'text-sm'}`}>
              {childAge <= 8 
                ? "This is going to be so much fun!" 
                : "Your educational content is being prepared..."
              }
            </p>
          </motion.div>

          {/* Progress dots */}
          <div className="flex space-x-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/40 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  backgroundColor: ['rgba(255,255,255,0.4)', 'rgba(255,213,79,0.8)', 'rgba(255,255,255,0.4)']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default KidFriendlyLoadingState;
