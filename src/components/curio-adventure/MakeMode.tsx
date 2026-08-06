import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, Loader2, Trophy as TrophyIcon } from 'lucide-react';
import { MakeBrief } from './types';

interface Props {
  brief: MakeBrief | null;
  loading: boolean;
  done: boolean;
  onComplete: (photo?: string) => void;
}

const MakeMode: React.FC<Props> = ({ brief, loading, done, onComplete }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | undefined>();

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  if (loading || !brief) {
    return (
      <div className="fun-card p-6 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-accent-brand" />
        <span className="text-text-secondary font-semibold">Cooking up your challenge…</span>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fun-card border-accent-warning p-5 sm:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-accent-warning">🛠️ Make Mode</p>
      <h2 className="mt-2 text-2xl sm:text-3xl font-black text-text-primary leading-tight">
        <span className="mr-2">{brief.emoji}</span>{brief.title}
      </h2>
      <p className="mt-2 text-lg text-text-primary leading-relaxed">{brief.brief}</p>

      <ol className="mt-4 space-y-2.5">
        {brief.steps.map((s, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="h-7 w-7 shrink-0 rounded-full bg-accent-brand/20 text-accent-brand font-black text-sm flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-base text-text-primary leading-relaxed pt-0.5">{s}</span>
          </li>
        ))}
      </ol>

      {brief.materials.length > 0 && (
        <p className="mt-4 text-sm text-text-tertiary">
          <span className="font-bold">You'll need:</span> {brief.materials.join(' · ')}
        </p>
      )}

      {photo && (
        <img src={photo} alt="Your creation" className="mt-4 w-full rounded-2xl object-cover max-h-64" />
      )}

      {!done ? (
        <div className="mt-5 flex flex-wrap gap-2.5">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          <button
            onClick={() => fileRef.current?.click()}
            className="fun-chip"
          >
            <Camera className="h-4 w-4" /> {photo ? 'Change photo' : 'Add a photo'}
          </button>
          <button
            onClick={() => onComplete(photo)}
            className="fun-btn-mint flex-1 min-w-[180px]"
          >
            <Check className="h-5 w-5" /> I made it!
          </button>
        </div>
      ) : (
        <div className="mt-5 p-4 rounded-2xl bg-accent-success/15 border border-accent-success/40 flex items-center gap-3">
          <TrophyIcon className="h-6 w-6 text-accent-success" />
          <span className="font-bold text-text-primary">Saved to your Trophy Shelf!</span>
        </div>
      )}
    </motion.section>
  );
};

export default React.memo(MakeMode);
