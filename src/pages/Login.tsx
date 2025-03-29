
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import ParticleEffect from '@/components/ParticleEffect';

const Login = () => {
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient overflow-x-hidden">
      <Helmet>
        <title>Login to WonderWhiz | Access Your Child's Learning Journey</title>
        <meta name="description" content="Access your WonderWhiz account to manage your child's educational journey, track progress, and customize their learning experience with our adaptive AI platform." />
        <meta name="keywords" content="kids learning app login, educational platform sign in, children's education account, parent dashboard access" />
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Login</h1>
          <motion.div 
            className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              <div className="w-16 h-16 bg-wonderwhiz-purple/20 rounded-full flex items-center justify-center animate-pulse-gentle">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-wonderwhiz-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </motion.div>
              </div>
              <p className="text-xl text-gray-200 mb-2 text-center">
                Coming soon!
              </p>
              <p className="text-gray-300 text-center max-w-xs">
                We're creating a magical login experience for parents and children. Check back soon!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
