import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const LandingFooter: React.FC = () => (
  <>
    <section className="bg-land-navy py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="font-heading text-4xl font-extrabold leading-tight text-text-inverse sm:text-5xl">
          Ready to spark your child's curiosity?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-inverse/80">
          Turn the next "why?" into a learning adventure they'll want to keep exploring.
        </p>
        <Link
          to="/register"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-land-yellow px-8 py-4 text-base font-extrabold text-land-ink shadow-xl transition-transform hover:scale-[1.03]"
        >
          Start free adventure <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    <footer className="bg-land-navy-deep py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:px-8 md:flex-row">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-land-yellow">
            <Sparkles className="h-4 w-4 text-land-ink" />
          </span>
          <span className="font-heading text-xl font-extrabold text-text-inverse">WonderWhiz</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-text-inverse/75">
          <a href="#adventures" className="hover:text-text-inverse">Adventures</a>
          <a href="#parents" className="hover:text-text-inverse">For parents</a>
          <a href="#how-it-works" className="hover:text-text-inverse">How it works</a>
          <Link to="/login" className="hover:text-text-inverse">Sign in</Link>
        </nav>
        <p className="text-sm text-text-inverse/60">© {new Date().getFullYear()} WonderWhiz</p>
      </div>
    </footer>
  </>
);

export default LandingFooter;
