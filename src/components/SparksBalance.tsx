
import React, { useState, useEffect } from 'react';
import { Sparkles, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SparksBalanceProps {
  childId: string;
  initialBalance?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showAnimation?: boolean;
  showLevel?: boolean;
}

const SparksBalance: React.FC<SparksBalanceProps> = ({ 
  childId, 
  initialBalance = 0,
  size = 'md',
  className = '',
  showAnimation = true,
  showLevel = true
}) => {
  const [sparks, setSparks] = useState(initialBalance);
  const [showIncrementAnimation, setShowIncrementAnimation] = useState(false);
  const [previousSparks, setPreviousSparks] = useState(initialBalance);
  const [sparkIncrement, setSparkIncrement] = useState(0);
  
  // Calculate level based on sparks
  const level = Math.floor(sparks / 50) + 1;
  
  // Subscribe to real-time updates for this child's sparks balance
  useEffect(() => {
    if (!childId) return;
    
    // Initial fetch of the current balance
    const fetchSparksBalance = async () => {
      try {
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
      } catch (error) {
        console.error('Error in fetchSparksBalance:', error);
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
      <div 
        className={`flex items-center px-3 py-1.5 ${size === 'lg' ? 'bg-gradient-to-r from-wonderwhiz-gold/20 to-yellow-500/10' : ''} rounded-full`}
      >
        <div className="mr-1.5">
          <Sparkles className={`${iconSizes[size]} text-wonderwhiz-gold`} />
        </div>
        
        <span className={`${sizeClasses[size]} text-wonderwhiz-gold font-semibold`}>
          {sparks}
        </span>
        
        {showLevel && (
          <div className="ml-2 flex items-center text-xs text-white/60 px-1.5 py-0.5 bg-white/10 rounded-full">
            <Award className="h-3 w-3 mr-1 text-wonderwhiz-gold/70" />
            <span>Lvl {level}</span>
          </div>
        )}
      </div>
      
      {/* Increment display - simplified version without animation */}
      {showIncrementAnimation && sparkIncrement > 0 && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <div className="px-2 py-1 bg-wonderwhiz-gold/20 backdrop-blur-sm rounded-full flex items-center text-wonderwhiz-gold font-bold">
            <Sparkles className="w-3 h-3 mr-1" />
            +{sparkIncrement}
          </div>
        </div>
      )}
    </div>
  );
};

export default SparksBalance;
