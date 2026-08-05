import { useCallback, useEffect, useMemo, useState } from 'react';
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
  { id: 'goal_hit', name: 'Goal Getter', emoji: '🎯', hint: 'Hit your daily Sparks goal' },
  { id: 'quest_master', name: 'Quest Master', emoji: '🧰', hint: 'Finish all 3 daily quests' },
];

export const DAILY_GOAL = 60;
const MAX_FREEZES = 2;

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export type DailyCounts = {
  date: string;
  sparks: number;
  curios: number;
  correct: number;
  dives: number;
  claimed: string[];
};

const emptyDaily = (): DailyCounts => ({
  date: dayKey(), sparks: 0, curios: 0, correct: 0, dives: 0, claimed: [],
});

export type Quest = {
  id: string;
  emoji: string;
  label: string;
  target: number;
  progress: number;
  reward: number;
  done: boolean;
  claimed: boolean;
};

export function useCurioProgress(childId: string) {
  const k = (n: string) => `ww:${childId}:${n}`;

  const [sparks, setSparks] = useState(() => read(k('sparks'), 0));
  const [badges, setBadges] = useState<string[]>(() => read(k('badges'), []));
  const [history, setHistory] = useState<CurioRecord[]>(() => read(k('history'), []));
  const [trophies, setTrophies] = useState<Trophy[]>(() => read(k('trophies'), []));
  const [streak, setStreak] = useState(() => read(k('streak'), { days: 0, last: '' }));
  const [freezes, setFreezes] = useState<number>(() => read(k('freezes'), 0));
  const [activeDays, setActiveDays] = useState<string[]>(() => read(k('activeDays'), []));
  const [daily, setDaily] = useState<DailyCounts>(() => {
    const d = read<DailyCounts>(k('daily'), emptyDaily());
    return d.date === dayKey() ? d : emptyDaily();
  });
  const [badgePop, setBadgePop] = useState<typeof BADGES[number] | null>(null);
  const [goalJustHit, setGoalJustHit] = useState(false);

  useEffect(() => { localStorage.setItem(k('sparks'), JSON.stringify(sparks)); }, [sparks]);
  useEffect(() => { localStorage.setItem(k('badges'), JSON.stringify(badges)); }, [badges]);
  useEffect(() => { localStorage.setItem(k('history'), JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(k('trophies'), JSON.stringify(trophies)); }, [trophies]);
  useEffect(() => { localStorage.setItem(k('streak'), JSON.stringify(streak)); }, [streak]);
  useEffect(() => { localStorage.setItem(k('freezes'), JSON.stringify(freezes)); }, [freezes]);
  useEffect(() => { localStorage.setItem(k('activeDays'), JSON.stringify(activeDays)); }, [activeDays]);
  useEffect(() => { localStorage.setItem(k('daily'), JSON.stringify(daily)); }, [daily]);

  /* ---------- streak roll-over with streak freeze (Duolingo-style repair) ---------- */
  useEffect(() => {
    const t = dayKey();
    if (streak.last === t) return;
    setActiveDays((prev) => (prev.includes(t) ? prev : [...prev, t].slice(-60)));
    if (!streak.last) {
      setStreak({ days: 1, last: t });
      return;
    }
    const gap = daysBetween(streak.last, t);
    if (gap === 1) {
      setStreak({ days: streak.days + 1, last: t });
    } else if (gap > 1 && freezes > 0) {
      // Spend a freeze to repair the missed day(s) — streak survives.
      setFreezes((f) => f - 1);
      setStreak({ days: streak.days + 1, last: t });
    } else {
      setStreak({ days: 1, last: t });
    }
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
    setDaily((d) => {
      const base = d.date === dayKey() ? d : emptyDaily();
      const nextSparks = base.sparks + n;
      if (base.sparks < DAILY_GOAL && nextSparks >= DAILY_GOAL) {
        setGoalJustHit(true);
        setFreezes((f) => Math.min(MAX_FREEZES, f + 1));
        setTimeout(() => setGoalJustHit(false), 4000);
      }
      return { ...base, sparks: nextSparks };
    });
    if (celebrate) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, scalar: 0.9 });
    }
  }, []);

  /* ---------- daily quest tracking ---------- */
  const track = useCallback((event: 'curio' | 'correct' | 'dive') => {
    setDaily((d) => {
      const base = d.date === dayKey() ? d : emptyDaily();
      if (event === 'curio') return { ...base, curios: base.curios + 1 };
      if (event === 'correct') return { ...base, correct: base.correct + 1 };
      return { ...base, dives: base.dives + 1 };
    });
  }, []);

  const quests: Quest[] = useMemo(() => {
    const defs = [
      { id: 'q_curios', emoji: '💡', label: 'Ask 2 new questions', target: 2, progress: daily.curios, reward: 15 },
      { id: 'q_correct', emoji: '🎯', label: 'Nail 3 checkpoints', target: 3, progress: daily.correct, reward: 20 },
      { id: 'q_dive', emoji: '🤿', label: 'Finish a Deep Dive', target: 1, progress: daily.dives, reward: 25 },
    ];
    return defs.map((q) => ({
      ...q,
      progress: Math.min(q.progress, q.target),
      done: q.progress >= q.target,
      claimed: daily.claimed.includes(q.id),
    }));
  }, [daily]);

  const claimQuest = useCallback((id: string) => {
    const q = quests.find((x) => x.id === id);
    if (!q || !q.done || q.claimed) return;
    setDaily((d) => ({ ...d, claimed: [...d.claimed, id] }));
    addSparks(q.reward, true);
    if (quests.filter((x) => x.done).length === quests.length) unlock('quest_master');
  }, [quests, addSparks, unlock]);

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
    if (daily.sparks >= DAILY_GOAL) unlock('goal_hit');
  }, [streak.days, history.length, daily.sparks, unlock]);

  // Last 7 days for the streak calendar
  const week = useMemo(() => {
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 864e5);
      const key = dayKey(d);
      return { key, label: labels[d.getDay()], active: activeDays.includes(key) };
    });
  }, [activeDays]);

  return {
    sparks, addSparks,
    badges, unlock, badgePop,
    level, levelProgress, nextLevel: next,
    streak: streak.days,
    history, recordCurio, completeCurio,
    trophies, addTrophy,
    // Duolingo-style daily loop
    dailyGoal: DAILY_GOAL,
    todaySparks: daily.sparks,
    goalPct: Math.min(100, Math.round((daily.sparks / DAILY_GOAL) * 100)),
    goalMet: daily.sparks >= DAILY_GOAL,
    goalJustHit,
    freezes,
    week,
    quests, claimQuest, track,
  };
}
