
import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Medal, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface SparksBalanceProps {
  childId: string;
  initialBalance?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const SparksBalance: React.FC<SparksBalanceProps> = ({ 
  childId, 
  initialBalance, 
  size = 'md', 
  className = '',
  animated = true
}) => {
  const [balance, setBalance] = useState<number>(initialBalance || 0);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [previousBalance, setPreviousBalance] = useState<number>(initialBalance || 0);
  
  // Get sizes based on the size prop
  const iconSize = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base';
  
  // Get the badge component based on balance milestone
  const getBadgeIcon = () => {
    if (balance >= 1000) return <Trophy className={`${iconSize} text-wonderwhiz-gold ml-1`} />;
    if (balance >= 500) return <Medal className={`${iconSize} text-wonderwhiz-gold ml-1`} />;
    if (balance >= 100) return <Star className={`${iconSize} text-wonderwhiz-gold ml-1`} />;
    return null;
  };
  
  useEffect(() => {
    if (!childId) return;
    
    // Fetch the current balance from the database
    const fetchBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('sparks_balance')
          .eq('id', childId)
          .single();
          
        if (error) throw error;
        
        if (data && typeof data.sparks_balance === 'number') {
          if (animated && data.sparks_balance > balance) {
            setPreviousBalance(balance);
            setIsIncrementing(true);
          }
          setBalance(data.sparks_balance);
        }
      } catch (error) {
        console.error('Error fetching sparks balance:', error);
      }
    };
    
    fetchBalance();
    
    // Subscribe to changes in the child profile
    const sparksChannel = supabase
      .channel('sparks_balance_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'child_profiles',
          filter: `id=eq.${childId}`
        },
        (payload) => {
          if (payload.new && typeof payload.new.sparks_balance === 'number') {
            if (animated && payload.new.sparks_balance > balance) {
              setPreviousBalance(balance);
              setIsIncrementing(true);
            }
            setBalance(payload.new.sparks_balance);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(sparksChannel);
    };
  }, [childId, balance, animated]);
  
  useEffect(() => {
    if (isIncrementing) {
      const timer = setTimeout(() => {
        setIsIncrementing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isIncrementing]);

  return (
    <div className={`flex items-center ${className}`}>
      <Sparkles className={`${iconSize} text-wonderwhiz-gold mr-1`} />
      <div className="flex items-center">
        <AnimatePresence mode="wait">
          <motion.span 
            key={balance}
            className={`font-semibold ${textSize} ${isIncrementing ? 'text-wonderwhiz-gold' : 'text-white'}`}
            initial={animated ? { scale: isIncrementing ? 1.2 : 1, y: isIncrementing ? -10 : 0 } : {}}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {balance}
          </motion.span>
        </AnimatePresence>
        <span className="text-white/70 ml-1">Sparks</span>
        {getBadgeIcon()}
      </div>
      
      {isIncrementing && (
        <motion.div 
          className="absolute"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-wonderwhiz-gold font-medium">
            +{balance - previousBalance}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default SparksBalance;
