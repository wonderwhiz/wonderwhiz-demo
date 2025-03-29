
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Rocket, Users, Award } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay, color }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  delay: number,
  color: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-${color} border-opacity-30 hover:border-opacity-60 group`}
    >
      <div className={`w-16 h-16 mb-6 rounded-2xl bg-${color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-wonderwhiz-pink" />,
      title: "AI-Powered Discovery",
      description: "Our intelligent system adapts to your child's interests and learning style, offering personalized content that grows with them.",
      color: "wonderwhiz-pink"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-wonderwhiz-blue" />,
      title: "Educational Content",
      description: "Curated by educators and child development experts, our content makes learning fun while building essential knowledge and skills.",
      color: "wonderwhiz-blue"
    },
    {
      icon: <Rocket className="w-8 h-8 text-wonderwhiz-gold" />,
      title: "Interactive Challenges",
      description: "Engaging quizzes, creative projects, and thought experiments that encourage active learning and critical thinking.",
      color: "wonderwhiz-gold"
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Parent Dashboard",
      description: "See what your child is exploring, track their progress, and get insights into their learning journey with simple, actionable reports.",
      color: "green-400"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-400" />,
      title: "Achievement System",
      description: "A motivating reward system that celebrates curiosity, persistence, and growth with digital badges and creative incentives.",
      color: "purple-400"
    },
  ];
  
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>WonderWhiz Features</title>
        <meta name="description" content="Explore the amazing features of WonderWhiz that make learning fun and engaging for children." />
      </Helmet>
      
      <Navbar />
      <main className="py-20 px-6 md:px-10 lg:px-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 -left-20 w-64 h-64 rounded-full bg-wonderwhiz-purple opacity-10 blur-3xl"></div>
        <div className="absolute bottom-40 -right-20 w-64 h-64 rounded-full bg-wonderwhiz-pink opacity-10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 relative"
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Sparkles className="h-12 w-12 text-wonderwhiz-gold opacity-70" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Discover WonderWhiz Features</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Here's how WonderWhiz makes learning magical for your child
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
                color={feature.color}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-20 text-center"
          >
            <p className="text-lg text-wonderwhiz-blue mb-8">Ready to transform how your child learns?</p>
            <button className="jelly-button text-lg px-10 py-4 group relative overflow-hidden">
              <span className="relative z-10">Join the waitlist</span>
              <span className="absolute inset-0 bg-white bg-opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
