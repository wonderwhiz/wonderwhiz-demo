import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Snowflake, Check } from 'lucide-react';
import type { Quest } from '@/hooks/useCurioProgress';

/* ---------- header goal ring (Duolingo's daily XP ring) ---------- */
export const GoalRing: React.FC<{ pct: number; today: number; goal: number }> = ({ pct, today, goal }) => {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative h-10 w-10 shrink-0"
      title={`Daily goal: ${today} of ${goal} Sparks`}
      aria-label={`Daily goal ${today} of ${goal} sparks`}
    >
      <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
        <circle cx="18" cy="18" r={r} className="stroke-border" strokeWidth="4" fill="none" />
        <motion.circle
          cx="18" cy="18" r={r}
          className="stroke-accent-warning" strokeWidth="4" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-text-primary tabular-nums">
        {pct >= 100 ? '✓' : `${pct}%`}
      </span>
    </div>
  );
};

/* ---------- streak calendar + daily quests ---------- */
interface PanelProps {
  streak: number;
  freezes: number;
  week: { key: string; label: string; active: boolean }[];
  today: number;
  goal: number;
  pct: number;
  quests: Quest[];
  onClaim: (id: string) => void;
}

const DailyPanel: React.FC<PanelProps> = ({ streak, freezes, week, today, goal, pct, quests, onClaim }) => (
  <div className="space-y-3">
    {/* streak + goal */}
    <div className="rounded-[28px] border-2 border-border bg-surface-secondary p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent-error" />
          <span className="font-black text-text-primary">
            {streak} day{streak === 1 ? '' : 's'} in a row
          </span>
        </div>
        {freezes > 0 && (
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-brand/15 border border-accent-brand/30 text-xs font-bold text-text-primary"
            title="A Streak Freeze saves your streak if you miss a day"
          >
            <Snowflake className="h-3.5 w-3.5 text-accent-brand" /> {freezes} freeze{freezes > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-1.5">
        {week.map((d) => (
          <div key={d.key} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[10px] font-bold text-text-tertiary">{d.label}</span>
            <span
              className={[
                'h-8 w-8 rounded-full flex items-center justify-center text-sm border-2',
                d.active
                  ? 'bg-accent-error/15 border-accent-error text-accent-error'
                  : 'bg-surface-tertiary border-border text-text-tertiary',
              ].join(' ')}
            >
              {d.active ? '🔥' : '·'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-text-secondary mb-1.5">
          <span>Today's goal</span>
          <span className="tabular-nums">{Math.min(today, goal)} / {goal} ⚡</span>
        </div>
        <div className="h-3 rounded-full bg-surface-tertiary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-accent-warning"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {pct >= 100 && (
          <p className="mt-2 text-xs font-bold text-accent-success">Goal smashed! You earned a Streak Freeze ❄️</p>
        )}
      </div>
    </div>

    {/* quests */}
    <div className="rounded-[28px] border-2 border-border bg-surface-secondary p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-3">Daily quests</p>
      <div className="space-y-2.5">
        {quests.map((q) => (
          <div key={q.id} className="flex items-center gap-3">
            <span className="text-xl w-7 text-center">{q.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">{q.label}</p>
              <div className="mt-1 h-2 rounded-full bg-surface-tertiary overflow-hidden">
                <div
                  className={q.done ? 'h-full bg-accent-success' : 'h-full bg-accent-brand'}
                  style={{ width: `${(q.progress / q.target) * 100}%` }}
                />
              </div>
            </div>
            {q.claimed ? (
              <span className="h-9 w-9 rounded-xl bg-accent-success/15 border border-accent-success/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-accent-success" />
              </span>
            ) : q.done ? (
              <button
                onClick={() => onClaim(q.id)}
                className="px-3 py-2 rounded-xl bg-accent-warning text-text-inverse text-xs font-black flex items-center gap-1"
              >
                <Zap className="h-3.5 w-3.5" /> +{q.reward}
              </button>
            ) : (
              <span className="text-xs font-black text-text-tertiary tabular-nums w-10 text-right">
                {q.progress}/{q.target}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DailyPanel;
