
import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "WonderWhiz has completely transformed how my child uses screen time. Instead of mindless videos, they're exploring science and asking thoughtful questions!",
    author: "Michelle K.",
    role: "Parent of 8-year-old",
    image: "https://via.placeholder.com/64",
    stars: 5
  },
  {
    quote: "My daughter loves the 'sparks' system. She's motivated to complete educational tasks and feels proud when she earns rewards for learning.",
    author: "David T.",
    role: "Parent of 10-year-old",
    image: "https://via.placeholder.com/64",
    stars: 5
  },
  {
    quote: "As a busy parent, I appreciate the weekly summaries that show me what topics my child has been exploring. It's a great conversation starter at dinner!",
    author: "Sarah L.",
    role: "Parent of 7-year-old",
    image: "https://via.placeholder.com/64",
    stars: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
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
              className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-8 border border-wonderwhiz-purple border-opacity-30 hover:border-opacity-50 transition-all hover:transform hover:scale-[1.02]"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-wonderwhiz-gold fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-200 mb-6">{testimonial.quote}</p>
              <div className="flex items-center">
                <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4" />
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
