
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface KidFriendlyErrorStateProps {
  error?: string;
  childAge?: number;
  onRetry?: () => void;
  onGoHome?: () => void;
  type?: 'loading' | 'network' | 'content' | 'general';
}

const KidFriendlyErrorState: React.FC<KidFriendlyErrorStateProps> = ({
  error,
  childAge = 10,
  onRetry,
  onGoHome,
  type = 'general'
}) => {
  const isYoung = childAge <= 8;

  const getErrorContent = () => {
    const mascotFace = isYoung ? "🤖" : "🔧";
    
    switch (type) {
      case 'loading':
        return {
          title: isYoung ? `${mascotFace} Oops! Something got stuck!` : "⏳ Loading Issue",
          message: isYoung 
            ? "Don't worry! Sometimes things take a little longer. Let's try again!" 
            : "Content is taking longer than expected to load. Please try again.",
          suggestions: isYoung 
            ? ["Maybe the internet is being slow?", "Let's give it another try!"] 
            : ["Check your internet connection", "Try refreshing the page"],
          mascotAdvice: isYoung 
            ? "Hi there! I'm Whizzy, your learning helper. Sometimes I need a moment to get things ready for you!" 
            : "Our system is working to get your content ready."
        };
      
      case 'network':
        return {
          title: isYoung ? `${mascotFace} Can't connect right now!` : "🌐 Connection Problem",
          message: isYoung 
            ? "It looks like we can't reach the internet right now. That's okay!" 
            : "We're having trouble connecting to our servers.",
          suggestions: isYoung 
            ? ["Check if your wifi is working", "Ask a grown-up to help", "Try again in a minute"] 
            : ["Check your internet connection", "Try again in a few moments"],
          mascotAdvice: isYoung 
            ? "Don't worry! This happens sometimes. The internet is like a big highway - sometimes there's traffic!" 
            : "Network issues are temporary. Please try again shortly."
        };
      
      case 'content':
        return {
          title: isYoung ? `${mascotFace} Having trouble making your lesson!` : "📚 Content Error",
          message: isYoung 
            ? "I'm having trouble creating your awesome learning content right now!" 
            : "We encountered an issue generating your educational content.",
          suggestions: isYoung 
            ? ["Let's try a different topic!", "Or we can go back and try again"] 
            : ["Try a different topic", "Return to previous section"],
          mascotAdvice: isYoung 
            ? "Sometimes I need to think extra hard about really cool topics! Let's try something else or give me another chance!"
            : "Our content generation system may be experiencing temporary issues."
        };
      
      default:
        return {
          title: isYoung ? `${mascotFace} Whoops! Something unexpected happened!` : "⚠️ Something Went Wrong",
          message: isYoung 
            ? "Don't worry! Even the smartest computers make mistakes sometimes." 
            : "We encountered an unexpected error.",
          suggestions: isYoung 
            ? ["Let's try again!", "Maybe try something different?"] 
            : ["Refresh the page", "Try again"],
          mascotAdvice: isYoung 
            ? "Hi! I'm here to help you learn amazing things. Sometimes I trip over my own code, but I always get back up!"
            : "Our technical team is constantly working to improve your experience."
        };
    }
  };

  const content = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center items-center py-12 px-4"
    >
      <Card className={`
        max-w-lg mx-auto p-8 text-center
        ${isYoung 
          ? 'bg-gradient-to-br from-red-100/20 to-orange-100/20 border-2 border-red-200/30' 
          : 'bg-white/10 border-white/20'
        }
        backdrop-blur-sm rounded-3xl
      `}>
        {/* Mascot Animation */}
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 0.9, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="text-6xl mb-4"
        >
          {isYoung ? "🤖" : "⚠️"}
        </motion.div>

        <h2 className={`
          font-bold text-white mb-4
          ${isYoung ? 'text-2xl' : 'text-xl'}
        `}>
          {content.title}
        </h2>

        <p className={`
          text-white/80 mb-6
          ${isYoung ? 'text-lg' : 'text-base'}
        `}>
          {content.message}
        </p>

        {/* Mascot advice */}
        {isYoung && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/15 rounded-2xl p-4 mb-6 border border-white/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <p className="text-white/90 text-sm leading-relaxed">
                  {content.mascotAdvice}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggestions */}
        <div className="mb-6">
          <h3 className={`
            font-semibold text-white/90 mb-3
            ${isYoung ? 'text-lg' : 'text-base'}
          `}>
            {isYoung ? "Here's what we can try:" : "Suggestions:"}
          </h3>
          <ul className="space-y-2">
            {content.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`
                  text-white/70 flex items-center gap-2
                  ${isYoung ? 'text-base' : 'text-sm'}
                `}
              >
                <span className="text-wonderwhiz-vibrant-yellow">•</span>
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onRetry}
                className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 font-semibold px-6 py-3 rounded-xl"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isYoung ? "Try Again!" : "Retry"}
              </Button>
            </motion.div>
          )}
          
          {onGoHome && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onGoHome}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl"
              >
                <Home className="h-4 w-4 mr-2" />
                {isYoung ? "Go Home" : "Back to Home"}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Technical details for older kids/debugging */}
        {!isYoung && error && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-left"
          >
            <summary className="cursor-pointer text-white/60 text-xs hover:text-white/80">
              Technical Details
            </summary>
            <p className="mt-2 text-white/50 text-xs font-mono bg-black/20 p-2 rounded">
              {error}
            </p>
          </motion.details>
        )}
      </Card>
    </motion.div>
  );
};

export default KidFriendlyErrorState;
