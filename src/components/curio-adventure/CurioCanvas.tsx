import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Mic, MicOff, Sparkles, Zap, Flame, Shuffle, Loader2,
  Trophy as TrophyIcon, ChevronRight, Rocket, Award, X, History,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useCurioProgress, BADGES } from '@/hooks/useCurioProgress';
import { MOODS, Mood, Spark, SectionData, MakeBrief } from './types';
import DiveSection from './DiveSection';
import MakeMode from './MakeMode';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const CHECKPOINT_ROTATION: ('quiz' | 'flip' | 'myth' | 'riddle')[] = ['quiz', 'flip', 'myth', 'riddle'];

const SURPRISES = [
  'Why do cats purr?', 'How do volcanoes erupt?', 'Why is the sky blue?',
  'How do planes stay up?', 'What is inside a black hole?', 'Why do we dream?',
  'How do plants eat sunlight?', 'Why does popcorn pop?', 'How do bees make honey?',
  'What makes thunder rumble?', 'Why do octopuses have three hearts?', 'How does WiFi travel?',
];

type Stage = 'ask' | 'spark' | 'dive' | 'make' | 'reward';

interface Props {
  childProfile: { id: string; name: string; age: number | null };
  onBack: () => void;
}

async function callFn<T>(name: string, body: unknown): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Something went wrong');
  return data as T;
}

const CurioCanvas: React.FC<Props> = ({ childProfile, onBack }) => {
  const age = childProfile.age ?? 10;
  const p = useCurioProgress(childProfile.id);

  const [stage, setStage] = useState<Stage>('ask');
  const [mood, setMood] = useState<Mood>('explore');
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const [curioId, setCurioId] = useState('');
  const [question, setQuestion] = useState('');
  const [spark, setSpark] = useState<Spark | null>(null);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [make, setMake] = useState<MakeBrief | null>(null);
  const [makeLoading, setMakeLoading] = useState(false);
  const [makeDone, setMakeDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [shelfOpen, setShelfOpen] = useState(false);
  const [combo, setCombo] = useState(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [chain, setChain] = useState(0);
  const [burst, setBurst] = useState<{ id: number; n: number } | null>(null);
  const [session, setSession] = useState({ sparks: 0, right: 0, wrong: 0 });
  const sectionCache = useRef<Map<number, Promise<SectionData>>>(new Map());




  const inputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const dailyChallenge = useMemo(() => {
    const seed = new Date().toISOString().slice(0, 10).split('-').reduce((a, s) => a + parseInt(s, 10), 0);
    return SURPRISES[seed % SURPRISES.length];
  }, []);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  /* ---------- speech ---------- */
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = age <= 7 ? 0.85 : 0.95;
    u.pitch = age <= 7 ? 1.15 : 1;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [age, speaking]);

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast('Voice isn\'t supported on this device'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  /* ---------- rewards ---------- */
  const award = useCallback((n: number, celebrate = false) => {
    p.addSparks(n, celebrate);
    setSession((s) => ({ ...s, sparks: s.sparks + n }));
    setBurst({ id: Date.now(), n });
    setTimeout(() => setBurst(null), 1400);
  }, [p]);


  /* ---------- flow ---------- */
  const startCurio = useCallback(async (q: string) => {
    const clean = q.trim();
    if (!clean || loading) return;
    setLoading(true);
    setInput('');
    setStage('spark');
    setSpark(null);
    setSections([]);
    sectionCache.current = new Map();

    setSectionIdx(0);
    setMake(null);
    setMakeDone(false);
    setCombo(0);
    setGuess(null);
    setChain((c) => c + 1);
    setQuestion(clean);
    const id = `${Date.now()}`;
    setCurioId(id);
    try {
      const s = await callFn<Spark>('wonder-spark', {
        question: clean, childAge: age, childName: childProfile.name, mood,
      });
      setSpark(s);
      setSession({ sparks: 0, right: 0, wrong: 0 });
      award(5);
      p.track('curio');
      p.unlock('first_spark');

      p.recordCurio({
        id, question: clean, title: s.title, emoji: s.emoji, mood,
        createdAt: Date.now(), completed: false,
      });
      // pre-draw the hero picture quietly
      callFn<{ imageUrl: string }>('wonder-image', { prompt: s.image_prompt })
        .then((r) => setSpark((prev) => (prev ? { ...prev, heroUrl: r.imageUrl } : prev)))
        .catch(() => {});
    } catch (e) {
      toast.error((e as Error).message);
      setStage('ask');
    } finally {
      setLoading(false);
    }
  }, [age, award, childProfile.name, loading, mood, p]);

  const onGuess = (i: number) => {
    if (!spark?.predict) return;
    setGuess(i);
    const right = i === spark.predict.correct_index;
    award(right ? 8 : 4, right);
    toast(right ? '🎯 Great hunch! +8 Sparks' : '💡 Nice guess! +4 Sparks');
  };


  /* ---------- section fetching (cached + prefetched) ---------- */
  const fetchSection = useCallback((sparkArg: Spark, q: string, idx: number): Promise<SectionData> => {
    const cached = sectionCache.current.get(idx);
    if (cached) return cached;
    const req = callFn<SectionData>('wonder-section', {
      topic: sparkArg.title,
      question: q,
      sectionTitle: sparkArg.sections[idx]?.title,
      index: idx,
      total: sparkArg.sections.length,
      childAge: age,
      childName: childProfile.name,
      mood,
      kind: CHECKPOINT_ROTATION[idx % CHECKPOINT_ROTATION.length],
    }).then((s) => {
      setSections((prev) => {
        const next = [...prev];
        next[idx] = s;
        return next;
      });
      return s;
    }).catch((e) => {
      sectionCache.current.delete(idx);
      throw e;
    });
    sectionCache.current.set(idx, req);
    return req;
  }, [age, childProfile.name, mood]);

  // Warm the next section in the background so "Continue" feels instant.
  const prefetchSection = useCallback((idx: number) => {
    if (!spark || idx < 0 || idx >= spark.sections.length) return;
    fetchSection(spark, question, idx).catch(() => {});
  }, [fetchSection, question, spark]);

  const loadSection = useCallback(async (idx: number) => {
    if (!spark) return;
    if (sectionCache.current.has(idx) && sections[idx]) return;
    setSectionLoading(true);
    try {
      await fetchSection(spark, question, idx);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSectionLoading(false);
    }
  }, [fetchSection, question, sections, spark]);

  // While the child reads the Spark, warm the first two dive sections.
  useEffect(() => {
    if (!spark || stage !== 'spark') return;
    prefetchSection(0);
    prefetchSection(1);
  }, [spark, stage, prefetchSection]);

  // Once a section is on screen, quietly fetch the following one.
  useEffect(() => {
    if (stage !== 'dive' || !spark) return;
    if (!sections[sectionIdx]) return;
    prefetchSection(sectionIdx + 1);
  }, [stage, sectionIdx, sections, spark, prefetchSection]);


  const startDive = async () => {
    setStage('dive');
    setSectionIdx(0);
    scrollTop();
    if (!sections[0]) await loadSection(0);
  };

  const nextSection = async () => {
    if (!spark) return;
    const next = sectionIdx + 1;
    if (next >= spark.sections.length) {
      p.unlock('deep_diver');
      p.track('dive');

      award(20, true);
      setStage('make');
      scrollTop();
      setMakeLoading(true);
      try {
        const m = await callFn<MakeBrief>('wonder-make', {
          topic: spark.title, childAge: age, childName: childProfile.name, mood,
        });
        setMake(m);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setMakeLoading(false);
      }
      return;
    }
    setSectionIdx(next);
    scrollTop();
    if (!sections[next]) await loadSection(next);
    prefetchSection(next + 1);
  };


  const onSectionImage = async (idx: number) => {
    const sec = sections[idx];
    if (!sec) return;
    try {
      const r = await callFn<{ imageUrl: string }>('wonder-image', { prompt: sec.image_prompt });
      setSections((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], imageUrl: r.imageUrl };
        return next;
      });
      award(3);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onCheckpoint = (correct: boolean) => {
    if (correct) {
      const c = combo + 1;
      setCombo(c);
      setSession((s) => ({ ...s, right: s.right + 1 }));
      p.track('correct');
      const bonus = c >= 2 ? c * 2 : 0;
      award(10 + bonus, true);
      p.unlock('quiz_whiz');
      toast.success(bonus ? `+${10 + bonus} Sparks — ${c}× combo! 🔥` : '+10 Sparks — nailed it!');
    } else {
      setCombo(0);
      setSession((s) => ({ ...s, wrong: s.wrong + 1 }));
      award(2);
      toast('+2 Sparks — good try!', { icon: '💡' });
    }

  };

  const onMakeComplete = (photo?: string) => {
    if (!make || !spark) return;
    setMakeDone(true);
    p.addTrophy({
      id: `${Date.now()}`, title: make.title, emoji: make.emoji,
      topic: spark.title, kind: make.kind, createdAt: Date.now(), photo,
    });
    p.unlock('maker');
    award(30, true);
    p.completeCurio(curioId);
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 } });
    setTimeout(() => { setStage('reward'); scrollTop(); }, 900);
  };

  const resetToAsk = () => {
    setStage('ask');
    setSpark(null);
    setSections([]);
    setQuestion('');
    scrollTop();
  };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  /* ---------- shared chrome ---------- */
  const Header = (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-surface-primary/90 border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onClick={stage === 'ask' ? onBack : resetToAsk}
          aria-label={stage === 'ask' ? 'Back to profiles' : 'Back to asking'}
          className="h-10 w-10 rounded-xl border border-border bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-black text-text-primary">
            <span>{p.level.emoji}</span>
            <span className="truncate">{p.level.name}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
            <div className="h-full bg-accent-brand rounded-full transition-all" style={{ width: `${p.levelProgress}%` }} />
          </div>
        </div>

        <motion.div
          key={p.sparks}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-accent-warning/15 border border-accent-warning/30"
        >
          <Zap className="h-4 w-4 text-accent-warning" />
          <span className="font-black text-text-primary text-sm tabular-nums">{p.sparks}</span>
        </motion.div>
        {chain > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-accent-brand/15 border border-accent-brand/30" title="Curiosity chain this session">
            <span className="text-sm">🔗</span>
            <span className="font-black text-text-primary text-sm">{chain}</span>
          </div>
        )}
        {p.streak > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-accent-error/15 border border-accent-error/30">
            <Flame className="h-4 w-4 text-accent-error" />
            <span className="font-black text-text-primary text-sm">{p.streak}</span>
          </div>
        )}

        <button
          onClick={() => setShelfOpen(true)}
          aria-label="Trophy shelf"
          className="h-10 w-10 rounded-xl border border-border bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-text-primary"
        >
          <TrophyIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-surface-primary">
      {Header}
      <div ref={topRef} />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 space-y-5">
        {/* ---------- ASK ---------- */}
        {stage === 'ask' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="pt-4">
              <h1 className="text-3xl sm:text-4xl font-black text-text-primary leading-tight">
                What do you want to explore today, {childProfile.name}?
              </h1>
              <p className="mt-2 text-text-secondary">Ask anything. I'll spark an answer in seconds.</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2">Pick a mood</p>
              <div className="grid grid-cols-4 gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={[
                      'rounded-3xl py-3 border-2 font-bold text-xs flex flex-col items-center gap-1 transition min-h-[70px] justify-center',
                      mood === m.id
                        ? 'border-accent-brand bg-accent-brand/15 text-text-primary'
                        : 'border-border bg-surface-secondary text-text-secondary hover:border-accent-brand/40',
                    ].join(' ')}
                  >
                    <span className="text-xl">{m.emoji}</span>{m.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => startCurio(dailyChallenge)}
              className="w-full text-left p-4 rounded-[28px] border-2 border-accent-warning bg-accent-warning/10 flex items-center gap-3 shadow-sm"
            >
              <span className="text-2xl">🏅</span>
              <span className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-widest text-accent-warning">Daily Wonder</span>
                <span className="block font-bold text-text-primary">{dailyChallenge}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-text-tertiary" />
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              {SURPRISES.slice(0, 6).map((q) => (
                <button
                  key={q}
                  onClick={() => startCurio(q)}
                  className="p-4 rounded-3xl border-2 border-border bg-surface-secondary text-left text-sm font-bold text-text-primary hover:border-accent-brand hover:-translate-y-0.5 transition min-h-[68px] shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>

            {p.history.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" /> Your Curios
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {p.history.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => startCurio(h.question)}
                      className="shrink-0 px-3.5 py-2.5 rounded-2xl border border-border bg-surface-secondary text-sm font-semibold text-text-secondary hover:text-text-primary flex items-center gap-2"
                    >
                      <span>{h.emoji}</span>
                      <span className="max-w-[140px] truncate">{h.title}</span>
                      {h.completed && <span className="text-accent-success">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-2">Badges</p>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => {
                  const has = p.badges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      title={has ? b.name : b.hint}
                      className={[
                        'px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5',
                        has ? 'border-accent-warning/50 bg-accent-warning/10 text-text-primary' : 'border-border bg-surface-secondary text-text-tertiary',
                      ].join(' ')}
                    >
                      <span className={has ? '' : 'grayscale opacity-50'}>{b.emoji}</span>
                      {has ? b.name : '???'}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---------- SPARK ---------- */}
        {stage === 'spark' && (
          <div className="space-y-5">
            <p className="text-sm font-semibold text-text-tertiary">You asked: “{question}”</p>

            {!spark ? (
              <div className="fun-card p-6 space-y-3">
                <div className="h-6 w-2/3 rounded-full bg-surface-tertiary animate-pulse" />
                <div className="h-4 w-full rounded-full bg-surface-tertiary animate-pulse" />
                <div className="h-4 w-5/6 rounded-full bg-surface-tertiary animate-pulse" />
                <p className="text-sm text-text-tertiary flex items-center gap-2 pt-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Sparking…
                </p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* guess-first gate */}
                {spark.predict && guess === null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fun-card border-accent-brand p-5 sm:p-6"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-brand">🤔 Guess first</p>
                    <p className="mt-2 text-xl sm:text-2xl font-black text-text-primary leading-snug">{spark.predict.prompt}</p>
                    <div className="mt-4 grid gap-2.5">
                      {spark.predict.options.map((o, i) => (
                        <button key={i} onClick={() => onGuess(i)} className="fun-chip w-full justify-start text-left">
                          <span className="font-black mr-1">{i === 0 ? 'A' : 'B'}</span> {o}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-text-tertiary">No wrong answers — guessing earns Sparks either way ⚡</p>
                  </motion.div>
                )}

                {spark.predict && guess !== null && (
                  <div className={`fun-card p-4 flex items-start gap-3 ${guess === spark.predict.correct_index ? 'border-accent-success' : 'border-accent-warning'}`}>
                    <span className="text-2xl">{guess === spark.predict.correct_index ? '🎯' : '💡'}</span>
                    <p className="text-base font-semibold text-text-primary leading-relaxed">
                      {guess === spark.predict.correct_index ? 'Great hunch! ' : 'Close one! '}
                      {spark.predict.reveal}
                    </p>
                  </div>
                )}

                <div className={`fun-card overflow-hidden transition ${spark.predict && guess === null ? 'blur-md pointer-events-none select-none' : ''}`}>
                  {spark.heroUrl && (
                    <img src={spark.heroUrl} alt={spark.title} className="w-full aspect-[16/9] object-cover" />
                  )}
                  <div className="p-5 sm:p-6">
                    <h1 className="text-3xl sm:text-4xl font-black text-text-primary leading-tight">
                      <span className="mr-2">{spark.emoji}</span>{spark.title}
                    </h1>
                    <p className="mt-3 text-xl sm:text-2xl text-text-primary leading-relaxed font-medium">{spark.answer}</p>
                    <div className="mt-4 p-4 rounded-2xl bg-accent-brand/10 border border-accent-brand/30">
                      <p className="text-xs font-bold uppercase tracking-widest text-accent-brand mb-1">🤯 Wow fact</p>
                      <p className="text-base text-text-primary leading-relaxed">{spark.wow_fact}</p>
                    </div>
                    <button
                      onClick={() => speak(`${spark.answer}. ${spark.wow_fact}`)}
                      className="fun-chip mt-4"
                    >
                      {speaking ? '⏹ Stop' : '🔊 Read aloud'}
                    </button>
                  </div>
                </div>

                {(!spark.predict || guess !== null) && (
                  <>
                    <div className="fun-card p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary">Deep Dive · {spark.sections.length} parts</p>
                      <ul className="mt-3 space-y-2">
                        {spark.sections.map((s, i) => (
                          <li key={i} className="flex items-center gap-3 text-text-primary font-bold text-lg bg-surface-tertiary rounded-2xl px-3 py-2.5">
                            <span className="h-9 w-9 shrink-0 rounded-full bg-surface-secondary text-lg flex items-center justify-center shadow-sm">{s.emoji}</span>
                            {s.title}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-accent-warning">
                        <Zap className="h-4 w-4" /> Finish all {spark.sections.length} parts to unlock +20 Sparks & Make Mode
                      </div>
                      <button
                        onClick={startDive}
                        className="fun-btn mt-4"
                      >
                        <Rocket className="h-5 w-5" /> Start Deep Dive
                      </button>
                    </div>

                    {!!spark.rabbit_holes?.length && (
                      <div className="fun-card p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary">🐇 Or jump down a rabbit hole</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {spark.rabbit_holes.map((q) => (
                            <button key={q} onClick={() => startCurio(q)} className="fun-chip">
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}


        {/* ---------- DIVE ---------- */}
        {stage === 'dive' && spark && (
          <div className="space-y-4">
            <div className="flex gap-1.5">
              {spark.sections.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= sectionIdx ? 'bg-accent-brand' : 'bg-surface-tertiary'}`} />
              ))}
            </div>

            {sectionLoading || !sections[sectionIdx] ? (
              <div className="fun-card p-6 space-y-3">
                <div className="h-6 w-1/2 rounded-full bg-surface-tertiary animate-pulse" />
                <div className="h-4 w-full rounded-full bg-surface-tertiary animate-pulse" />
                <div className="h-4 w-4/6 rounded-full bg-surface-tertiary animate-pulse" />
              </div>
            ) : (
              <DiveSection
                key={sectionIdx}
                section={sections[sectionIdx]}
                index={sectionIdx}
                total={spark.sections.length}
                isLast={sectionIdx === spark.sections.length - 1}
                onImage={() => onSectionImage(sectionIdx)}
                onStory={() => {}}
                speaking={speaking}
                onSpeak={() => speak(sections[sectionIdx].body.join(' '))}
                onTune={(m) => startCurio(
                  m === 'simpler'
                    ? `Explain ${sections[sectionIdx].heading} in much simpler words`
                    : `Go deeper and more advanced on ${sections[sectionIdx].heading}`,
                )}
                onCheckpoint={onCheckpoint}
                onContinue={nextSection}
              />
            )}
          </div>
        )}

        {/* ---------- MAKE ---------- */}
        {stage === 'make' && (
          <MakeMode brief={make} loading={makeLoading} done={makeDone} onComplete={onMakeComplete} />
        )}

        {/* ---------- REWARD ---------- */}
        {stage === 'reward' && spark && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="fun-card border-accent-success bg-accent-success/10 p-6 text-center">
              <div className="text-6xl">{spark.emoji}</div>
              <h2 className="mt-3 text-3xl font-black text-text-primary">Quest complete!</h2>
              <p className="mt-1 text-text-secondary">You cracked open “{spark.title}”.</p>

              {/* session scorecard */}
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl border-2 border-accent-warning/40 bg-accent-warning/10 p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent-warning">Sparks</p>
                  <p className="text-2xl font-black text-text-primary tabular-nums">{session.sparks}</p>
                </div>
                <div className="rounded-2xl border-2 border-accent-success/40 bg-accent-success/10 p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent-success">Accuracy</p>
                  <p className="text-2xl font-black text-text-primary tabular-nums">
                    {session.right + session.wrong
                      ? Math.round((session.right / (session.right + session.wrong)) * 100)
                      : 100}%
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-accent-error/40 bg-accent-error/10 p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent-error">Streak</p>
                  <p className="text-2xl font-black text-text-primary tabular-nums">{p.streak}🔥</p>
                </div>
              </div>

              {/* daily goal nudge — the "one more" pull */}
              <div className="mt-4 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-text-secondary mb-1.5">
                  <span>{p.goalMet ? 'Daily goal complete!' : `${p.dailyGoal - p.todaySparks} ⚡ to your daily goal`}</span>
                  <span className="tabular-nums">{Math.min(p.todaySparks, p.dailyGoal)}/{p.dailyGoal}</span>
                </div>
                <div className="h-3 rounded-full bg-surface-tertiary overflow-hidden">
                  <div className="h-full rounded-full bg-accent-warning transition-all" style={{ width: `${p.goalPct}%` }} />
                </div>
              </div>

              <p className="mt-3 text-sm text-text-tertiary">
                💛 A Proud Moment card was saved for your grown-up.
              </p>

              <button
                onClick={() => window.print()}
                className="fun-chip mt-4 mx-auto"
              >
                🖨️ Print my certificate
              </button>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary">🐇 Rabbit holes from this Curio</p>
            <div className="grid gap-2.5">
              {(spark.rabbit_holes?.length ? spark.rabbit_holes : SURPRISES.slice(0, 3)).map((q) => (
                <button
                  key={q}
                  onClick={() => startCurio(q)}
                  className="p-4 rounded-2xl border-2 border-border bg-surface-secondary text-left font-bold text-text-primary hover:border-accent-brand hover:-translate-y-0.5 transition flex items-center justify-between gap-3"
                >
                  <span>{q}</span>
                  <span className="shrink-0 flex items-center gap-1 text-xs font-black text-accent-warning">
                    <Zap className="h-3.5 w-3.5" /> +5
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={resetToAsk}
              className="fun-btn"
            >
              Ask something new
            </button>
          </motion.div>
        )}
      </main>

      {/* ---------- composer ---------- */}
      {(stage === 'ask' || stage === 'reward') && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-gradient-to-t from-surface-primary via-surface-primary/95 to-transparent pt-6 pb-4">
          <form
            onSubmit={(e) => { e.preventDefault(); startCurio(input); }}
            className="max-w-2xl mx-auto px-4 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2 rounded-full border-2 border-border bg-surface-secondary shadow-md px-4 py-1.5">
              <Sparkles className="h-5 w-5 text-accent-brand shrink-0" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                aria-label="Ask a question"
                className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-tertiary text-base py-2"
              />
              <button type="button" onClick={toggleMic} aria-label="Voice input" className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary">
                {listening ? <MicOff className="h-5 w-5 text-accent-error" /> : <Mic className="h-5 w-5" />}
              </button>
              <button type="button" onClick={() => startCurio(SURPRISES[Math.floor(Math.random() * SURPRISES.length)])} aria-label="Surprise me" className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary">
                <Shuffle className="h-5 w-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send question"
              className="h-14 w-14 shrink-0 rounded-full bg-accent-brand text-text-inverse flex items-center justify-center disabled:opacity-40 shadow-glow"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
        </div>
      )}

      {/* ---------- sparks burst ---------- */}
      <AnimatePresence>
        {burst && (
          <motion.div
            key={burst.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -28, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="fixed top-16 right-4 z-50 pointer-events-none"
          >
            <div className="px-3 py-1.5 rounded-full bg-accent-warning text-text-inverse font-black text-sm flex items-center gap-1 shadow-xl">
              <Zap className="h-4 w-4" /> +{burst.n}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- trophy shelf ---------- */}

      <AnimatePresence>
        {shelfOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface-overlay/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShelfOpen(false)}
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
                <button onClick={() => setShelfOpen(false)} aria-label="Close" className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {p.trophies.length === 0 ? (
                <p className="text-text-tertiary text-sm">Finish a Make Mode challenge to earn your first trophy.</p>
              ) : (
                <div className="grid gap-3">
                  {p.trophies.map((t) => (
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
        )}
      </AnimatePresence>

      {/* ---------- badge pop ---------- */}
      <AnimatePresence>
        {p.badgePop && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-28 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="px-4 py-3 rounded-2xl bg-accent-warning/95 text-text-inverse font-black flex items-center gap-2 shadow-xl">
              <Award className="h-5 w-5" /> Badge unlocked: {p.badgePop.emoji} {p.badgePop.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurioCanvas;
