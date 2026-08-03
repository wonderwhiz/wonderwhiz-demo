import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Palette, Sparkles } from 'lucide-react';
import robot from '@/assets/landing-robot.jpg';
import building from '@/assets/landing-building.jpg';
import storytime from '@/assets/landing-storytime.jpg';

const stars = Array.from({ length: 60 }, (_, i) => ({
  top: `${(i * 37) % 100}%`,
  left: `${(i * 61) % 100}%`,
  size: (i % 3) + 2,
}));

const LandingHero: React.FC = () => (
  <section className="relative overflow-hidden pb-16 pt-6 sm:pb-24">
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-land-yellow/60"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
        />
      ))}
    </div>

    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-text-inverse ring-1 ring-white/20">
          <Sparkles className="h-4 w-4 text-land-yellow" />
          AI-powered adventures for curious minds
        </span>

        <h1 className="mt-6 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-text-inverse sm:text-6xl xl:text-7xl">
          Turn screen time into personalized learning.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-inverse/80">
          WonderWhiz turns every question into a personalized, curiosity-led adventure — with adaptive
          answers, Sparks, and progress parents can follow.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-land-yellow px-8 py-4 text-base font-extrabold text-land-ink shadow-xl transition-transform hover:scale-[1.03]"
          >
            Start free adventure
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 text-base font-extrabold text-text-inverse ring-1 ring-white/25 transition-colors hover:bg-white/15"
          >
            See how it works
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-semibold text-text-inverse/75">
          <span className="inline-flex items-center gap-2">
            <Brain className="h-4 w-4 text-land-mint" /> Adaptive answers
          </span>
          <span className="inline-flex items-center gap-2">
            <Palette className="h-4 w-4 text-land-yellow" /> Creative discovery
          </span>
        </div>
      </div>

      {/* collage */}
      <div className="relative mx-auto w-full max-w-xl">
        <div className="relative mx-auto w-[68%] rounded-[32px] bg-land-coral p-4 shadow-2xl">
          <p className="text-center font-heading text-2xl font-extrabold text-text-inverse">
            Discover your world
          </p>
          <img
            src={robot}
            alt="Friendly WonderWhiz robot guide holding a tablet"
            width={768}
            height={1024}
            className="mt-3 w-full rounded-3xl object-cover"
          />
        </div>

        <div className="absolute -left-2 top-10 w-44 rounded-3xl bg-surface-secondary p-4 shadow-xl sm:-left-8">
          <p className="text-xs font-bold text-text-tertiary">Skill Sparks</p>
          <ul className="mt-2 space-y-1.5 text-sm font-bold text-text-primary">
            <li>🎨 Creativity</li>
            <li>🧩 Problem solving</li>
            <li>💬 Communication</li>
          </ul>
        </div>

        <div className="absolute -right-2 -top-2 w-40 rounded-3xl bg-surface-secondary p-2 shadow-xl sm:-right-6">
          <img
            src={storytime}
            alt="Child reading with a friendly dinosaur"
            loading="lazy"
            width={768}
            height={640}
            className="w-full rounded-2xl object-cover"
          />
        </div>

        <div className="absolute -left-2 bottom-6 w-40 rounded-3xl bg-surface-secondary p-2 shadow-xl sm:-left-10">
          <img
            src={building}
            alt="Child building a colorful robot bridge"
            loading="lazy"
            width={768}
            height={768}
            className="w-full rounded-2xl object-cover"
          />
        </div>

        <div className="absolute -right-2 top-1/2 w-48 rounded-3xl bg-surface-secondary p-4 shadow-xl sm:-right-8">
          <p className="text-xs font-bold text-text-tertiary">Choose your quest</p>
          <div className="mt-2 flex gap-2 text-xs font-bold text-text-primary">
            <span className="rounded-lg bg-land-cream px-2.5 py-1.5">Science</span>
            <span className="rounded-lg bg-land-sky px-2.5 py-1.5">Art</span>
            <span className="rounded-lg bg-land-mint px-2.5 py-1.5">Math</span>
          </div>
        </div>

        <div className="absolute -bottom-4 right-2 rounded-2xl bg-land-yellow px-4 py-3 shadow-xl sm:right-0">
          <p className="text-xs font-bold text-land-ink">Great job, explorer!</p>
          <p className="font-heading text-lg font-extrabold text-land-ink">+50 Sparks</p>
        </div>
      </div>
    </div>
  </section>
);

export default LandingHero;
