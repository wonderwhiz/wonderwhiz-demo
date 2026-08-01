import { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CurioRecord, Trophy } from '@/components/curio-adventure/types';

const LEVELS = [
  { at: 0, name: 'Curious Cadet', emoji: '🌱' },
  { at: 100, name: 'Question Quester', emoji: '🔎' },
  { at: 300, name: 'Idea Explorer', emoji: '🧭' },
  { at: 600, name: 'Deep Diver', emoji: '🤿' },
  { at: 1000, name: 'Wonder Wizard', emoji: '🧙' },
];

export const BADGES: { id: string; name: string; emoji: string; hint: string }[] = [
  { id: 'first_spark', name: 'First Spark', emoji: '✨', hint: 'Ask your first question' },
  { id: 'deep_diver', name: 'Deep Diver', emoji: '🤿', hint: 'Finish a whole Deep Dive' },
  { id: 'quiz_whiz', name: 'Quiz Whiz', emoji: '🎯', hint: 'Get a checkpoint right' },
  { id: 'maker', name: 'Maker', emoji: '🎨', hint: 'Finish a Make Mode challenge' },
  { id: 'streak_3', name: 'On Fire', emoji: '🔥', hint: 'Explore 3 days in a row' },
  { id: 'five_curios', name: 'Collector', emoji: '📚', hint: 'Open 5 Curios' },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useCurioProgress(childId: string) {
  const k = (n: string) => `ww:${childId}:${n}`;

  const [sparks, setSparks] = useState(() => read(k('sparks'), 0));
  const [badges, setBadges] = useState<string[]>(() => read(k('badges'), []));
  const [history, setHistory] = useState<CurioRecord[]>(() => read(k('history'), []));
  const [trophies, setTrophies] = useState<Trophy[]>(() => read(k('trophies'), []));
  const [streak, setStreak] = useState(() => read(k('streak'), { days: 0, last: '' }));
  const [badgePop, setBadgePop] = useState<typeof BADGES[number] | null>(null);

  useEffect(() => { localStorage.setItem(k('sparks'), JSON.stringify(sparks)); }, [sparks]);
  useEffect(() => { localStorage.setItem(k('badges'), JSON.stringify(badges)); }, [badges]);
  useEffect(() => { localStorage.setItem(k('history'), JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(k('trophies'), JSON.stringify(trophies)); }, [trophies]);
  useEffect(() => { localStorage.setItem(k('streak'), JSON.stringify(streak)); }, [streak]);

  // Daily streak roll-over
  useEffect(() => {
    const t = todayKey();
    if (streak.last === t) return;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    setStreak({ days: streak.last === yesterday ? streak.days + 1 : 1, last: t });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const level = LEVELS.slice().reverse().find((l) => sparks >= l.at) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.at > sparks);
  const levelProgress = next ? Math.round(((sparks - level.at) / (next.at - level.at)) * 100) : 100;

  const unlock = useCallback((id: string) => {
    setBadges((prev) => {
      if (prev.includes(id)) return prev;
      const badge = BADGES.find((b) => b.id === id);
      if (badge) {
        setBadgePop(badge);
        setTimeout(() => setBadgePop(null), 3200);
      }
      return [...prev, id];
    });
  }, []);

  const addSparks = useCallback((n: number, celebrate = false) => {
    setSparks((s) => s + n);
    if (celebrate) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, scalar: 0.9 });
    }
  }, []);

  const recordCurio = useCallback((rec: CurioRecord) => {
    setHistory((h) => [rec, ...h.filter((x) => x.id !== rec.id)].slice(0, 30));
  }, []);

  const completeCurio = useCallback((id: string) => {
    setHistory((h) => h.map((x) => (x.id === id ? { ...x, completed: true } : x)));
  }, []);

  const addTrophy = useCallback((t: Trophy) => {
    setTrophies((prev) => [t, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (streak.days >= 3) unlock('streak_3');
    if (history.length >= 5) unlock('five_curios');
  }, [streak.days, history.length, unlock]);

  return {
    sparks, addSparks,
    badges, unlock, badgePop,
    level, levelProgress, nextLevel: next,
    streak: streak.days,
    history, recordCurio, completeCurio,
    trophies, addTrophy,
  };
}
