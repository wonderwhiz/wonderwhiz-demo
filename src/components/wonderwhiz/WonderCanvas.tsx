import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Send, Sparkles, BookOpen, Lightbulb, Compass, Check, X,
  Loader2, Mic, MicOff, Flame, Zap, Trophy, MapPin, RotateCcw,
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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface Props {
  childProfile: { id: string; name: string; age: number | null };
  onBack: () => void;
}

// Emoji-forward prompts to feel like a game menu, not a search bar.
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

const LEVELS = [
  { at: 0, name: 'Curious Cadet', emoji: '🌱' },
  { at: 10, name: 'Wonder Explorer', emoji: '🔭' },
  { at: 25, name: 'Idea Hunter', emoji: '🎯' },
  { at: 50, name: 'Genius in Training', emoji: '⚡' },
  { at: 100, name: 'Wonder Wizard', emoji: '🧙' },
  { at: 200, name: 'Mind Master', emoji: '👑' },
];

const levelFor = (sparks: number) =>
  [...LEVELS].reverse().find((l) => sparks >= l.at) ?? LEVELS[0];

const nextLevel = (sparks: number) =>
  LEVELS.find((l) => sparks < l.at);

const fireConfetti = (opts?: Partial<confetti.Options>) => {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#a78bfa', '#6366f1', '#22d3ee', '#34d399', '#f472b6'],
    ...opts,
  });
};

const WonderCanvas: React.FC<Props> = ({ childProfile, onBack }) => {
  const age = childProfile.age ?? 10;
  const band = age <= 7 ? 'young' : age <= 11 ? 'mid' : 'teen';
  const isYoung = band === 'young';
  const storageKey = `wonder:${childProfile.id}`;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [quizPicks, setQuizPicks] = useState<Record<number, number>>({});
  const [sparks, setSparks] = useState(0);
  const [sparkPop, setSparkPop] = useState(0); // increments to trigger pop anim
  const [lastGain, setLastGain] = useState<number>(0);
  const [listening, setListening] = useState(false);
  const [rotatingPrompt, setRotatingPrompt] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Restore session
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.sparks === 'number') setSparks(s.sparks);
      }
    } catch {}
    inputRef.current?.focus();
  }, [storageKey]);

  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ sparks })); } catch {}
  }, [sparks, storageKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  // Rotate the hero placeholder every 3s when empty
  useEffect(() => {
    if (turns.length) return;
    const id = setInterval(() => setRotatingPrompt((n) => n + 1), 3000);
    return () => clearInterval(id);
  }, [turns.length]);

  const addSparks = (n: number, opts?: { celebrate?: boolean }) => {
    setSparks((s) => s + n);
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

  const ask = async (q: string) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setInput('');
    const parentTopic = turns.length ? turns[turns.length - 1].card.title : undefined;

    const turnIndex = turns.length;
    setTurns((t) => [...t, { question: q, card: {}, streaming: true }]);
    addSparks(2); // reward for asking

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
        }
      }

      const finalCard = parsePartialJSON<WonderCard>(raw);
      setTurns((t) => {
        const copy = t.slice();
        if (copy[turnIndex]) copy[turnIndex] = { ...copy[turnIndex], card: finalCard || copy[turnIndex].card, streaming: false };
        return copy;
      });
      addSparks(5, { celebrate: true }); // finishing an answer = mini celebration
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
      addSparks(10, { celebrate: true });
      toast.success('+10 Sparks — correct!', { icon: '⚡' });
    } else {
      addSparks(2);
      toast('+2 Sparks — nice try!', { icon: '💡' });
    }
  };

  // Voice input (Web Speech API — progressive enhancement)
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,hsl(var(--accent-brand)/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(var(--accent-info)/0.14),transparent_50%),hsl(var(--background))]">
      {/* Ambient decorative blur orbs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent-brand/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-accent-info/15 blur-3xl" />

      {/* Top bar — game HUD */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-6 py-2.5">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 shrink-0">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Home</span>
          </Button>

          {/* Level pill + progress */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-card/70 border border-border/50">
              <span className="text-base leading-none">{level.emoji}</span>
              <div className="min-w-0">
                <div className="text-[11px] leading-tight font-semibold text-text-primary truncate max-w-[100px] sm:max-w-none">{level.name}</div>
                {upcoming && (
                  <div className="w-20 sm:w-28 h-1 rounded-full bg-white/10 mt-0.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-brand to-accent-info transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sparks counter with pop animation */}
          <div className="relative shrink-0">
            <motion.div
              key={sparkPop}
              initial={{ scale: 1 }}
              animate={{ scale: sparkPop ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent-brand/20 to-accent-info/20 border border-accent-brand/40"
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

        {/* Journey trail */}
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
              {journey.length >= 3 && (
                <span className="flex items-center gap-1 text-[11px] text-orange-400 ml-1">
                  <Flame className="h-3 w-3 fill-orange-400" /> {journey.length}
                </span>
              )}
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
              Ask <em>anything</em>. Earn Sparks ⚡, unlock levels, and follow rabbit holes wherever curiosity pulls you.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left">
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

            <p className="mt-6 text-xs text-text-tertiary flex items-center justify-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" /> Ask 3 questions to hit your first streak
            </p>
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
              onAsk={ask}
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
    </div>
  );
};

const TurnBlock: React.FC<{
  turn: Turn;
  idx: number;
  picked?: number;
  onPick: (i: number, correct: number) => void;
  onAsk: (q: string) => void;
}> = ({ turn, idx, picked, onPick, onAsk }) => {
  const { question, card, streaming } = turn;
  const paragraphs = card.paragraphs ?? [];
  const wowFacts = card.wow_facts ?? [];
  const vocab = card.vocab ?? [];
  const rabbitHoles = card.rabbit_holes ?? [];
  const quiz = card.quiz;
  const quizReady = !!(quiz?.question && quiz.options && quiz.options.length > 1 && typeof quiz.correct_index === 'number');
  const showCaretOnLast = streaming && paragraphs.length > 0;

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
              {wowFacts.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 text-text-primary items-start p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition"
                >
                  <span className="text-accent-info text-lg leading-none mt-0.5">✦</span>
                  <span>{f}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {vocab.length > 0 && (
          <div className="px-5 sm:px-6 py-5 border-t border-border/40">
            <div className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="text-lg">📖</span> Words worth knowing
            </div>
            <dl className="grid sm:grid-cols-2 gap-2.5">
              {vocab.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-3 rounded-xl bg-surface-secondary/50 border border-border/30 hover:border-accent-brand/40 transition"
                >
                  <dt className="font-bold text-text-primary">{v.word}</dt>
                  <dd className="text-sm text-text-secondary mt-0.5">{v.meaning}</dd>
                </motion.div>
              ))}
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
      </article>
    </motion.div>
  );
};

export default WonderCanvas;
