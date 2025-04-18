
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Award, Flame, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface SparksPanelProps {
  childId: string;
  sparksBalance: number;
  streakDays: number;
  onClose: () => void;
}

interface SparksTransaction {
  id: string;
  child_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

const SparksPanel: React.FC<SparksPanelProps> = ({ 
  childId, 
  sparksBalance, 
  streakDays, 
  onClose 
}) => {
  const [transactions, setTransactions] = useState<SparksTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sparks_transactions')
          .select('*')
          .eq('child_id', childId)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [childId]);
  
  const getMilestoneLevel = () => {
    if (sparksBalance >= 500) return { name: "Spark Champion", level: 5, nextTarget: null };
    if (sparksBalance >= 250) return { name: "Spark Master", level: 4, nextTarget: 500 };
    if (sparksBalance >= 100) return { name: "Spark Adventurer", level: 3, nextTarget: 250 };
    if (sparksBalance >= 50) return { name: "Spark Explorer", level: 2, nextTarget: 100 };
    return { name: "Spark Beginner", level: 1, nextTarget: 50 };
  };
  
  const milestone = getMilestoneLevel();
  const progressPercentage = milestone.nextTarget 
    ? Math.min(100, (sparksBalance / milestone.nextTarget) * 100)
    : 100;

  return (
    <div className="p-5 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-wonderwhiz-vibrant-yellow" />
          Your Sparks Journey
        </h3>
        
        <Button variant="ghost" size="icon" className="text-white/70" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <motion.div 
        className="bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/20 rounded-xl p-5 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h4 className="text-white text-lg font-bold">{sparksBalance}</h4>
              <p className="text-white/60 text-xs">Total Sparks</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-cyan flex items-center justify-center">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h4 className="text-white text-lg font-bold">{streakDays}</h4>
              <p className="text-white/60 text-xs">Day Streak</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow" />
              <span className="text-white font-medium">{milestone.name}</span>
            </div>
            <div className="text-white/60 text-xs">
              Level {milestone.level}
            </div>
          </div>
          
          {milestone.nextTarget && (
            <div className="space-y-2">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>{sparksBalance} sparks</span>
                <span>{milestone.nextTarget - sparksBalance} more to next level</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <div className="space-y-2">
        <h4 className="text-white font-medium flex items-center mb-2">
          <TrendingUp className="h-4 w-4 mr-2 text-wonderwhiz-cyan" />
          Recent Activity
        </h4>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-t-transparent border-wonderwhiz-bright-pink rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6 text-white/60">
            No spark activity yet
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <motion.div 
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-white text-sm line-clamp-1">{transaction.reason}</p>
                <p className="text-white/60 text-xs">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className={`flex items-center font-bold ${transaction.amount > 0 ? 'text-wonderwhiz-vibrant-yellow' : 'text-red-400'}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                <Star className="h-3 w-3 ml-1" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SparksPanel;
