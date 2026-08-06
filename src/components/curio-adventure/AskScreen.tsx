import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, History } from 'lucide-react';
import DailyPanel from './DailyPanel';
import { MOODS, Mood, CurioRecord } from './types';
import { BADGES, Quest } from '@/hooks/useCurioProgress';

interface Props {
  childName: string;
  mood: Mood;
  onMood: (m: Mood) => void;
  dailyChallenge: string;
  suggestions: string[];
  onAsk: (q: string) => void;
  streak: number;
  freezes: number;
  week: { key: string; label: string; active: boolean }[];
  todaySparks: number;
  dailyGoal: number;
  goalPct: number;
  quests: Quest[];
  onClaim: (id: string) => void;
  history: CurioRecord[];
  badges: string[];
}

const AskScreen: React.FC<Props> = ({
  childName, mood, onMood, dailyChallenge, suggestions, onAsk,
  streak, freezes, week, todaySparks, dailyGoal, goalPct, quests, onClaim,
  history, badges,
}) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="pt-4">
      <h1 className="text-3xl sm:text-4xl font-black text-text-primary leading-tight">
        What do you want to explore today, {childName}?
      </h1>
      <p className="mt-2 text-text-secondary">Ask anything. I'll spark an answer in seconds.</p>
    </div>

    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2">Pick a mood</p>
      <div className="grid grid-cols-4 gap-2">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => onMood(m.id)}
            className={[
              'rounded-3xl py-3 border-2 font-bold text-xs flex flex-col items-center gap-1 transition min-h-[70px] justify-center',
              mood === m.id
                ? 'border-accent-brand bg-accent-brand/15 text-text-primary'
                : 'border-border bg-surface-secondary text-text-secondary hover:border-accent-brand/40',
            ].join(' ')}
          >
            <span className="text-xl">{m.emoji}</span>{m.label}
          </button>
        ))}
      </div>
    </div>

    <DailyPanel
      streak={streak}
      freezes={freezes}
      week={week}
      today={todaySparks}
      goal={dailyGoal}
      pct={goalPct}
      quests={quests}
      onClaim={onClaim}
    />

    <button
      onClick={() => onAsk(dailyChallenge)}
      className="w-full text-left p-4 rounded-[28px] border-2 border-accent-warning bg-accent-warning/10 flex items-center gap-3 shadow-sm"
    >
      <span className="text-2xl">🏅</span>
      <span className="flex-1">
        <span className="block text-xs font-bold uppercase tracking-widest text-accent-warning">Daily Wonder</span>
        <span className="block font-bold text-text-primary">{dailyChallenge}</span>
      </span>
      <ChevronRight className="h-5 w-5 text-text-tertiary" />
    </button>

    <div className="grid grid-cols-2 gap-2.5">
      {suggestions.map((q) => (
        <button
          key={q}
          onClick={() => onAsk(q)}
          className="p-4 rounded-3xl border-2 border-border bg-surface-secondary text-left text-sm font-bold text-text-primary hover:border-accent-brand hover:-translate-y-0.5 transition min-h-[68px] shadow-sm"
        >
          {q}
        </button>
      ))}
    </div>

    {history.length > 0 && (
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2 flex items-center gap-1.5">
          <History className="h-3.5 w-3.5" /> Your Curios
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {history.map((h) => (
            <button
              key={h.id}
              onClick={() => onAsk(h.question)}
              className="shrink-0 px-3.5 py-2.5 rounded-2xl border border-border bg-surface-secondary text-sm font-semibold text-text-secondary hover:text-text-primary flex items-center gap-2"
            >
              <span>{h.emoji}</span>
              <span className="max-w-[140px] truncate">{h.title}</span>
              {h.completed && <span className="text-accent-success">✓</span>}
            </button>
          ))}
        </div>
      </div>
    )}

    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2">Badges</p>
      <div className="flex flex-wrap gap-2">
        {BADGES.map((b) => {
          const has = badges.includes(b.id);
          return (
            <div
              key={b.id}
              title={has ? b.name : b.hint}
              className={[
                'px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5',
                has ? 'border-accent-warning/50 bg-accent-warning/10 text-text-primary' : 'border-border bg-surface-secondary text-text-tertiary',
              ].join(' ')}
            >
              <span className={has ? '' : 'grayscale opacity-50'}>{b.emoji}</span>
              {has ? b.name : '???'}
            </div>
          );
        })}
      </div>
    </div>
  </motion.div>
);

export default React.memo(AskScreen);
