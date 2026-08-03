import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, Sprout } from 'lucide-react';
import tablet from '@/assets/landing-tablet.jpg';

const items = [
  {
    icon: Compass,
    title: 'Personalized curiosity feed',
    body: 'A path shaped around what fascinates your child.',
  },
  {
    icon: Heart,
    title: 'Memorable stories',
    body: 'Ideas children can connect, revisit, and remember.',
  },
  {
    icon: Sprout,
    title: 'Real-world skills',
    body: 'Curiosity, communication, and confidence grow together.',
  },
];

const LandingWay: React.FC = () => (
  <section id="parents" className="bg-land-cream py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-land-coral">
            The WonderWhiz way
          </p>
          <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-land-ink sm:text-5xl">
            Learning that sparks a lifetime.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-text-secondary">
            WonderWhiz adapts to your child's interests and language, turning every "why?" into a
            path of discovery they can follow at their own pace.
          </p>
          <a
            href="#how-it-works"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-land-navy px-7 py-3.5 text-sm font-extrabold text-text-inverse transition-transform hover:scale-[1.03]"
          >
            Why it works <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <img
          src={tablet}
          alt="Child exploring a learning activity on a tablet"
          loading="lazy"
          width={1024}
          height={768}
          className="w-full rounded-[32px] object-cover shadow-xl"
        />
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-[28px] bg-surface-secondary p-7 shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-land-coral/12">
              <Icon className="h-6 w-6 text-land-coral" />
            </span>
            <h3 className="mt-5 font-heading text-xl font-extrabold text-land-ink">{title}</h3>
            <p className="mt-2 text-base leading-relaxed text-text-secondary">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingWay;
