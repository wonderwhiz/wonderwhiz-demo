
import React from 'react';
import HeroContent from './hero/HeroContent';
import HeroPhoneMockup from './hero/HeroPhoneMockup';

const HeroSection = () => {
  return (
    <section className="pt-10 pb-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <HeroContent />
        <HeroPhoneMockup />
      </div>
    </section>
  );
};

export default HeroSection;
