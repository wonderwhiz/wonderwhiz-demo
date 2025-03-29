
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import ParticleEffect from '@/components/ParticleEffect';

const Register = () => {
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient overflow-x-hidden">
      <Helmet>
        <title>Sign Up for WonderWhiz | Start Your Child's Learning Adventure</title>
        <meta name="description" content="Create a WonderWhiz account today and embark on a personalized learning journey for your child. Our AI-powered platform adapts to their interests and learning style." />
        <meta name="keywords" content="kids learning app sign up, children's educational platform register, create learning account, educational technology registration" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="low" />
      <Navbar />
      <main className="py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-20 flex items-center justify-center min-h-[60vh]">
        <motion.div 
          className="max-w-md w-full mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Sign Up</h1>
          <motion.div 
            className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              <div className="w-16 h-16 bg-wonderwhiz-gold/20 rounded-full flex items-center justify-center animate-pulse-gentle">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-wonderwhiz-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </motion.div>
              </div>
              <p className="text-xl text-gray-200 mb-2 text-center">
                Coming soon!
              </p>
              <p className="text-gray-300 text-center max-w-xs">
                We're designing a playful sign-up experience for families. Stay tuned for updates!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
