import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckpointData } from './types';

interface Props {
  data: CheckpointData;
  onResolved: (correct: boolean) => void;
}

const KIND_LABEL: Record<string, { label: string; emoji: string }> = {
  quiz: { label: 'Quick check', emoji: '🎯' },
  flip: { label: 'Flip card', emoji: '🃏' },
  myth: { label: 'Myth or Fact?', emoji: '🕵️' },
  riddle: { label: 'Riddle', emoji: '🧩' },
};

const Checkpoint: React.FC<Props> = ({ data, onResolved }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const meta = KIND_LABEL[data.kind] ?? KIND_LABEL.quiz;
  const isChoice = data.kind === 'quiz' || data.kind === 'myth';

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onResolved(i === data.correct_index);
  };

  const reveal = () => {
    if (flipped) return;
    setFlipped(true);
    onResolved(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border bg-surface-secondary backdrop-blur-xl p-5 sm:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-3">
        {meta.emoji} {meta.label}
      </p>
      <p className="text-lg sm:text-xl font-bold text-text-primary leading-snug">{data.prompt}</p>

      {isChoice && (
        <div className="mt-4 grid gap-2.5">
          {data.options.map((opt, i) => {
            const isCorrect = i === data.correct_index;
            const chosen = picked === i;
            const state = picked === null ? 'idle' : isCorrect ? 'right' : chosen ? 'wrong' : 'dim';
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={[
                  'w-full text-left px-4 py-3.5 rounded-2xl border text-base font-semibold transition min-h-[52px] flex items-center gap-3',
                  state === 'idle' && 'border-border bg-surface-tertiary text-text-primary hover:border-accent-brand/60 hover:bg-surface-tertiary',
                  state === 'right' && 'border-accent-success/70 bg-accent-success/15 text-text-primary',
                  state === 'wrong' && 'border-accent-error/70 bg-accent-error/15 text-text-primary',
                  state === 'dim' && 'border-border bg-surface-tertiary text-text-tertiary',
                ].filter(Boolean).join(' ')}
              >
                <span className="flex-1">{opt}</span>
                {state === 'right' && <Check className="h-5 w-5 text-accent-success shrink-0" />}
                {state === 'wrong' && <X className="h-5 w-5 text-accent-error shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {!isChoice && (
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.button
                key="front"
                onClick={reveal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full px-4 py-5 rounded-2xl border border-accent-brand/40 bg-accent-brand/10 text-text-primary font-bold hover:bg-accent-brand/20 transition flex items-center justify-center gap-2 min-h-[64px]"
              >
                <RotateCcw className="h-4 w-4" /> Tap to reveal
              </motion.button>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0, rotateX: -25 }}
                animate={{ opacity: 1, rotateX: 0 }}
                className="px-4 py-5 rounded-2xl border border-accent-success/50 bg-accent-success/10"
              >
                <p className="text-lg font-bold text-text-primary">{data.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {(picked !== null || flipped) && data.explanation && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 text-sm text-text-secondary leading-relaxed flex gap-2"
          >
            <Sparkles className="h-4 w-4 text-accent-warning shrink-0 mt-0.5" />
            <span>{data.explanation}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Checkpoint;
