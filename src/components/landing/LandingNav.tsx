import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';

const links = [
  { label: 'Adventures', href: '#adventures' },
  { label: 'For parents', href: '#parents' },
  { label: 'How it works', href: '#how-it-works' },
];

const LandingNav: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-land-yellow">
            <Sparkles className="h-5 w-5 text-land-ink" />
          </span>
          <span className="font-heading text-2xl font-extrabold tracking-tight text-text-inverse">
            WonderWhiz
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-text-inverse/85 transition-colors hover:text-text-inverse"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Link to="/login" className="text-sm font-semibold text-text-inverse/85 hover:text-text-inverse">
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-land-coral px-6 py-3 text-sm font-bold text-text-inverse shadow-lg transition-transform hover:scale-[1.03]"
          >
            Start free adventure
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-text-inverse lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-5 mb-4 rounded-3xl bg-white/10 p-5 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-semibold text-text-inverse/90"
              >
                {l.label}
              </a>
            ))}
            <Link to="/login" className="text-base font-semibold text-text-inverse/90">
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-land-coral px-6 py-3 text-center text-base font-bold text-text-inverse"
            >
              Start free adventure
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNav;
