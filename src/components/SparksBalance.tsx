
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SparksBadge from './SparksBadge';
import { supabase } from '@/integrations/supabase/client';

interface SparksBalanceProps {
  childId: string;
  initialBalance?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SparksBalance: React.FC<SparksBalanceProps> = ({ 
  childId, 
  initialBalance = 0,
  size = 'md',
  className = ''
}) => {
  const [sparks, setSparks] = useState(initialBalance);
  const [showAnimation, setShowAnimation] = useState(false);
  const [previousSparks, setPreviousSparks] = useState(initialBalance);
  
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
          
          // Trigger the animation if the balance increased
          if (newBalance > sparks) {
            setShowAnimation(true);
            setTimeout(() => setShowAnimation(false), 2000);
          }
        }
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [childId, sparks]);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-bold'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <SparksBadge 
        sparks={sparks} 
        size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
        showAnimation={showAnimation}
      />
      
      {/* Show gained sparks animation */}
      <AnimatePresence>
        {showAnimation && sparks > previousSparks && (
          <motion.div 
            className="ml-2 text-wonderwhiz-gold font-medium flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              +{sparks - previousSparks}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SparksBalance;
