import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, BookOpen, Volume2, VolumeX, Loader2, Baby, Rocket } from 'lucide-react';
import { SectionData } from './types';
import Checkpoint from './Checkpoint';

interface Props {
  section: SectionData;
  index: number;
  total: number;
  onImage: () => Promise<void>;
  onStory: () => void;
  onSpeak: () => void;
  speaking: boolean;
  onTune: (mode: 'simpler' | 'deeper') => void;
  onCheckpoint: (correct: boolean) => void;
  onContinue: () => void;
  isLast: boolean;
}

const DiveSection: React.FC<Props> = ({
  section, index, total, onImage, onStory, onSpeak, speaking, onTune,
  onCheckpoint, onContinue, isLast,
}) => {
  const [imgLoading, setImgLoading] = useState(false);
  const [askImage, setAskImage] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [resolved, setResolved] = useState(false);

  const runImage = async () => {
    setAskImage(false);
    setImgLoading(true);
    await onImage();
    setImgLoading(false);
  };

  const chip = 'fun-chip';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="fun-card overflow-hidden">
        {section.imageUrl && (
          <img
            src={section.imageUrl}
            alt={`Illustration for ${section.heading}`}
            loading="lazy"
            className="w-full aspect-[16/9] object-cover"
          />
        )}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">
            <span>Part {index + 1} of {total}</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-text-primary leading-tight">
            <span className="mr-2">{section.emoji}</span>{section.heading}
          </h2>

          <div className="mt-3 space-y-2.5">
            {section.body.map((line, i) => (
              <p key={i} className="text-lg sm:text-xl text-text-primary leading-relaxed">{line}</p>
            ))}
          </div>

          <AnimatePresence>
            {showStory && section.story && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-2xl bg-accent-brand/10 border border-accent-brand/30"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-accent-brand mb-1.5">📖 Story time</p>
                <p className="text-base text-text-primary leading-relaxed">{section.story}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap gap-2">
            {!section.imageUrl && (
              <button className={chip} onClick={() => setAskImage(true)} disabled={imgLoading}>
                {imgLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
                Show me a picture
              </button>
            )}
            {section.story && (
              <button className={chip} onClick={() => { setShowStory((s) => !s); onStory(); }}>
                <BookOpen className="h-3.5 w-3.5" /> {showStory ? 'Hide story' : 'Explain with a story'}
              </button>
            )}
            <button className={chip} onClick={onSpeak}>
              {speaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              {speaking ? 'Stop' : 'Read aloud'}
            </button>
            <button className={chip} onClick={() => onTune('simpler')}>
              <Baby className="h-3.5 w-3.5" /> Simpler
            </button>
            <button className={chip} onClick={() => onTune('deeper')}>
              <Rocket className="h-3.5 w-3.5" /> Go deeper
            </button>
          </div>

          <AnimatePresence>
            {askImage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-3 p-3.5 rounded-2xl bg-surface-tertiary border border-border flex items-center justify-between gap-3 flex-wrap"
              >
                <span className="text-sm text-text-secondary">Want me to draw this for you?</span>
                <div className="flex gap-2">
                  <button onClick={() => setAskImage(false)} className="px-3 py-2 rounded-xl text-sm font-semibold text-text-tertiary hover:text-text-primary">
                    Not now
                  </button>
                  <button onClick={runImage} className="px-5 py-2.5 rounded-full text-sm font-black bg-accent-brand text-text-inverse">
                    Yes, draw it!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {section.checkpoint?.prompt && (
        <Checkpoint
          data={section.checkpoint}
          onResolved={(correct) => { setResolved(true); onCheckpoint(correct); }}
        />
      )}

      <AnimatePresence>
        {(resolved || !section.checkpoint?.prompt) && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onContinue}
            className="fun-btn"
          >
            {isLast ? 'Finish the dive' : 'Continue'} <ArrowRight className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiveSection;
