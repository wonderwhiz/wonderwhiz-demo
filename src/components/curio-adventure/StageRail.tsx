import React from 'react';

export type RailStage = 'spark' | 'dive' | 'make' | 'reward';

const STEPS: { id: RailStage; label: string; emoji: string }[] = [
  { id: 'spark', label: 'Spark', emoji: '⚡' },
  { id: 'dive', label: 'Deep dive', emoji: '🔎' },
  { id: 'make', label: 'Make', emoji: '🛠️' },
  { id: 'reward', label: 'Trophy', emoji: '🏆' },
];

interface Props {
  stage: RailStage;
  /** 0..1 progress inside the current step (used for the dive parts). */
  innerPct?: number;
}

/** A always-visible map of where the child is in the adventure. */
const StageRail: React.FC<Props> = ({ stage, innerPct = 0 }) => {
  const current = STEPS.findIndex((s) => s.id === stage);

  return (
    <div className="flex items-center gap-1.5" aria-label="Adventure progress">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.id} className="flex-1 min-w-0">
            <div className="h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-accent-success' : 'bg-accent-brand'}`}
                style={{ width: done ? '100%' : active ? `${Math.max(12, innerPct * 100)}%` : '0%' }}
              />
            </div>
            <p
              className={`mt-1 truncate text-[10px] font-black uppercase tracking-widest ${
                active ? 'text-accent-brand' : done ? 'text-accent-success' : 'text-text-tertiary'
              }`}
            >
              <span className="mr-1">{s.emoji}</span>
              {s.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(StageRail);
