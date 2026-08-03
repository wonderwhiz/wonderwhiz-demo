import React from 'react';
import storytime from '@/assets/landing-storytime.jpg';
import building from '@/assets/landing-building.jpg';
import robot from '@/assets/landing-robot.jpg';

const LandingAdventures: React.FC = () => (
  <section id="adventures" className="bg-surface-primary py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <p className="text-sm font-extrabold uppercase tracking-widest text-land-coral">
        Follow the spark
      </p>
      <h2 className="mt-4 max-w-2xl font-heading text-4xl font-extrabold leading-tight text-land-ink sm:text-5xl">
        An adventure for every curious mind.
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
        WonderWhiz connects questions, stories, challenges, and parent insight in one evolving
        experience.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[32px] bg-land-navy p-7 lg:row-span-2">
          <img
            src={robot}
            alt="WonderWhiz robot guide"
            loading="lazy"
            width={768}
            height={1024}
            className="w-full rounded-3xl object-cover"
          />
          <p className="mt-6 text-xs font-extrabold uppercase tracking-widest text-land-yellow">
            Explore
          </p>
          <h3 className="mt-2 font-heading text-2xl font-extrabold text-text-inverse">
            Curiosity feed
          </h3>
          <p className="mt-2 text-base text-text-inverse/80">
            A stream that evolves with every new interest.
          </p>
        </div>

        <div className="rounded-[32px] bg-land-yellow p-7">
          <h3 className="font-heading text-2xl font-extrabold text-land-ink">Sparks & streaks</h3>
          <p className="mt-2 text-base text-land-ink/80">
            Gentle rewards that make discovery feel exciting.
          </p>
        </div>

        <div className="rounded-[32px] bg-land-cream p-7">
          <h3 className="font-heading text-2xl font-extrabold text-land-ink">Parent dashboard</h3>
          <p className="mt-2 text-base text-text-secondary">
            See interests, progress, and ideas for offline activities.
          </p>
        </div>

        <div className="overflow-hidden rounded-[32px] bg-surface-secondary shadow-md">
          <img
            src={storytime}
            alt="Child reading with a friendly dinosaur"
            loading="lazy"
            width={768}
            height={640}
            className="h-44 w-full object-cover"
          />
          <div className="p-7">
            <h3 className="font-heading text-2xl font-extrabold text-land-ink">
              Rabbit-hole learning
            </h3>
            <p className="mt-2 text-base text-text-secondary">
              Follow one fascinating question into the next.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] bg-surface-secondary shadow-md">
          <img
            src={building}
            alt="Child building a colorful robot bridge"
            loading="lazy"
            width={768}
            height={768}
            className="h-44 w-full object-cover"
          />
          <div className="p-7">
            <h3 className="font-heading text-2xl font-extrabold text-land-ink">
              Hands-on missions
            </h3>
            <p className="mt-2 text-base text-text-secondary">
              Turn ideas into playful projects and challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default LandingAdventures;
