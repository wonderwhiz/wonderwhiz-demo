import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUp, Send, Sparkles, BookOpen, Compass, Check, X,
  Loader2, Mic, MicOff, Flame, Zap, Trophy, MapPin, Shuffle,
  Bookmark, BookmarkCheck, Volume2, VolumeX, Award, Heart,
  Baby, Rocket, Star, Command,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { parsePartialJSON } from '@/lib/partialJson';

type Vocab = { word: string; meaning: string };
type Quiz = { question: string; options: string[]; correct_index: number; explanation: string };
type WonderCard = {
  title?: string;
  hook?: string;
  paragraphs?: string[];
  wow_facts?: string[];
  vocab?: Vocab[];
  rabbit_holes?: string[];
  quiz?: Partial<Quiz>;
};
type Turn = { question: string; card: WonderCard; streaming: boolean };
type JournalEntry = { id: string; savedAt: number; question: string; card: WonderCard };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface Props {
  childProfile: { id: string; name: string; age: number | null };
  onBack: () => void;
}

const AGE_PROMPTS: Record<string, { emoji: string; q: string }[]> = {
  young: [
    { emoji: '🌈', q: 'Where do rainbows come from?' },
    { emoji: '🐝', q: 'How do bees make honey?' },
    { emoji: '🌙', q: 'Why do we need to sleep?' },
    { emoji: '🦖', q: 'What made the dinosaurs so BIG?' },
    { emoji: '🌊', q: 'Why is the ocean salty?' },
    { emoji: '🚀', q: 'How do rockets fly?' },
  ],
  mid: [
    { emoji: '🕳️', q: 'How do black holes work?' },
    { emoji: '🧠', q: 'Why do we get goosebumps?' },
    { emoji: '🌐', q: 'How does the internet actually travel?' },
    { emoji: '🧅', q: 'Why do onions make us cry?' },
    { emoji: '⚡', q: 'What is lightning really?' },
    { emoji: '🐙', q: 'Are octopuses aliens?' },
  ],
  teen: [
    { emoji: '🧬', q: 'How does CRISPR edit DNA?' },
    { emoji: '👁️', q: 'What causes déjà vu?' },
    { emoji: '🤖', q: 'How do neural networks actually learn?' },
    { emoji: '⏳', q: 'Why is time slower near gravity?' },
    { emoji: '🎼', q: 'Why does music give you chills?' },
    { emoji: '🌌', q: 'What existed before the Big Bang?' },
  ],
};

const SURPRISE_POOL = [
  'Why do cats purr?', 'How do volcanoes erupt?', 'What is a black hole made of?',
  'Why does the moon change shape?', 'How do fish breathe underwater?',
  'Why do we dream?', 'How does WiFi actually work?', 'Why is blood red?',
  'How do birds know where to fly?', 'What is inside an atom?', 'Why do stars twinkle?',
  'How does a caterpillar turn into a butterfly?', 'Why do we yawn?',
  'How does the sun make energy?', 'Why do we get hiccups?', 'How do magnets work?',
];

const LEVELS = [
  { at: 0, name: 'Curious Cadet', emoji: '🌱' },
  { at: 10, name: 'Wonder Explorer', emoji: '🔭' },
  { at: 25, name: 'Idea Hunter', emoji: '🎯' },
  { at: 50, name: 'Genius in Training', emoji: '⚡' },
  { at: 100, name: 'Wonder Wizard', emoji: '🧙' },
  { at: 200, name: 'Mind Master', emoji: '👑' },
  { at: 400, name: 'Cosmic Sage', emoji: '🌌' },
];

type Achievement = { id: string; name: string; emoji: string; hint: string };
const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_spark', name: 'First Spark', emoji: '✨', hint: 'Ask your very first question' },
  { id: 'curious_five', name: 'Curious Five', emoji: '🖐️', hint: 'Ask 5 questions' },
  { id: 'quiz_whiz', name: 'Quiz Whiz', emoji: '🧠', hint: 'Ace a quiz on the first try' },
  { id: 'rabbit_diver', name: 'Rabbit Diver', emoji: '🐇', hint: 'Follow 3 rabbit holes in one session' },
  { id: 'streak_3', name: '3-Day Streak', emoji: '🔥', hint: 'Come back 3 days in a row' },
  { id: 'collector', name: 'Wonder Collector', emoji: '📚', hint: 'Save 5 cards to your Journal' },
  { id: 'wordsmith', name: 'Wordsmith', emoji: '📖', hint: 'Learn 10 new vocab words' },
  { id: 'century', name: 'Century Club', emoji: '💯', hint: 'Reach 100 Sparks' },
];

const levelFor = (sparks: number) =>
  [...LEVELS].reverse().find((l) => sparks >= l.at) ?? LEVELS[0];
const nextLevel = (sparks: number) => LEVELS.find((l) => sparks < l.at);

const fireConfetti = (opts?: Partial<confetti.Options>) => {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#a78bfa', '#6366f1', '#22d3ee', '#34d399', '#f472b6'],
    ...opts,
  });
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const WonderCanvas: React.FC<Props> = ({ childProfile, onBack }) => {
  const age = childProfile.age ?? 10;
  const band = age <= 7 ? 'young' : age <= 11 ? 'mid' : 'teen';
  const isYoung = band === 'young';
  const storageKey = `wonder:v2:${childProfile.id}`;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [quizPicks, setQuizPicks] = useState<Record<number, number>>({});
  const [sparks, setSparks] = useState(0);
  const [sparkPop, setSparkPop] = useState(0);
  const [lastGain, setLastGain] = useState<number>(0);
  const [listening, setListening] = useState(false);
  const [rotatingPrompt, setRotatingPrompt] = useState(0);
  const [streak, setStreak] = useState(0);
  const [askedTotal, setAskedTotal] = useState(0);
  const [rabbitHits, setRabbitHits] = useState(0);
  const [vocabLearned, setVocabLearned] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [savedTurns, setSavedTurns] = useState<Record<number, string>>({});
  const [factReacts, setFactReacts] = useState<Record<string, string>>({});
  const [journalOpen, setJournalOpen] = useState(false);
  const [awardPopup, setAwardPopup] = useState<Achievement | null>(null);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [quizCombo, setQuizCombo] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Restore persistent state + tick streak
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const s = raw ? JSON.parse(raw) : {};
      if (typeof s.sparks === 'number') setSparks(s.sparks);
      if (Array.isArray(s.unlocked)) setUnlocked(s.unlocked);
      if (Array.isArray(s.journal)) setJournal(s.journal);
      if (typeof s.askedTotal === 'number') setAskedTotal(s.askedTotal);
      if (typeof s.vocabLearned === 'number') setVocabLearned(s.vocabLearned);
      if (s.factReacts) setFactReacts(s.factReacts);

      // Streak logic
      const today = todayKey();
      let newStreak = s.streak || 0;
      if (s.lastVisit !== today) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        const yesterday = y.toISOString().slice(0, 10);
        newStreak = s.lastVisit === yesterday ? newStreak + 1 : 1;
        s.streak = newStreak;
        s.lastVisit = today;
        localStorage.setItem(storageKey, JSON.stringify(s));
        if (newStreak > 1) toast.success(`🔥 ${newStreak}-day streak! Welcome back.`);
      }
      setStreak(newStreak);
    } catch {}
    setTimeout(() => inputRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const s = raw ? JSON.parse(raw) : {};
      localStorage.setItem(storageKey, JSON.stringify({
        ...s, sparks, unlocked, journal, askedTotal, vocabLearned, factReacts, streak,
        lastVisit: todayKey(),
      }));
    } catch {}
  }, [sparks, unlocked, journal, askedTotal, vocabLearned, factReacts, streak, storageKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  useEffect(() => {
    if (turns.length) return;
    const id = setInterval(() => setRotatingPrompt((n) => n + 1), 3000);
    return () => clearInterval(id);
  }, [turns.length]);

  // Scroll-aware back-to-top
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowTopBtn(el.scrollTop > 500);
    // fallback: window scroll for mobile
    const onWin = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener('scroll', onWin, { passive: true });
    return () => window.removeEventListener('scroll', onWin);
  }, []);

  // Keyboard shortcuts: / focus, s surprise, j journal, Esc close, ? help
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === 'Escape') {
        if (journalOpen) setJournalOpen(false);
        else if (showKeys) setShowKeys(false);
        else if (typing) (target as HTMLInputElement).blur();
        return;
      }
      if (typing) return;
      if (e.key === '/') { e.preventDefault(); inputRef.current?.focus(); }
      else if (e.key.toLowerCase() === 's') { e.preventDefault(); surpriseMe(); }
      else if (e.key.toLowerCase() === 'j') { e.preventDefault(); setJournalOpen((o) => !o); }
      else if (e.key === '?') { e.preventDefault(); setShowKeys((s) => !s); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journalOpen, showKeys]);

  // Daily challenge — deterministic per day so it feels featured
  const dailyChallenge = useMemo(() => {
    const seed = todayKey().split('-').reduce((a, s) => a + parseInt(s, 10), 0);
    return SURPRISE_POOL[seed % SURPRISE_POOL.length];
  }, []);

  const unlock = (id: string) => {
    setUnlocked((u) => {
      if (u.includes(id)) return u;
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (a) {
        setAwardPopup(a);
        fireConfetti({ particleCount: 100, spread: 90 });
        setTimeout(() => setAwardPopup(null), 3500);
      }
      return [...u, id];
    });
  };

  const addSparks = (n: number, opts?: { celebrate?: boolean }) => {
    setSparks((s) => {
      const next = s + n;
      if (s < 100 && next >= 100) setTimeout(() => unlock('century'), 300);
      return next;
    });
    setLastGain(n);
    setSparkPop((p) => p + 1);
    if (opts?.celebrate) fireConfetti();
  };

  const level = levelFor(sparks);
  const upcoming = nextLevel(sparks);
  const progressPct = upcoming
    ? Math.min(100, Math.round(((sparks - level.at) / (upcoming.at - level.at)) * 100))
    : 100;

  const journey = turns.map((t) => t.card.title || t.question).filter(Boolean);

  const ask = async (q: string, opts?: { fromRabbit?: boolean }) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setInput('');
    const parentTopic = turns.length ? turns[turns.length - 1].card.title : undefined;

    const turnIndex = turns.length;
    setTurns((t) => [...t, { question: q, card: {}, streaming: true }]);
    addSparks(2);
    setAskedTotal((n) => {
      const next = n + 1;
      if (next === 1) unlock('first_spark');
      if (next >= 5) unlock('curious_five');
      return next;
    });
    if (opts?.fromRabbit) {
      setRabbitHits((r) => {
        const nr = r + 1;
        if (nr >= 3) unlock('rabbit_diver');
        return nr;
      });
    }
    if (streak >= 3) unlock('streak_3');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/wonder-explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: q, childAge: age, childName: childProfile.name, parentTopic }),
      });

      if (!res.ok || !res.body) {
        let msg = 'Wonder is thinking too hard. Try again.';
        try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = '';
      let lastApplied: WonderCard | null = null;
      let rewardedFacts = false;
      let vocabCounted = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const partial = parsePartialJSON<WonderCard>(raw);
        if (partial && partial !== lastApplied) {
          lastApplied = partial;
          setTurns((t) => {
            const copy = t.slice();
            if (copy[turnIndex]) copy[turnIndex] = { ...copy[turnIndex], card: partial };
            return copy;
          });
          if (!rewardedFacts && (partial.wow_facts?.length ?? 0) >= 1) {
            rewardedFacts = true;
            addSparks(3);
          }
          const vlen = partial.vocab?.length ?? 0;
          if (vlen > vocabCounted) {
            const delta = vlen - vocabCounted;
            vocabCounted = vlen;
            setVocabLearned((v) => {
              const nv = v + delta;
              if (nv >= 10) unlock('wordsmith');
              return nv;
            });
          }
        }
      }

      const finalCard = parsePartialJSON<WonderCard>(raw);
      setTurns((t) => {
        const copy = t.slice();
        if (copy[turnIndex]) copy[turnIndex] = { ...copy[turnIndex], card: finalCard || copy[turnIndex].card, streaming: false };
        return copy;
      });
      addSparks(5, { celebrate: true });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Wonder is thinking too hard. Try again.');
      setTurns((t) => t.filter((_, i) => i !== turnIndex));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onQuizPick = (turnIdx: number, choice: number, correct: number) => {
    setQuizPicks((p) => ({ ...p, [turnIdx]: choice }));
    if (choice === correct) {
      const newCombo = quizCombo + 1;
      const bonus = newCombo >= 2 ? newCombo * 2 : 0; // combo x2 bonus starting at streak 2
      const total = 10 + bonus;
      setQuizCombo(newCombo);
      addSparks(total, { celebrate: true });
      if (bonus > 0) {
        toast.success(`+${total} Sparks — ${newCombo}× combo! 🔥`, { icon: '⚡' });
      } else {
        toast.success('+10 Sparks — correct!', { icon: '⚡' });
      }
      unlock('quiz_whiz');
    } else {
      setQuizCombo(0);
      addSparks(2);
      toast('+2 Sparks — nice try!', { icon: '💡' });
    }
  };

  const toggleSaveTurn = (idx: number) => {
    const turn = turns[idx];
    if (!turn) return;
    if (savedTurns[idx]) {
      const id = savedTurns[idx];
      setJournal((j) => j.filter((e) => e.id !== id));
      setSavedTurns((s) => { const c = { ...s }; delete c[idx]; return c; });
      toast('Removed from Journal', { icon: '🗑️' });
    } else {
      const id = `${childProfile.id}-${Date.now()}-${idx}`;
      const entry: JournalEntry = { id, savedAt: Date.now(), question: turn.question, card: turn.card };
      setJournal((j) => {
        const nj = [entry, ...j].slice(0, 50);
        if (nj.length >= 5) unlock('collector');
        return nj;
      });
      setSavedTurns((s) => ({ ...s, [idx]: id }));
      addSparks(3);
      toast.success('Saved to Journal ✚ +3 Sparks', { icon: '📚' });
    }
  };

  const speakCard = (idx: number, card: WonderCard) => {
    if (!('speechSynthesis' in window)) {
      toast.error("Read-aloud isn't supported here.");
      return;
    }
    if (speakingId === idx) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const text = [
      card.hook,
      ...(card.paragraphs ?? []),
      ...(card.wow_facts ?? []).map((f) => `Whoa fact: ${f}`),
    ].filter(Boolean).join(' ');
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = isYoung ? 0.95 : 1.02;
    u.pitch = isYoung ? 1.15 : 1;
    u.onend = () => setSpeakingId((cur) => (cur === idx ? null : cur));
    u.onerror = () => setSpeakingId(null);
    setSpeakingId(idx);
    window.speechSynthesis.speak(u);
  };

  const toggleReact = (turnIdx: number, factIdx: number, emoji: string) => {
    const key = `${turnIdx}:${factIdx}`;
    setFactReacts((r) => {
      const cur = r[key];
      const nr = { ...r };
      if (cur === emoji) delete nr[key];
      else nr[key] = emoji;
      return nr;
    });
    if (factReacts[key] !== emoji) addSparks(1);
  };

  const surpriseMe = () => {
    const pick = SURPRISE_POOL[Math.floor(Math.random() * SURPRISE_POOL.length)];
    ask(pick);
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice isn't supported in this browser. Try Chrome!");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const empty = turns.length === 0 && !loading;
  const prompts = AGE_PROMPTS[band];
  const heroPrompt = prompts[rotatingPrompt % prompts.length];
  const unlockedCount = unlocked.length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,hsl(var(--accent-brand)/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(var(--accent-info)/0.14),transparent_50%),hsl(var(--background))]">
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent-brand/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-accent-info/15 blur-3xl" />

      {/* Top bar — game HUD */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 shrink-0 px-2">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Home</span>
          </Button>

          <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-card/70 border border-border/50">
              <span className="text-base leading-none">{level.emoji}</span>
              <div className="min-w-0">
                <div className="text-[11px] leading-tight font-semibold text-text-primary truncate max-w-[90px] sm:max-w-none">{level.name}</div>
                {upcoming && (
                  <div className="w-16 sm:w-28 h-1 rounded-full bg-white/10 mt-0.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-brand to-accent-info transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {streak > 0 && (
              <div
                title={`${streak}-day streak`}
                className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-300 text-xs font-bold"
              >
                <Flame className="h-3.5 w-3.5 fill-orange-400" />{streak}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setJournalOpen(true)}
              title="Wonder Journal"
              className="relative h-8 w-8 rounded-full bg-card/70 border border-border/50 flex items-center justify-center hover:border-accent-brand/60 transition"
            >
              <BookOpen className="h-4 w-4 text-text-secondary" />
              {journal.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-accent-brand text-white rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {journal.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setJournalOpen(true)}
              title={`Achievements ${unlockedCount}/${ACHIEVEMENTS.length}`}
              className="relative h-8 w-8 rounded-full bg-card/70 border border-border/50 flex items-center justify-center hover:border-accent-brand/60 transition"
            >
              <Award className="h-4 w-4 text-text-secondary" />
              {unlockedCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-emerald-500 text-white rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {unlockedCount}
                </span>
              )}
            </button>

            <div className="relative">
              <motion.div
                key={sparkPop}
                initial={{ scale: 1 }}
                animate={{ scale: sparkPop ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-accent-brand/20 to-accent-info/20 border border-accent-brand/40"
              >
                <Zap className="h-4 w-4 text-accent-brand fill-accent-brand/50" />
                <span className="font-bold text-text-primary tabular-nums text-sm">{sparks}</span>
              </motion.div>
              <AnimatePresence>
                {sparkPop > 0 && lastGain > 0 && (
                  <motion.div
                    key={sparkPop + '-float'}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -22 }}
                    transition={{ duration: 1.1 }}
                    className="absolute -top-1 right-1 text-xs font-bold text-accent-brand pointer-events-none"
                  >
                    +{lastGain}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {journey.length > 0 && (
          <div className="max-w-3xl mx-auto px-3 sm:px-6 pb-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <MapPin className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
              {journey.map((t, i) => (
                <React.Fragment key={i}>
                  <button
                    onClick={() => document.getElementById(`turn-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="text-[11px] font-medium text-text-secondary hover:text-accent-brand whitespace-nowrap px-2 py-0.5 rounded-full bg-card/50 border border-border/40 hover:border-accent-brand/50 transition"
                  >
                    {String(t).slice(0, 32)}
                  </button>
                  {i < journey.length - 1 && <ArrowRight className="h-3 w-3 text-text-tertiary shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="max-w-3xl mx-auto px-4 sm:px-6 pb-40 pt-4 min-h-[calc(100vh-4rem)] relative z-10">
        {empty && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-8 sm:pt-12"
          >
            <motion.div
              animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-brand via-accent-info to-emerald-400 shadow-[0_10px_60px_-10px_hsl(var(--accent-brand)/0.6)] mb-6"
            >
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary mb-3 leading-tight">
              {isYoung
                ? <>Hi {childProfile.name}! <br className="sm:hidden" /><span className="bg-gradient-to-r from-accent-brand to-accent-info bg-clip-text text-transparent">What are you wondering?</span></>
                : <>Hey {childProfile.name}, <br className="sm:hidden" /><span className="bg-gradient-to-r from-accent-brand to-accent-info bg-clip-text text-transparent">what should we crack open today?</span></>}
            </h1>
            <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
              Ask <em>anything</em>. Earn Sparks ⚡, unlock badges, and follow rabbit holes wherever curiosity pulls you.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                onClick={surpriseMe}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-brand to-accent-info text-white font-semibold shadow-lg shadow-accent-brand/30 hover:shadow-xl hover:shadow-accent-brand/40 transition"
              >
                <Shuffle className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                Surprise me!
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left">
              {prompts.map((p, i) => (
                <motion.button
                  key={p.q}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => ask(p.q)}
                  className="group p-3 sm:p-4 rounded-2xl bg-card/60 backdrop-blur hover:bg-card border border-border/50 hover:border-accent-brand/60 transition-all text-text-primary hover:shadow-lg hover:shadow-accent-brand/10"
                >
                  <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform inline-block">{p.emoji}</div>
                  <div className="text-sm font-semibold leading-snug">{p.q}</div>
                </motion.button>
              ))}
            </div>

            {/* Achievement shelf preview */}
            <div className="mt-8 p-4 rounded-2xl bg-card/50 border border-border/40 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent-brand" /> Badges
                  <span className="text-text-tertiary font-normal text-xs">{unlockedCount}/{ACHIEVEMENTS.length}</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                    <Flame className="h-3.5 w-3.5 fill-orange-400" /> {streak}-day streak
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {ACHIEVEMENTS.map((a) => {
                  const got = unlocked.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      title={got ? a.name : a.hint}
                      className={`shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition ${
                        got
                          ? 'bg-accent-brand/15 border-accent-brand/50'
                          : 'bg-white/[0.02] border-border/40 grayscale opacity-40'
                      }`}
                    >
                      <span className="text-xl leading-none">{a.emoji}</span>
                      <span className="text-[8px] mt-0.5 text-text-tertiary uppercase tracking-wider text-center px-1 leading-tight">{got ? '✓' : '?'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-10">
          {turns.map((turn, idx) => (
            <TurnBlock
              key={idx}
              turn={turn}
              idx={idx}
              picked={quizPicks[idx]}
              onPick={(i, correct) => onQuizPick(idx, i, correct)}
              onAsk={(q) => ask(q, { fromRabbit: true })}
              saved={!!savedTurns[idx]}
              onToggleSave={() => toggleSaveTurn(idx)}
              speaking={speakingId === idx}
              onToggleSpeak={() => speakCard(idx, turn.card)}
              reacts={factReacts}
              onReact={(fi, emoji) => toggleReact(idx, fi, emoji)}
              onTune={(mode) => {
                const topic = turn.card.title || turn.question;
                const q = mode === 'simpler'
                  ? `Explain this in even simpler words a younger kid can get: ${topic}`
                  : `Go deeper and more advanced on: ${topic}`;
                ask(q);
              }}
              combo={quizPicks[idx] !== undefined && quizPicks[idx] === turn.card.quiz?.correct_index ? quizCombo : 0}
            />
          ))}
          {loading && turns[turns.length - 1]?.card && !turns[turns.length - 1]?.card?.hook && (
            <div className="rounded-3xl bg-card/70 border border-border/50 shadow-lg overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-border/40 space-y-3">
                <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-11/12 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="px-6 pb-5 flex items-center gap-2 text-text-tertiary text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-accent-brand" />
                Wonder is cooking up something magical…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-4 sm:pb-5">
        <div className="max-w-3xl mx-auto px-3 sm:px-6">
          <form
            onSubmit={(e) => { e.preventDefault(); ask(input); }}
            className="flex items-center gap-2 bg-card/95 backdrop-blur border border-border/60 rounded-2xl p-1.5 shadow-[0_10px_40px_-10px_hsl(var(--accent-brand)/0.3)] focus-within:border-accent-brand/70 focus-within:shadow-accent-brand/20 transition"
          >
            <button
              type="button"
              onClick={toggleMic}
              disabled={loading}
              aria-label={listening ? 'Stop voice' : 'Speak your question'}
              className={`h-10 w-10 rounded-xl flex items-center justify-center transition shrink-0 ${
                listening
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'text-text-tertiary hover:text-accent-brand hover:bg-accent-brand/10'
              }`}
            >
              {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={heroPrompt ? `Try: "${heroPrompt.q}"` : (isYoung ? 'Ask me anything…' : 'What are you curious about?')}
              className="flex-1 min-w-0 bg-transparent px-2 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none text-base"
              disabled={loading}
            />
            <button
              type="button"
              onClick={surpriseMe}
              disabled={loading}
              title="Surprise me"
              className="h-10 w-10 rounded-xl flex items-center justify-center text-text-tertiary hover:text-accent-brand hover:bg-accent-brand/10 transition shrink-0"
            >
              <Shuffle className="h-5 w-5" />
            </button>
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-accent-brand to-accent-info text-white h-10 px-3 sm:px-4 gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /><span className="hidden sm:inline text-sm font-semibold">Ask</span></>}
            </Button>
          </form>
        </div>
      </div>

      {/* Achievement pop */}
      <AnimatePresence>
        {awardPopup && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed left-1/2 -translate-x-1/2 top-20 z-50 pointer-events-none"
          >
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-accent-brand to-accent-info shadow-2xl shadow-accent-brand/40 flex items-center gap-3">
              <span className="text-3xl">{awardPopup.emoji}</span>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">Badge unlocked</div>
                <div className="text-white font-bold">{awardPopup.name}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal / Badges drawer */}
      <AnimatePresence>
        {journalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setJournalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 bg-card border-l border-border/60 shadow-2xl flex flex-col"
            >
              <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent-brand font-bold">Your collection</div>
                  <h2 className="text-xl font-bold text-text-primary">Wonder Journal</h2>
                </div>
                <button onClick={() => setJournalOpen(false)} className="h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center text-text-secondary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 border-b border-border/40">
                <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-accent-brand" /> Badges</span>
                  <span className="text-text-tertiary">{unlockedCount}/{ACHIEVEMENTS.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {ACHIEVEMENTS.map((a) => {
                    const got = unlocked.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1.5 border text-center ${
                          got ? 'bg-accent-brand/15 border-accent-brand/50' : 'bg-white/[0.02] border-border/40 opacity-50'
                        }`}
                        title={a.hint}
                      >
                        <span className={`text-2xl leading-none ${got ? '' : 'grayscale'}`}>{a.emoji}</span>
                        <span className="text-[9px] mt-1 font-bold text-text-primary leading-tight">{a.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5 text-accent-brand" /> Saved cards
                </div>
                {journal.length === 0 ? (
                  <div className="text-center py-10 text-text-tertiary text-sm">
                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    Tap the bookmark on any Wonder Card to save it here.
                  </div>
                ) : (
                  journal.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => { setJournalOpen(false); setTimeout(() => ask(e.question), 200); }}
                      className="w-full text-left p-3 rounded-2xl bg-surface-secondary/50 border border-border/40 hover:border-accent-brand/60 transition group"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-accent-brand font-bold mb-1">{e.card.title || 'Wonder Card'}</div>
                      <div className="text-sm font-semibold text-text-primary line-clamp-2">{e.card.hook || e.question}</div>
                      <div className="mt-2 text-[11px] text-text-tertiary flex items-center justify-between">
                        <span>{new Date(e.savedAt).toLocaleDateString()}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition text-accent-brand font-semibold">Ask again →</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TurnBlock: React.FC<{
  turn: Turn;
  idx: number;
  picked?: number;
  onPick: (i: number, correct: number) => void;
  onAsk: (q: string) => void;
  saved: boolean;
  onToggleSave: () => void;
  speaking: boolean;
  onToggleSpeak: () => void;
  reacts: Record<string, string>;
  onReact: (factIdx: number, emoji: string) => void;
  onTune: (mode: 'simpler' | 'deeper') => void;
  combo: number;
}> = ({ turn, idx, picked, onPick, onAsk, saved, onToggleSave, speaking, onToggleSpeak, reacts, onReact, onTune, combo }) => {
  const { question, card, streaming } = turn;
  const paragraphs = card.paragraphs ?? [];
  const wowFacts = card.wow_facts ?? [];
  const vocab = card.vocab ?? [];
  const rabbitHoles = card.rabbit_holes ?? [];
  const quiz = card.quiz;
  const quizReady = !!(quiz?.question && quiz.options && quiz.options.length > 1 && typeof quiz.correct_index === 'number');
  const showCaretOnLast = streaming && paragraphs.length > 0;
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});


  if (streaming && !card.title && !card.hook) return (
    <motion.div id={`turn-${idx}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
      <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-accent-brand/15 border border-accent-brand/25 text-text-primary font-medium">
        {question}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      id={`turn-${idx}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4 scroll-mt-32"
    >
      <div className="flex justify-end">
        <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-accent-brand/15 border border-accent-brand/25 text-text-primary font-medium">
          {question}
        </div>
      </div>

      <article className="rounded-3xl bg-card/90 backdrop-blur border border-border/50 shadow-[0_20px_60px_-20px_hsl(var(--accent-brand)/0.35)] overflow-hidden">
        <header className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/40 bg-gradient-to-br from-accent-brand/10 via-transparent to-accent-info/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-accent-brand font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                {card.title || 'Wonder Card'}
                {streaming && <span className="inline-block w-1.5 h-3 bg-accent-brand/70 animate-pulse rounded-sm" />}
              </div>
              {card.hook && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg sm:text-2xl text-text-primary font-semibold leading-snug"
                >
                  {card.hook}
                </motion.p>
              )}
            </div>
            {!streaming && (card.hook || paragraphs.length > 0) && (
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={onToggleSpeak}
                  title={speaking ? 'Stop reading' : 'Read to me'}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center border transition ${
                    speaking
                      ? 'bg-accent-brand/20 border-accent-brand/60 text-accent-brand'
                      : 'bg-card/60 border-border/50 text-text-secondary hover:border-accent-brand/60 hover:text-accent-brand'
                  }`}
                >
                  {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={onToggleSave}
                  title={saved ? 'Remove from Journal' : 'Save to Journal'}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center border transition ${
                    saved
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                      : 'bg-card/60 border-border/50 text-text-secondary hover:border-accent-brand/60 hover:text-accent-brand'
                  }`}
                >
                  {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </header>

        {paragraphs.length > 0 && (
          <div className="px-5 sm:px-6 py-5 space-y-4 text-text-primary leading-relaxed text-[17px]">
            {paragraphs.map((p, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                {p}
                {showCaretOnLast && i === paragraphs.length - 1 && (
                  <span className="inline-block w-1.5 h-4 align-middle ml-0.5 bg-accent-brand/70 animate-pulse rounded-sm" />
                )}
              </motion.p>
            ))}
          </div>
        )}

        {wowFacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 sm:px-6 py-5 bg-gradient-to-br from-accent-info/10 to-transparent border-t border-border/40"
          >
            <div className="text-sm font-bold text-accent-info mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="text-lg">🤯</span> Whoa, really?
            </div>
            <ul className="space-y-2.5">
              {wowFacts.map((f, i) => {
                const rk = `${idx}:${i}`;
                const chosen = reacts[rk];
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition"
                  >
                    <div className="flex gap-3 text-text-primary items-start">
                      <span className="text-accent-info text-lg leading-none mt-0.5">✦</span>
                      <span className="flex-1">{f}</span>
                    </div>
                    <div className="mt-2 pl-6 flex items-center gap-1.5">
                      {['🤯', '❤️', '😂', '🤔'].map((e) => (
                        <button
                          key={e}
                          onClick={() => onReact(i, e)}
                          className={`text-sm h-7 min-w-7 px-1.5 rounded-full border transition ${
                            chosen === e
                              ? 'bg-accent-brand/20 border-accent-brand/60 scale-110'
                              : 'bg-white/[0.03] border-border/40 hover:border-accent-brand/40 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}

        {vocab.length > 0 && (
          <div className="px-5 sm:px-6 py-5 border-t border-border/40">
            <div className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><span className="text-lg">📖</span> Words worth knowing</span>
              <span className="text-[10px] font-normal text-text-tertiary normal-case tracking-normal">Tap to reveal</span>
            </div>
            <dl className="grid sm:grid-cols-2 gap-2.5">
              {vocab.map((v, i) => {
                const isOpen = !!flipped[i];
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
                    className={`text-left p-3 rounded-xl border transition group ${
                      isOpen
                        ? 'bg-accent-brand/10 border-accent-brand/50'
                        : 'bg-surface-secondary/50 border-border/30 hover:border-accent-brand/40'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <dt className="font-bold text-text-primary flex items-center justify-between gap-2">
                      <span>{v.word}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border transition ${
                        isOpen ? 'border-accent-brand/50 text-accent-brand' : 'border-border/50 text-text-tertiary group-hover:text-accent-brand'
                      }`}>
                        {isOpen ? 'hide' : 'reveal'}
                      </span>
                    </dt>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.dd
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-text-secondary mt-1.5 overflow-hidden"
                        >
                          {v.meaning}
                        </motion.dd>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </dl>
          </div>
        )}


        {quizReady && quiz && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 sm:px-6 py-5 border-t border-border/40 bg-gradient-to-br from-accent-brand/10 to-transparent"
          >
            <div className="text-sm font-bold text-accent-brand mb-3 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="text-lg">🎯</span> Quick check</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-brand/20 text-accent-brand">+10 Sparks</span>
            </div>
            <p className="text-text-primary font-semibold mb-3 text-[17px]">{quiz.question}</p>
            <div className="space-y-2">
              {quiz.options!.map((opt, i) => {
                const answered = picked !== undefined;
                const isCorrect = i === quiz.correct_index;
                const isPicked = picked === i;
                return (
                  <motion.button
                    key={i}
                    whileHover={!answered ? { x: 4 } : {}}
                    disabled={answered || streaming}
                    onClick={() => onPick(i, quiz.correct_index!)}
                    className={[
                      'w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between font-medium',
                      !answered && 'bg-card hover:border-accent-brand/60 border-border/60 hover:bg-accent-brand/5',
                      answered && isCorrect && 'bg-emerald-500/15 border-emerald-500/60 text-text-primary',
                      answered && isPicked && !isCorrect && 'bg-red-500/15 border-red-500/60 text-text-primary',
                      answered && !isPicked && !isCorrect && 'opacity-50 border-border/40',
                    ].filter(Boolean).join(' ')}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <Check className="h-5 w-5 text-emerald-400" />}
                    {answered && isPicked && !isCorrect && <X className="h-5 w-5 text-red-400" />}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {picked !== undefined && quiz.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-border/30 text-sm text-text-secondary"
                >
                  <span className="font-semibold text-text-primary">
                    {picked === quiz.correct_index ? '✨ Nailed it! ' : '💡 So close — '}
                  </span>
                  {quiz.explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {rabbitHoles.length > 0 && (
          <div className="px-5 sm:px-6 py-5 border-t border-border/40">
            <div className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
              <Compass className="h-4 w-4 text-accent-brand" /> Follow the rabbit hole 🐇
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {rabbitHoles.map((r, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2 }}
                  onClick={() => onAsk(r)}
                  disabled={streaming}
                  className="group text-left p-3 rounded-xl border border-border/50 hover:border-accent-brand/60 bg-card/50 hover:bg-accent-brand/10 transition-all flex items-center justify-between gap-2 disabled:opacity-60"
                >
                  <span className="text-text-primary text-sm font-semibold">{r}</span>
                  <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-accent-brand group-hover:translate-x-1 transition-all flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {!streaming && (card.hook || paragraphs.length > 0) && (
          <div className="px-5 sm:px-6 py-4 border-t border-border/40 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-widest text-text-tertiary font-bold mr-1">Tune it:</span>
              <button
                onClick={() => onTune('simpler')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 transition"
              >
                <Baby className="h-3.5 w-3.5" /> Simpler
              </button>
              <button
                onClick={() => onTune('deeper')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-info/10 border border-accent-info/40 text-accent-info hover:bg-accent-info/20 transition"
              >
                <Rocket className="h-3.5 w-3.5" /> Go deeper
              </button>
            </div>
            {combo >= 2 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/15 border border-orange-500/50 text-orange-300">
                <Flame className="h-3.5 w-3.5 fill-orange-400" /> {combo}× quiz combo
              </div>
            )}
          </div>
        )}
      </article>
    </motion.div>
  );
};

export default WonderCanvas;
