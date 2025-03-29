
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import ParticleEffect from '@/components/ParticleEffect';
import { Star, Lightbulb, BookOpen, ArrowRight } from 'lucide-react';

const Demo = () => {
  const demoCards = [
    {
      icon: <Star className="h-8 w-8 text-wonderwhiz-gold" />,
      name: "Nova",
      title: "The Explorer",
      description: "Discover amazing facts about animals, space, and our world",
      color: "from-blue-500/20 to-purple-500/20",
      delay: 0.2
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-wonderwhiz-gold" />,
      name: "Spark",
      title: "The Scientist",
      description: "Test your knowledge with fun quizzes and experiments",
      color: "from-orange-500/20 to-amber-500/20",
      delay: 0.4
    },
    {
      icon: <BookOpen className="h-8 w-8 text-wonderwhiz-gold" />,
      name: "Prism",
      title: "The Artist",
      description: "Express yourself through drawing and creative challenges",
      color: "from-pink-500/20 to-rose-500/20",
      delay: 0.6
    }
  ];
  
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient overflow-x-hidden">
      <Helmet>
        <title>WonderWhiz Demo</title>
        <meta name="description" content="See WonderWhiz in action with our interactive demo. Experience how we transform screen time into learning time." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="low" />
      <Navbar />
      <main className="py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Experience WonderWhiz</h1>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              Get a sneak peek of how WonderWhiz transforms screen time into an interactive learning adventure
            </p>
          </motion.div>
          
          <motion.div
            className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Meet Your Curio Specialists</h2>
              <p className="text-gray-300">
                These friendly guides will help your child explore different subjects and interests
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoCards.map((card, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${card.color} backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay, duration: 0.5 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-white/10 mb-4 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{card.name}</h3>
                    <p className="text-wonderwhiz-gold mb-3 text-sm">{card.title}</p>
                    <p className="text-gray-300 text-sm mb-4">{card.description}</p>
                    <button className="mt-auto text-sm text-wonderwhiz-blue flex items-center hover:text-wonderwhiz-pink transition-colors">
                      Coming soon <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Interactive Demo Preview</h2>
              <p className="text-gray-300 mb-6">
                Our full interactive demo is coming soon! Subscribe to be the first to try it.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-pink"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Notify Me
                </button>
              </form>
            </div>
            
            <div className="h-48 md:h-64 relative bg-wonderwhiz-dark flex items-center justify-center">
              <div className="text-center max-w-md mx-auto px-6">
                <p className="text-xl font-bold mb-2">Demo Video Coming Soon</p>
                <p className="text-sm text-gray-400">Our team is creating an amazing interactive walkthrough of the WonderWhiz experience</p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-wonderwhiz-purple/10 animate-pulse-gentle"></div>
              <div className="absolute bottom-6 right-8 w-12 h-12 rounded-full bg-wonderwhiz-pink/10 animate-float-gentle"></div>
              <div className="absolute top-1/2 left-1/3 w-8 h-8 rounded-full bg-wonderwhiz-gold/10 animate-bounce-gentle"></div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
