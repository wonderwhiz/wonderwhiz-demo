
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Register = () => {
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>Sign Up for WonderWhiz</title>
        <meta name="description" content="Create your WonderWhiz account and start your child's journey of discovery and learning." />
      </Helmet>
      
      <Navbar />
      <main className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sign Up</h1>
          <p className="text-xl text-gray-200 mb-8 text-center">
            Coming soon! We're working on this page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
