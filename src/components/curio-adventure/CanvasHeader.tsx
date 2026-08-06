import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Flame, Trophy as TrophyIcon } from 'lucide-react';
import { GoalRing } from './DailyPanel';

interface Props {
  levelEmoji: string;
  levelName: string;
  levelProgress: number;
  sparks: number;
  chain: number;
  streak: number;
  goalPct: number;
  todaySparks: number;
  dailyGoal: number;
  onBack: () => void;
  backLabel: string;
  onOpenShelf: () => void;
}

const CanvasHeader: React.FC<Props> = ({
  levelEmoji, levelName, levelProgress, sparks, chain, streak,
  goalPct, todaySparks, dailyGoal, onBack, backLabel, onOpenShelf,
}) => (
  <header className="sticky top-0 z-30 backdrop-blur-xl bg-surface-primary/90 border-b border-border">
    <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
      <button
        onClick={onBack}
        aria-label={backLabel}
        className="h-10 w-10 rounded-xl border border-border bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-black text-text-primary">
          <span>{levelEmoji}</span>
          <span className="truncate">{levelName}</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
          <div className="h-full bg-accent-brand rounded-full transition-all" style={{ width: `${levelProgress}%` }} />
        </div>
      </div>

      <motion.div
        key={sparks}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-accent-warning/15 border border-accent-warning/30"
      >
        <Zap className="h-4 w-4 text-accent-warning" />
        <span className="font-black text-text-primary text-sm tabular-nums">{sparks}</span>
      </motion.div>

      {chain > 1 && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-accent-brand/15 border border-accent-brand/30" title="Curiosity chain this session">
          <span className="text-sm">🔗</span>
          <span className="font-black text-text-primary text-sm">{chain}</span>
        </div>
      )}

      {streak > 0 && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-accent-error/15 border border-accent-error/30" title={`${streak}-day streak`}>
          <Flame className="h-4 w-4 text-accent-error" />
          <span className="font-black text-text-primary text-sm">{streak}</span>
        </div>
      )}

      <GoalRing pct={goalPct} today={todaySparks} goal={dailyGoal} />

      <button
        onClick={onOpenShelf}
        aria-label="Trophy shelf"
        className="h-10 w-10 rounded-xl border border-border bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-text-primary"
      >
        <TrophyIcon className="h-5 w-5" />
      </button>
    </div>
  </header>
);

export default React.memo(CanvasHeader);
