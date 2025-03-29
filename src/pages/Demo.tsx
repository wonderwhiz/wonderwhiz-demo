
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Demo = () => {
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>WonderWhiz Demo</title>
        <meta name="description" content="See WonderWhiz in action with our interactive demo. Experience how we transform screen time into learning time." />
      </Helmet>
      
      <Navbar />
      <main className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">WonderWhiz Demo</h1>
          <p className="text-xl text-gray-200 mb-8">
            Coming soon! We're working on an interactive demo.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
