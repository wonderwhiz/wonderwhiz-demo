
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Trophy, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DailyChallengeProps {
  childId: string;
  onComplete?: () => void;
}

const challenges = [
  { 
    id: 'challenge-1', 
    title: 'Answer a quiz correctly', 
    description: 'Complete any quiz in your curios', 
    icon: <Star className="h-5 w-5 text-amber-400" />,
    reward: 5
  },
  { 
    id: 'challenge-2', 
    title: 'Read an interesting fact', 
    description: 'Explore a fact card in any curio', 
    icon: <Sparkles className="h-5 w-5 text-cyan-400" />,
    reward: 3
  },
  { 
    id: 'challenge-3', 
    title: 'Create something new', 
    description: 'Complete a creative challenge', 
    icon: <Trophy className="h-5 w-5 text-purple-400" />,
    reward: 10
  }
];

const DailyChallenge: React.FC<DailyChallengeProps> = ({ childId, onComplete }) => {
  const [completed, setCompleted] = useState<string[]>([]);
  
  const markAsCompleted = async (challengeId: string, reward: number) => {
    if (completed.includes(challengeId)) return;
    
    try {
      // Record the completion
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: childId,
          amount: reward
        })
      });

      // Record the transaction
      await supabase.from('sparks_transactions').insert({
        child_id: childId,
        amount: reward,
        reason: `Daily challenge: ${challengeId}`
      });
      
      setCompleted(prev => [...prev, challengeId]);
      
      // Show celebration toast
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Challenge completed!</span> 
          <span className="text-sm opacity-90">You earned {reward} sparks!</span>
        </div>,
        {
          duration: 4000,
          position: "top-center"
        }
      );
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast.error('Couldn\'t record your challenge. Try again!');
    }
  };
  
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-white">
          <Trophy className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
          Today's Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <motion.div 
              key={challenge.id}
              className={`p-3 rounded-lg transition-all relative overflow-hidden ${
                completed.includes(challenge.id) 
                  ? 'bg-green-500/20' 
                  : 'bg-white/10 hover:bg-white/15'
              }`}
              whileHover={{ scale: completed.includes(challenge.id) ? 1 : 1.02 }}
            >
              {completed.includes(challenge.id) && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <div className="flex items-center relative z-10">
                <div className="mr-3">{challenge.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-white flex items-center">
                    {challenge.title}
                    {completed.includes(challenge.id) && (
                      <Check className="ml-2 h-4 w-4 text-green-400" />
                    )}
                  </h4>
                  <p className="text-xs text-white/70">{challenge.description}</p>
                </div>
                {!completed.includes(challenge.id) && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs bg-wonderwhiz-gold/20 text-wonderwhiz-gold hover:bg-wonderwhiz-gold/30"
                    onClick={() => markAsCompleted(challenge.id, challenge.reward)}
                  >
                    <Sparkles className="mr-1 h-3 w-3" /> +{challenge.reward}
                  </Button>
                )}
                {completed.includes(challenge.id) && (
                  <span className="text-xs text-green-400 font-medium">Completed!</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChallenge;
