import React from 'react';
import { Helmet } from 'react-helmet-async';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LandingWay from '@/components/landing/LandingWay';
import LandingAdventures from '@/components/landing/LandingAdventures';
import LandingSteps from '@/components/landing/LandingSteps';
import LandingFooter from '@/components/landing/LandingFooter';

const Index: React.FC = () => (
  <div className="min-h-screen overflow-x-hidden bg-land-navy">
    <Helmet>
      <title>WonderWhiz — Turn screen time into personalized learning</title>
      <meta
        name="description"
        content="WonderWhiz turns every question into a personalized, curiosity-led adventure for kids, with adaptive answers, Sparks and progress parents can follow."
      />
      <meta property="og:title" content="WonderWhiz — Turn screen time into personalized learning" />
      <meta
        property="og:description"
        content="AI-powered adventures for curious minds: adaptive answers, Sparks, and progress parents can follow."
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>

    <LandingNav />
    <main>
      <LandingHero />
      <LandingWay />
      <LandingAdventures />
      <LandingSteps />
    </main>
    <LandingFooter />
  </div>
);

export default Index;
