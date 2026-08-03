import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'Create a parent account',
    body: 'Set up a safe place for your family to explore.',
  },
  {
    n: '02',
    title: 'Add child profiles',
    body: 'Choose age-appropriate settings and interests for each child.',
  },
  {
    n: '03',
    title: 'Watch curiosity bloom',
    body: 'Let every question open a new path of discovery.',
  },
];

const LandingSteps: React.FC = () => (
  <section id="how-it-works" className="bg-land-cream py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
      <p className="text-sm font-extrabold uppercase tracking-widest text-land-coral">
        Three simple steps
      </p>
      <h2 className="mt-4 font-heading text-4xl font-extrabold text-land-ink sm:text-5xl">
        How WonderWhiz works
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
        Create a safe learning space, personalize it, and let your child's questions lead the way.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-[28px] bg-surface-secondary p-8 text-left shadow-md">
            <span className="font-heading text-4xl font-extrabold text-land-yellow">{s.n}</span>
            <h3 className="mt-4 font-heading text-xl font-extrabold text-land-ink">{s.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-text-secondary">{s.body}</p>
          </div>
        ))}
      </div>

      <Link
        to="/register"
        className="mt-12 inline-flex items-center gap-2 rounded-full bg-land-navy px-8 py-4 text-base font-extrabold text-text-inverse transition-transform hover:scale-[1.03]"
      >
        Try WonderWhiz <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  </section>
);

export default LandingSteps;
