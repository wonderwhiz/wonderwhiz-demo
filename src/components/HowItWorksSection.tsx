
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const steps = [{
  number: '01',
  title: 'Create a parent account',
  description: 'Sign up in minutes. Set your preferences and create a safe space for your child to explore.',
  color: 'from-wonderwhiz-pink to-purple-500'
}, {
  number: '02',
  title: 'Set up child profiles',
  description: 'Create personalized profiles for each child with age-appropriate settings and interests.',
  color: 'from-wonderwhiz-blue to-blue-500'
}, {
  number: '03',
  title: 'Watch curiosity bloom',
  description: 'Let your child explore topics they love while discovering new interests along the way.',
  color: 'from-wonderwhiz-gold to-yellow-400'
}];

const HowItWorksSection = () => {
  return <section className="py-20 px-6 md:px-10 lg:px-20 bg-wonderwhiz-gradient">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            How WonderWhiz Works
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Getting started is simple. In just a few steps, your child can begin their journey of discovery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: index * 0.2
        }} className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-8 border border-wonderwhiz-purple border-opacity-30 relative overflow-hidden group">
              <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br ${step.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative z-10">
                <span className={`text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${step.color}`}>
                  {step.number}
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-3 text-white">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>)}
        </div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }} className="text-center mt-16">
          <p className="text-lg text-wonderwhiz-blue mb-8">Ready to transform screen time into growth time?</p>
          <Link to="/register" className="inline-block">
            <button className="jelly-button text-lg px-10 py-4">Try WonderWhiz</button>
          </Link>
        </motion.div>
      </div>
    </section>;
};

export default HowItWorksSection;
