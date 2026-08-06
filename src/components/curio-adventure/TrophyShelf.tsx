import React from 'react';
import { motion } from 'framer-motion';
import { Trophy as TrophyIcon, X } from 'lucide-react';
import { Trophy } from './types';

interface Props {
  trophies: Trophy[];
  onClose: () => void;
}

const TrophyShelf: React.FC<Props> = ({ trophies, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-surface-overlay/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-lg max-h-[70vh] overflow-y-auto rounded-3xl border border-border bg-surface-secondary p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-accent-warning" /> Trophy Shelf
        </h3>
        <button onClick={onClose} aria-label="Close" className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary">
          <X className="h-5 w-5" />
        </button>
      </div>
      {trophies.length === 0 ? (
        <p className="text-text-tertiary text-sm">Finish a Make Mode challenge to earn your first trophy.</p>
      ) : (
        <div className="grid gap-3">
          {trophies.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-surface-tertiary overflow-hidden">
              {t.photo && <img src={t.photo} alt={t.title} className="w-full max-h-40 object-cover" />}
              <div className="p-3.5">
                <p className="font-bold text-text-primary">{t.emoji} {t.title}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{t.topic} · {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  </motion.div>
);

export default React.memo(TrophyShelf);
