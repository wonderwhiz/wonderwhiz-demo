
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

const testimonials = [
  {
    quote: "WonderWhiz has completely transformed how my child uses screen time. Instead of mindless videos, they're exploring science and asking thoughtful questions!",
    author: "Michelle K.",
    role: "Parent of 8-year-old",
    image: "https://i.pravatar.cc/150?img=48",
    stars: 5
  },
  {
    quote: "My daughter loves the 'sparks' system. She's motivated to complete educational tasks and feels proud when she earns rewards for learning.",
    author: "David T.",
    role: "Parent of 10-year-old",
    image: "https://i.pravatar.cc/150?img=33",
    stars: 5
  },
  {
    quote: "As a busy parent, I appreciate the weekly summaries that show me what topics my child has been exploring. It's a great conversation starter at dinner!",
    author: "Sarah L.",
    role: "Parent of 7-year-old",
    image: "https://i.pravatar.cc/150?img=5",
    stars: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-wonderwhiz-gold opacity-10 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-wonderwhiz-pink opacity-10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <Sparkles className="h-12 w-12 text-wonderwhiz-gold opacity-70" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Loved by Families Worldwide
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Hear from parents who've seen their children's curiosity bloom with WonderWhiz.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-8 border border-wonderwhiz-purple border-opacity-30 hover:border-opacity-50 transition-all hover:transform hover:scale-[1.02] relative overflow-hidden"
            >
              {/* Decorative corner elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-wonderwhiz-purple to-transparent opacity-20"></div>
              
              <div className="flex mb-4 gap-1">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-wonderwhiz-gold fill-current" />
                ))}
              </div>
              <p className="text-gray-200 mb-6">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-wonderwhiz-purple/30 mr-4">
                  <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
