
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface SparksBalanceProps {
  childId: string;
  initialBalance?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showAnimation?: boolean;
}

const SparksBalance: React.FC<SparksBalanceProps> = ({ 
  childId, 
  initialBalance = 0,
  size = 'md',
  className = '',
  showAnimation = true
}) => {
  const [sparks, setSparks] = useState(initialBalance);
  const [showIncrementAnimation, setShowIncrementAnimation] = useState(false);
  const [previousSparks, setPreviousSparks] = useState(initialBalance);
  const [sparkIncrement, setSparkIncrement] = useState(0);
  
  // Subscribe to real-time updates for this child's sparks balance
  useEffect(() => {
    if (!childId) return;
    
    // Initial fetch of the current balance
    const fetchSparksBalance = async () => {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('sparks_balance')
        .eq('id', childId)
        .single();
      
      if (error) {
        console.error('Error fetching sparks balance:', error);
        return;
      }
      
      if (data && data.sparks_balance !== undefined) {
        setSparks(data.sparks_balance);
        setPreviousSparks(data.sparks_balance);
      }
    };
    
    fetchSparksBalance();
    
    // Subscribe to changes in the child's sparks balance
    const channel = supabase
      .channel(`profile-${childId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'child_profiles',
        filter: `id=eq.${childId}`
      }, (payload) => {
        const newBalance = payload.new.sparks_balance;
        if (newBalance !== undefined && newBalance !== sparks) {
          setPreviousSparks(sparks);
          setSparks(newBalance);
          
          // Calculate increment
          const increment = newBalance - sparks;
          setSparkIncrement(increment);
          
          // Trigger the animation if the balance increased and animations are enabled
          if (newBalance > sparks && showAnimation) {
            setShowIncrementAnimation(true);
            setTimeout(() => setShowIncrementAnimation(false), 3000);
          }
        }
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [childId, sparks, showAnimation]);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-bold'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Main balance display */}
      <motion.div 
        className={`flex items-center px-3 py-1.5 ${size === 'lg' ? 'bg-gradient-to-r from-wonderwhiz-gold/20 to-yellow-500/10' : ''} rounded-full`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={showIncrementAnimation ? {
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.5 }}
          className="mr-1.5"
        >
          <Sparkles className={`${iconSizes[size]} text-wonderwhiz-gold`} />
        </motion.div>
        
        <span className={`${sizeClasses[size]} text-wonderwhiz-gold font-semibold`}>
          {sparks}
        </span>
      </motion.div>
      
      {/* Increment animation */}
      <AnimatePresence>
        {showIncrementAnimation && sparkIncrement > 0 && (
          <motion.div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="px-2 py-1 bg-wonderwhiz-gold/20 backdrop-blur-sm rounded-full flex items-center text-wonderwhiz-gold font-bold"
              animate={{ 
                scale: [0.8, 1.2, 1],
              }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              +{sparkIncrement}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SparksBalance;
