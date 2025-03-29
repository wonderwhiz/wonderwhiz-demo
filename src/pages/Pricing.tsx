
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>WonderWhiz Pricing</title>
        <meta name="description" content="View pricing plans for WonderWhiz - affordable options to transform your child's screen time into learning time." />
      </Helmet>
      
      <Navbar />
      <main className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">WonderWhiz Pricing</h1>
          <p className="text-xl text-gray-200 mb-8">
            Coming soon! We're working on this page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
