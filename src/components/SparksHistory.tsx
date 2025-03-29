
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, Calendar, Sparkles, Pencil, BookOpen, 
  MessageSquare, Rabbit, Heart, Award 
} from 'lucide-react';

interface SparksTransaction {
  id: string;
  child_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

interface SparksHistoryProps {
  childId: string;
  limit?: number;
  className?: string;
}

const SparksHistory: React.FC<SparksHistoryProps> = ({ childId, limit = 10, className = '' }) => {
  const [transactions, setTransactions] = useState<SparksTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!childId) return;
    
    const fetchTransactions = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('sparks_transactions')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching sparks transactions:', error);
        return;
      }
      
      setTransactions(data || []);
      setLoading(false);
    };
    
    fetchTransactions();
    
    // Subscribe to new transactions
    const channel = supabase
      .channel(`sparks-${childId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sparks_transactions',
        filter: `child_id=eq.${childId}`
      }, (payload) => {
        setTransactions(prev => {
          // Add new transaction at the beginning and limit to specified count
          const updated = [payload.new as SparksTransaction, ...prev];
          return updated.slice(0, limit);
        });
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [childId, limit]);
  
  // Function to get appropriate icon for transaction type
  const getTransactionIcon = (reason: string) => {
    if (reason.toLowerCase().includes('task') || reason.toLowerCase().includes('completing')) 
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (reason.toLowerCase().includes('streak')) 
      return <Calendar className="h-4 w-4 text-amber-400" />;
    if (reason.toLowerCase().includes('quiz') || reason.toLowerCase().includes('answering')) 
      return <Award className="h-4 w-4 text-blue-400" />;
    if (reason.toLowerCase().includes('creative') || reason.toLowerCase().includes('drawing')) 
      return <Pencil className="h-4 w-4 text-purple-400" />;
    if (reason.toLowerCase().includes('news') || reason.toLowerCase().includes('reading')) 
      return <BookOpen className="h-4 w-4 text-teal-400" />;
    if (reason.toLowerCase().includes('curio')) 
      return <MessageSquare className="h-4 w-4 text-wonderwhiz-pink" />;
    if (reason.toLowerCase().includes('rabbit') || reason.toLowerCase().includes('follow')) 
      return <Rabbit className="h-4 w-4 text-wonderwhiz-blue" />;
    if (reason.toLowerCase().includes('mood') || reason.toLowerCase().includes('check-in')) 
      return <Heart className="h-4 w-4 text-red-400" />;
      
    return <Sparkles className="h-4 w-4 text-wonderwhiz-gold" />;
  };
  
  if (loading) {
    return (
      <div className={`p-4 text-center text-white/70 ${className}`}>
        <motion.div 
          className="inline-block"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <p className="mt-2">Loading sparks history...</p>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p className="text-white/70 italic">No spark transactions yet.</p>
        <p className="text-sm text-white/50 mt-2">Keep exploring to earn sparks!</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence>
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center">
              <div className="mr-3 p-1.5 rounded-full bg-white/10">
                {getTransactionIcon(transaction.reason)}
              </div>
              <div>
                <p className="text-sm text-white">{transaction.reason}</p>
                <p className="text-xs text-white/60">
                  {format(new Date(transaction.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
            <div className="flex items-center text-wonderwhiz-gold font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>+{transaction.amount}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SparksHistory;
