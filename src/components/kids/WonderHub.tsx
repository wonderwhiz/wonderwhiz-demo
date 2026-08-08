import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Shuffle, Menu, Flame, Zap, ChevronRight, Gift } from 'lucide-react';
import { useCurioProgress } from '@/hooks/useCurioProgress';

interface WonderHubProps {
  childProfile: any;
  onSearch?: (query: string) => void;
}

type World = {
  id: string;
  name: string;
  emoji: string;
  tint: string;
  questions: string[];
};

const WORLDS: World[] = [
  {
    id: 'space', name: 'Space', emoji: '🚀', tint: 'from-indigo-500/15 to-violet-500/10',
    questions: ['What is inside a black hole?', 'Why does the Moon change shape?', 'Could we live on Mars?', 'How hot is the Sun?'],
  },
  {
    id: 'animals', name: 'Creatures', emoji: '🐙', tint: 'from-emerald-500/15 to-teal-500/10',
    questions: ['Why do octopuses have three hearts?', 'How do bees make honey?', 'Why do cats purr?', 'How do birds know where to fly?'],
  },
  {
    id: 'body', name: 'My Body', emoji: '🧠', tint: 'from-rose-500/15 to-pink-500/10',
    questions: ['Why do we dream?', 'What makes us ticklish?', 'Why does my tummy rumble?', 'How do broken bones heal?'],
  },
  {
    id: 'earth', name: 'Planet Earth', emoji: '🌋', tint: 'from-amber-500/15 to-orange-500/10',
    questions: ['How do volcanoes erupt?', 'Why is the ocean blue?', 'What makes thunder rumble?', 'How are rainbows made?'],
  },
  {
    id: 'tech', name: 'Machines', emoji: '🤖', tint: 'from-sky-500/15 to-blue-500/10',
    questions: ['How does WiFi travel?', 'How do planes stay up?', 'How do robots think?', 'What is inside a phone?'],
  },
  {
    id: 'weird', name: 'Weird & Wild', emoji: '🌀', tint: 'from-fuchsia-500/15 to-purple-500/10',
    questions: ['Why does popcorn pop?', 'Can it rain frogs?', 'Why do we get brain freeze?', 'What is the loudest sound ever?'],
  },
];

const ALL_QUESTIONS = WORLDS.flatMap((w) => w.questions);

const WonderHub: React.FC<WonderHubProps> = ({ childProfile, onSearch }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [openWorld, setOpenWorld] = useState<string | null>(null);
  const p = useCurioProgress(childProfile?.id ?? 'guest');

  const age = childProfile?.age ?? 10;
  const isYoung = age <= 8;

  const go = (q: string) => {
    if (!q.trim()) return;
    onSearch?.(q.trim());
    navigate(`/wonderwhiz/${childProfile?.id}?q=${encodeURIComponent(q.trim())}`);
  };

  const unfinished = useMemo(
    () => p.history.filter((h: any) => !h.completed).slice(0, 3),
    [p.history],
  );

  const questsLeft = p.quests.filter((q) => !q.claimed).length;

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-secondary/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-surface-tertiary flex items-center justify-center text-xl">
              {p.level.emoji}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-text-primary truncate">Hi {childProfile?.name}! 👋</p>
              <p className="text-xs text-text-tertiary truncate">{p.level.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-surface-tertiary px-3 py-1.5 text-sm font-bold text-text-primary">
              <Zap className="h-4 w-4 text-accent-warning" /> {p.sparks}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-surface-tertiary px-3 py-1.5 text-sm font-bold text-text-primary">
              <Flame className="h-4 w-4 text-accent-warning" /> {p.streak}
            </span>
            <button
              onClick={() => navigate('/profiles')}
              aria-label="Switch profile"
              className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-tertiary"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Ask anything */}
        <section className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary text-center">
            {isYoung ? 'What are you wondering about? 🤔' : 'Ask anything. Get an answer in seconds.'}
          </h1>
          <form
            onSubmit={(e) => { e.preventDefault(); go(input); }}
            className="fun-card flex items-center gap-2 p-2"
          >
            <Search className="ml-2 h-5 w-5 text-text-tertiary shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isYoung ? 'Why is the sky blue?' : 'Type any question…'}
              aria-label="Ask a question"
              className="flex-1 bg-transparent py-3 text-base sm:text-lg text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => go(ALL_QUESTIONS[Math.floor(Math.random() * ALL_QUESTIONS.length)])}
              aria-label="Surprise me"
              title="Surprise me"
              className="h-11 w-11 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-tertiary"
            >
              <Shuffle className="h-5 w-5" />
            </button>
            <button type="submit" disabled={!input.trim()} className="fun-btn h-11 px-5">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        {/* Today: goal + quests, side by side (no long scroll) */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="fun-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-text-primary">Today's Sparks</p>
              <p className="text-sm font-bold text-text-secondary">{p.todaySparks}/{p.dailyGoal}⚡</p>
            </div>
            <div className="h-3 rounded-full bg-surface-tertiary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent-brand"
                initial={{ width: 0 }}
                animate={{ width: `${p.goalPct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="mt-3 flex justify-between">
              {p.week.map((d, i) => (
                <div key={d.key} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      d.active ? 'bg-accent-brand text-text-inverse' : 'bg-surface-tertiary text-text-tertiary'
                    }`}
                  >
                    {d.active ? '🔥' : d.label}
                  </div>
                  <span className="text-[10px] text-text-tertiary">{i === 6 ? 'Today' : d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fun-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-text-primary">Daily Quests</p>
              <span className="text-xs font-bold text-text-tertiary">{questsLeft} left</span>
            </div>
            <ul className="space-y-2">
              {p.quests.map((q) => (
                <li key={q.id} className="flex items-center gap-2">
                  <span className="text-lg">{q.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{q.label}</p>
                    <div className="h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent-success"
                        style={{ width: `${(q.progress / q.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  {q.done && !q.claimed ? (
                    <button onClick={() => p.claimQuest(q.id)} className="fun-btn h-8 px-3 text-xs">
                      <Gift className="h-3.5 w-3.5 mr-1" /> +{q.reward}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-text-tertiary">
                      {q.claimed ? '✅' : `${q.progress}/${q.target}`}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pick up where you left off */}
        {unfinished.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary">Pick up where you left off</h2>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {unfinished.map((h: any) => (
                <button
                  key={h.id}
                  onClick={() => go(h.question)}
                  className="fun-card fun-card-pop shrink-0 max-w-[15rem] p-4 text-left"
                >
                  <p className="text-sm font-semibold text-text-primary line-clamp-2">{h.question}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-accent-brand">
                    Continue <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Wonder worlds — tap a world, pick a question, jump straight in */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary">Explore a world 🗺️</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WORLDS.map((w) => {
              const open = openWorld === w.id;
              return (
                <div
                  key={w.id}
                  className={`fun-card overflow-hidden bg-gradient-to-br ${w.tint} ${open ? 'col-span-2 md:col-span-3' : ''}`}
                >
                  <button
                    onClick={() => setOpenWorld(open ? null : w.id)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <span className="text-3xl">{w.emoji}</span>
                    <span className="flex-1 font-bold text-text-primary">{w.name}</span>
                    <ChevronRight
                      className={`h-5 w-5 text-text-tertiary transition-transform ${open ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 pb-4 flex flex-wrap gap-2"
                    >
                      {w.questions.map((q) => (
                        <button key={q} onClick={() => go(q)} className="fun-chip">
                          {q}
                        </button>
                      ))}
                      <button
                        onClick={() => go(w.questions[Math.floor(Math.random() * w.questions.length)])}
                        className="fun-chip"
                      >
                        🎲 Surprise me
                      </button>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Parents */}
        <div className="pb-10 text-center">
          <button
            onClick={() => navigate('/parent-zone')}
            className="text-sm font-semibold text-text-tertiary hover:text-text-primary underline underline-offset-4"
          >
            👨‍👩‍👧 Grown-ups zone
          </button>
        </div>
      </main>
    </div>
  );
};

export default WonderHub;
