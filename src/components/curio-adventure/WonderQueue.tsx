import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus, X } from 'lucide-react';

interface Props {
  queue: string[];
  onAdd: (q: string) => void;
  onRemove: (q: string) => void;
}

/**
 * "Wait — but why?" capture. Kids can park a stray question mid-dive without
 * losing their place; the parked questions become the next adventure.
 */
const WonderQueue: React.FC<Props> = ({ queue, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = value.trim();
    if (!clean) return;
    onAdd(clean);
    setValue('');
    setOpen(false);
  };

  return (
    <div className="fun-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" /> Wonder queue
          {queue.length > 0 && (
            <span className="ml-1 rounded-full bg-accent-brand/15 px-2 py-0.5 text-accent-brand tabular-nums">
              {queue.length}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="fun-chip"
          aria-expanded={open}
        >
          <Plus className="h-3.5 w-3.5" /> Park a question
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="mt-3 flex items-center gap-2 overflow-hidden"
          >
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Wait… but why?"
              aria-label="Park a question for later"
              className="flex-1 rounded-full border-2 border-border bg-surface-secondary px-4 py-2.5 text-base text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent-brand"
            />
            <button type="submit" className="rounded-full bg-accent-brand px-4 py-2.5 text-sm font-black text-text-inverse">
              Save
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {queue.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {queue.map((q) => (
            <li key={q} className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface-tertiary px-3 py-1.5 text-sm font-semibold text-text-primary">
              <span className="max-w-[220px] truncate">{q}</span>
              <button type="button" onClick={() => onRemove(q)} aria-label={`Remove ${q}`} className="text-text-tertiary hover:text-text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {queue.length === 0 && !open && (
        <p className="mt-2 text-sm text-text-tertiary">Got a side question? Park it here and keep reading.</p>
      )}
    </div>
  );
};

export default React.memo(WonderQueue);
