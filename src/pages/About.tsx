
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import ParticleEffect from '@/components/ParticleEffect';
import { Heart, Users, Book, Code, Sparkles, Sun } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Alex Thompson",
      role: "Founder & CEO",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      color: "bg-wonderwhiz-pink/20"
    },
    {
      name: "Jamie Rivera",
      role: "Head of Education",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      color: "bg-wonderwhiz-purple/20"
    },
    {
      name: "Sam Chen",
      role: "Lead Developer",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      color: "bg-wonderwhiz-blue/20"
    }
  ];
  
  const values = [
    {
      icon: <Heart className="h-6 w-6 text-wonderwhiz-pink" />,
      title: "Child-First Design",
      description: "We build everything with children's wellbeing and joy at the center."
    },
    {
      icon: <Users className="h-6 w-6 text-wonderwhiz-gold" />,
      title: "Family Connection",
      description: "We strengthen bonds between parents and children through shared discovery."
    },
    {
      icon: <Book className="h-6 w-6 text-wonderwhiz-purple" />,
      title: "Learning Through Play",
      description: "We make education engaging, immersive, and naturally rewarding."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-wonderwhiz-blue" />,
      title: "Endless Curiosity",
      description: "We nurture the natural wonder and questions that drive lifelong learning."
    }
  ];
  
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient overflow-x-hidden">
      <Helmet>
        <title>About WonderWhiz</title>
        <meta name="description" content="Learn about WonderWhiz, our mission, and how we're transforming children's screen time into a journey of discovery." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="low" />
      <Navbar />
      <main className="py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-20">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple flex items-center justify-center">
                <Sun className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Our Story</h1>
            
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              WonderWhiz was born from a simple question: <span className="italic">What if screen time could nurture a child's natural curiosity instead of dulling it?</span>
            </p>
          </div>
          
          <motion.div 
            className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-300 mb-6">
                  At WonderWhiz, we're transforming how children interact with technology. We believe screen time should be a doorway to discovery, not a dead end of passive consumption.
                </p>
                <p className="text-gray-300">
                  Our platform adapts to each child's unique interests, creating personalized learning journeys that feel like play but build critical thinking skills and nurture natural curiosity.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-pink/30 to-wonderwhiz-purple/30 backdrop-blur-sm flex items-center justify-center text-center p-6">
                  <p className="text-xl font-bold">Coming soon: Our "Why We Built This" video</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                >
                  <div className="flex items-start">
                    <div className="p-3 rounded-lg bg-white/10 mr-4">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                      <p className="text-gray-300 text-sm">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                >
                  <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                    <div className={`absolute inset-0 ${member.color}`}></div>
                    <div className="absolute inset-1 rounded-full overflow-hidden">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-gray-300 text-sm">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
