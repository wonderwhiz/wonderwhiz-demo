
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, LucideIcon } from 'lucide-react';
import { shouldShowPlotTwist } from './utils/narrativeUtils';

interface FactBlockProps {
  content: {
    fact: string;
    extended_content?: string;
    image_prompt?: string;
    surprise_element?: string;
  };
  onRabbitHoleClick: (question: string) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  textSize: string;
  narrativePosition?: 'beginning' | 'middle' | 'end';
}

const FactBlock: React.FC<FactBlockProps> = ({ 
  content, 
  onRabbitHoleClick, 
  expanded, 
  setExpanded,
  textSize,
  narrativePosition = 'middle'
}) => {
  const [showWonderTrigger, setShowWonderTrigger] = useState(false);
  const [revealedSurprise, setRevealedSurprise] = useState(false);
  
  // Generate suggested rabbit hole questions based on the fact
  const generateRabbitHoleQuestions = (): string[] => {
    if (!content.fact) return [];
    
    // Extract key terms
    const words = content.fact.split(' ');
    const keyTerms = words.filter(word => 
      word.length > 4 && !['about', 'that', 'there', 'these', 'those', 'would', 'could', 'should'].includes(word.toLowerCase())
    ).slice(0, 3);
    
    if (keyTerms.length === 0) return [];
    
    // Generate questions based on key terms
    return [
      `What makes ${keyTerms[0]} so fascinating?`,
      keyTerms.length > 1 ? `How does ${keyTerms[0]} affect ${keyTerms[1]}?` : `How does ${keyTerms[0]} change our world?`,
      keyTerms.length > 2 ? `Why is ${keyTerms[2]} important to understand?` : `What more can we learn about ${keyTerms[0]}?`
    ];
  };
  
  const rabbitHoleQuestions = generateRabbitHoleQuestions();
  
  // Check if we should show a plot twist
  const hasSurpriseElement = content.surprise_element && !revealedSurprise;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Render highlighted terms in fact text
  const renderHighlightedFact = (text: string) => {
    if (!text) return "";
    
    // Find key terms to highlight - simplified approach
    const words = text.split(' ');
    const keyWords = words.filter(word => 
      word.length > 5 && 
      !['about', 'there', 'these', 'those', 'would', 'could', 'should'].includes(word.toLowerCase())
    ).slice(0, 3);
    
    if (keyWords.length === 0) return text;
    
    // Replace key words with highlighted versions
    let highlightedText = text;
    keyWords.forEach(word => {
      // Only highlight whole words and preserve punctuation
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, match => 
        `<span class="text-wonderwhiz-vibrant-yellow font-medium">${match}</span>`
      );
    });
    
    return highlightedText;
  };
  
  // Get size class based on narrative position
  const getTextSizeClass = () => {
    if (narrativePosition === 'beginning') {
      return 'text-base sm:text-lg';
    }
    return textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <motion.div 
        variants={textVariants}
        className={`${getTextSizeClass()} ${narrativePosition === 'beginning' ? 'font-medium' : ''}`}
      >
        <p 
          className="text-white"
          dangerouslySetInnerHTML={{ __html: renderHighlightedFact(content.fact) }}
        />
      </motion.div>
      
      {/* Extended content (expandable) */}
      {content.extended_content && (
        <div className="mt-2">
          <AnimatePresence>
            {expanded ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-white text-sm sm:text-base mt-2">{content.extended_content}</p>
              </motion.div>
            ) : (
              <motion.button
                onClick={() => setExpanded(true)}
                className="text-wonderwhiz-bright-pink text-xs sm:text-sm hover:underline mt-1 flex items-center"
                whileHover={{ x: 3 }}
              >
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Surprise element/plot twist */}
      {hasSurpriseElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-3 bg-gradient-to-r from-wonderwhiz-gold/20 to-wonderwhiz-bright-pink/20 backdrop-blur-sm rounded-lg p-3 border border-white/10 relative overflow-hidden"
        >
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-white/5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
          />
          
          <div className="relative">
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 rounded-full bg-wonderwhiz-gold/30 flex items-center justify-center mr-2">
                <Sparkles className="h-3 w-3 text-wonderwhiz-gold" />
              </div>
              <h5 className="text-white text-sm font-medium">Wait, there's more!</h5>
            </div>
            
            <motion.button
              className="text-white/90 text-sm hover:text-white"
              onClick={() => setRevealedSurprise(true)}
              whileHover={{ scale: 1.02 }}
            >
              Tap to reveal a surprising fact...
            </motion.button>
            
            <AnimatePresence>
              {revealedSurprise && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-sm mt-2"
                >
                  {content.surprise_element}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      
      {/* "This made me wonder" prompt */}
      <motion.div
        variants={textVariants}
        className="mt-4"
      >
        <div 
          className="text-white/80 text-sm cursor-pointer"
          onClick={() => setShowWonderTrigger(!showWonderTrigger)}
        >
          <p>What does this make you wonder about our incredible world?</p>
        </div>
        
        <AnimatePresence>
          {showWonderTrigger && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2 overflow-hidden"
            >
              <p className="text-white/60 text-sm">Curious about...</p>
              
              <ul className="space-y-2 pl-1">
                {rabbitHoleQuestions.map((question, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <motion.button
                      className="text-left text-white/80 text-sm hover:text-wonderwhiz-bright-pink group flex items-start"
                      whileHover={{ x: 5 }}
                      onClick={() => onRabbitHoleClick(question)}
                    >
                      <ArrowRight className="h-3.5 w-3.5 mr-2 mt-1 text-white/40 group-hover:text-wonderwhiz-bright-pink transition-colors" />
                      <span>{question}</span>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FactBlock;
