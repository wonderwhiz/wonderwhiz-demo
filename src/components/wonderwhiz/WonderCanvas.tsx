import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send, Sparkles, BookOpen, Lightbulb, Compass, Check, X, Loader2 } from 'lucide-react';
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

type StreamingTurn = { question: string; card: WonderCard; streaming: boolean };

type Turn = StreamingTurn;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface Props {
  childProfile: { id: string; name: string; age: number | null };
  onBack: () => void;
}

const AGE_PROMPTS: Record<string, string[]> = {
  young: [
    'Why is the sky blue?',
    'How do bees make honey?',
    'Where do rainbows come from?',
    'Why do we sleep?',
  ],
  mid: [
    'How do black holes work?',
    'Why do we get goosebumps?',
    'How does the internet actually travel?',
    'Why do onions make us cry?',
  ],
  teen: [
    'How does CRISPR edit DNA?',
    'What causes déjà vu?',
    'How do neural networks learn?',
    'Why is time slower near gravity?',
  ],
};

const WonderCanvas: React.FC<Props> = ({ childProfile, onBack }) => {
  const age = childProfile.age ?? 10;
  const band = age <= 7 ? 'young' : age <= 11 ? 'mid' : 'teen';
  const isYoung = band === 'young';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [quizPicks, setQuizPicks] = useState<Record<number, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  const ask = async (q: string) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setInput('');
    const parentTopic = turns.length ? turns[turns.length - 1].card.title : undefined;

    const turnIndex = turns.length;
    setTurns((t) => [...t, { question: q, card: {}, streaming: true }]);

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
        }
      }

      // Final flush
      const finalCard = parsePartialJSON<WonderCard>(raw);
      setTurns((t) => {
        const copy = t.slice();
        if (copy[turnIndex]) copy[turnIndex] = { ...copy[turnIndex], card: finalCard || copy[turnIndex].card, streaming: false };
        return copy;
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Wonder is thinking too hard. Try again.');
      setTurns((t) => t.filter((_, i) => i !== turnIndex));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const empty = turns.length === 0 && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-surface-secondary/40">
      {/* Top bar */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Home
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Sparkles className="h-4 w-4 text-accent-brand" />
            Wonder · for {childProfile.name}
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div ref={scrollRef} className="max-w-3xl mx-auto px-4 sm:px-6 pb-40 pt-6 min-h-[calc(100vh-4rem)]">
        {empty && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-brand to-accent-info shadow-lg mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-3">
              {isYoung ? `Hi ${childProfile.name}! What are you wondering?` : `What do you want to understand today, ${childProfile.name}?`}
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Ask anything. I'll explain it clearly, share a few "wow" facts, and open new doors to explore.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-3 text-left">
              {AGE_PROMPTS[band].map((p) => (
                <button
                  key={p}
                  onClick={() => ask(p)}
                  className="group p-4 rounded-2xl bg-card/70 hover:bg-card border border-border/50 hover:border-accent-brand/50 transition-all text-text-primary"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-accent-brand mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{p}</span>
                  </div>
                </button>
              ))}
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
              onPick={(i) => setQuizPicks((p) => ({ ...p, [idx]: i }))}
              onAsk={ask}
              isYoung={isYoung}
            />
          ))}
          {loading && turns[turns.length - 1]?.card && !turns[turns.length - 1]?.card?.hook && (
            <div className="rounded-3xl bg-card/70 border border-border/50 shadow-lg overflow-hidden animate-pulse">
              <div className="px-6 pt-6 pb-4 border-b border-border/40 space-y-3">
                <div className="h-3 w-32 bg-white/10 rounded" />
                <div className="h-6 w-3/4 bg-white/10 rounded" />
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-11/12 bg-white/10 rounded" />
                <div className="h-4 w-4/5 bg-white/10 rounded" />
              </div>
              <div className="px-6 pb-5 flex items-center gap-2 text-text-tertiary text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-accent-brand" />
                Wonder is writing your answer…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <form
            onSubmit={(e) => { e.preventDefault(); ask(input); }}
            className="flex items-center gap-2 bg-card border border-border/60 rounded-2xl p-2 shadow-xl focus-within:border-accent-brand/60 focus-within:shadow-accent-brand/10 transition"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isYoung ? 'Ask me anything…' : 'What are you curious about?'}
              className="flex-1 bg-transparent px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none text-base"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-accent-brand to-accent-info text-white h-11 px-4"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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
  onPick: (i: number) => void;
  onAsk: (q: string) => void;
  isYoung: boolean;
}> = ({ turn, picked, onPick, onAsk, isYoung }) => {
  const { question, card } = turn;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      {/* User question */}
      <div className="flex justify-end">
        <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-accent-brand/15 border border-accent-brand/25 text-text-primary font-medium">
          {question}
        </div>
      </div>

      {/* Answer card */}
      <article className="rounded-3xl bg-card/90 border border-border/50 shadow-lg overflow-hidden">
        <header className="px-6 pt-6 pb-4 border-b border-border/40">
          <div className="text-xs uppercase tracking-widest text-accent-brand font-semibold mb-2">
            Wonder Card · {card.title}
          </div>
          <p className="text-lg sm:text-xl text-text-primary font-medium leading-snug italic">
            {card.hook}
          </p>
        </header>

        <div className="px-6 py-5 space-y-4 text-text-primary leading-relaxed text-[17px]">
          {card.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {card.wow_facts?.length > 0 && (
          <div className="px-6 py-5 bg-accent-info/5 border-t border-border/40">
            <div className="text-sm font-bold text-accent-info mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Whoa, really?
            </div>
            <ul className="space-y-2">
              {card.wow_facts.map((f, i) => (
                <li key={i} className="flex gap-3 text-text-primary">
                  <span className="text-accent-brand font-bold">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {card.vocab?.length > 0 && (
          <div className="px-6 py-5 border-t border-border/40">
            <div className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
              Words worth knowing
            </div>
            <dl className="grid sm:grid-cols-2 gap-3">
              {card.vocab.map((v, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-secondary/50">
                  <dt className="font-bold text-text-primary">{v.word}</dt>
                  <dd className="text-sm text-text-secondary mt-0.5">{v.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Quiz */}
        {card.quiz && (
          <div className="px-6 py-5 border-t border-border/40 bg-accent-brand/5">
            <div className="text-sm font-bold text-accent-brand mb-3 uppercase tracking-wider">
              Quick check
            </div>
            <p className="text-text-primary font-medium mb-3">{card.quiz.question}</p>
            <div className="space-y-2">
              {card.quiz.options.map((opt, i) => {
                const answered = picked !== undefined;
                const isCorrect = i === card.quiz.correct_index;
                const isPicked = picked === i;
                return (
                  <button
                    key={i}
                    disabled={answered}
                    onClick={() => onPick(i)}
                    className={[
                      'w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between',
                      !answered && 'bg-card hover:border-accent-brand/60 border-border/60',
                      answered && isCorrect && 'bg-emerald-500/10 border-emerald-500/50 text-text-primary',
                      answered && isPicked && !isCorrect && 'bg-red-500/10 border-red-500/50 text-text-primary',
                      answered && !isPicked && !isCorrect && 'opacity-60 border-border/40',
                    ].filter(Boolean).join(' ')}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <Check className="h-4 w-4 text-emerald-500" />}
                    {answered && isPicked && !isCorrect && <X className="h-4 w-4 text-red-500" />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {picked !== undefined && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-text-secondary italic"
                >
                  {picked === card.quiz.correct_index ? '✨ Nailed it — ' : 'Nice try — '}
                  {card.quiz.explanation}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Rabbit holes */}
        {card.rabbit_holes?.length > 0 && (
          <div className="px-6 py-5 border-t border-border/40">
            <div className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
              <Compass className="h-4 w-4" /> Follow your curiosity
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {card.rabbit_holes.map((r, i) => (
                <button
                  key={i}
                  onClick={() => onAsk(r)}
                  className="group text-left p-3 rounded-xl border border-border/50 hover:border-accent-brand/50 hover:bg-accent-brand/5 transition-all flex items-center justify-between gap-2"
                >
                  <span className="text-text-primary text-sm font-medium">{r}</span>
                  <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-accent-brand group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
};

export default WonderCanvas;
