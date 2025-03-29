
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import WonderWhizLogo from './WonderWhizLogo';

const CTASection = () => {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-wonderwhiz-purple opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-wonderwhiz-pink opacity-10 blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-dark/50 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-wonderwhiz-purple/30 text-center"
        >
          <div className="flex justify-center mb-6">
            <WonderWhizLogo className="h-20 w-20" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to spark your child's curiosity?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of families who are transforming screen time into a journey of discovery, learning, and growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <button className="jelly-button text-lg px-10 py-4 w-full sm:w-auto">
                Join the waitlist
              </button>
            </Link>
            <Link to="/demo">
              <button className="bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-full px-10 py-4 text-white font-bold transition-all w-full sm:w-auto">
                See how it works
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
