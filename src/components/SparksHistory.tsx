
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUp, ArrowDown, CalendarClock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SparksTransaction {
  id: string;
  child_id: string;
  amount: number;
  reason: string;
  created_at: string;
  block_id?: string;
}

interface SparksHistoryProps {
  childId: string;
  limit?: number;
  className?: string;
}

const SparksHistory: React.FC<SparksHistoryProps> = ({ 
  childId, 
  limit = 10,
  className = ''
}) => {
  const [transactions, setTransactions] = useState<SparksTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) return;
    
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('sparks_transactions')
          .select('*')
          .eq('child_id', childId)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching sparks transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
    
    // Subscribe to new transactions
    const transactionsChannel = supabase
      .channel('sparks_transactions_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sparks_transactions',
          filter: `child_id=eq.${childId}`
        },
        (payload) => {
          if (payload.new) {
            setTransactions(prev => [payload.new as SparksTransaction, ...prev.slice(0, limit - 1)]);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(transactionsChannel);
    };
  }, [childId, limit]);

  if (loading) {
    return (
      <Card className={`bg-white/5 border-white/10 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
            Sparks History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
          Sparks History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-white/70">
            No spark transactions yet!
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className={`h-9 w-9 rounded-full flex items-center justify-center mr-3 ${
                  transaction.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-white font-medium">
                      {transaction.reason}
                    </span>
                  </div>
                  <div className="flex items-center text-white/60 text-sm">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                
                <div className={`text-lg font-semibold ${
                  transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SparksHistory;
