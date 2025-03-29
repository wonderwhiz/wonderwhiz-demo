
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import ParticleEffect from '@/components/ParticleEffect';
import { Star, Check } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient overflow-x-hidden">
      <Helmet>
        <title>WonderWhiz Pricing</title>
        <meta name="description" content="View pricing plans for WonderWhiz - affordable options to transform your child's screen time into learning time." />
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
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">WonderWhiz Pricing</h1>
          
          <motion.div 
            className="bg-white/5 backdrop-filter backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Unlock the World of Wonder</h2>
              <p className="text-gray-300 max-w-lg mx-auto">We're creating magical pricing plans that work for every family. Stay tuned for our official launch!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Discovery",
                  price: "Free",
                  description: "Perfect for curious beginners",
                  features: ["Limited curios daily", "Basic interest tracking", "Single child profile"],
                  highlighted: false,
                  color: "from-wonderwhiz-blue/20 to-wonderwhiz-blue/5"
                },
                {
                  title: "Explorer",
                  price: "$6.99",
                  period: "monthly",
                  description: "Our most popular option",
                  features: ["Unlimited curios", "Advanced learning paths", "Up to 3 child profiles", "Parental insights", "Offline access"],
                  highlighted: true,
                  color: "from-wonderwhiz-pink/30 to-wonderwhiz-gold/20"
                },
                {
                  title: "Family",
                  price: "$12.99",
                  period: "monthly",
                  description: "For the whole family",
                  features: ["Everything in Explorer", "Unlimited child profiles", "Priority content updates", "Family challenges", "Advanced parental controls"],
                  highlighted: false,
                  color: "from-wonderwhiz-purple/20 to-wonderwhiz-pink/10"
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  className={`rounded-xl overflow-hidden relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.4, duration: 0.6 }}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-gold"></div>
                  )}
                  <div className={`h-full p-6 md:p-8 bg-gradient-to-b ${plan.color} backdrop-blur-sm border border-white/10`}>
                    {plan.highlighted && (
                      <div className="absolute -top-4 right-4">
                        <div className="bg-gradient-to-r from-wonderwhiz-gold to-wonderwhiz-pink text-xs font-bold px-3 py-1 rounded-full text-white shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-sm text-gray-300">/{plan.period}</span>}
                    </div>
                    <p className="text-sm text-gray-300 mb-6">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-wonderwhiz-gold mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      className={`w-full py-2.5 rounded-lg font-medium ${
                        plan.highlighted 
                          ? "bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-gold text-white" 
                          : "bg-white/10 hover:bg-white/20 text-white"
                      } transition-all`}
                    >
                      Coming Soon
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                <Star className="h-4 w-4 text-wonderwhiz-gold" />
                <span className="text-sm">All plans include a 7-day free trial</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
