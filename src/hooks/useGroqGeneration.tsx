import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  childAge?: number;
}

export function useGroqGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuickAnswer = async (query: string, childAge: number = 10): Promise<string> => {
    if (!query) return '';
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Adjust query based on child's age to get age-appropriate content
      let enhancedQuery = query;
      
      // Add age context for better age-appropriate answers
      if (!query.toLowerCase().includes("year old") && !query.toLowerCase().includes("age")) {
        enhancedQuery = `${query} (tailored for a ${childAge}-year-old's understanding)`;
      }
      
      // For ocean or space-related queries, enhance them for better answers
      const isOceanQuery = query.toLowerCase().includes('ocean') || 
                           query.toLowerCase().includes('sea') ||
                           query.toLowerCase().includes('marine') ||
                           query.toLowerCase().includes('underwater');
                           
      const isSpaceQuery = query.toLowerCase().includes('space') || 
                           query.toLowerCase().includes('planet') ||
                           query.toLowerCase().includes('star') ||
                           query.toLowerCase().includes('universe');
      
      if ((isOceanQuery || isSpaceQuery) && query.length < 30) {
        if (isOceanQuery) {
          enhancedQuery = `Explain fascinating ocean mysteries and deep sea phenomena for ${childAge}-year-old children`;
        } else if (isSpaceQuery) {
          enhancedQuery = `Explain fascinating space and astronomy facts for ${childAge}-year-old children`;
        }
      }
      
      const { data, error } = await supabase.functions.invoke('generate-quick-answer', {
        body: { 
          query: enhancedQuery,
          childAge
        }
      });
      
      if (error) throw new Error(error.message);
      
      return data?.answer || generateFallbackAnswer(query);
    } catch (err) {
      console.error('Error generating quick answer:', err);
      setError('Failed to generate quick answer');
      
      // Silent error, no toast for better UX
      return generateFallbackAnswer(query);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContextualImage = async (topic: string, childAge: number = 10): Promise<string> => {
    if (!topic) {
      console.error('Topic is required for image generation');
      return getFallbackImage('ocean');
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log(`Generating image for topic: ${topic}, childAge: ${childAge}`);
      
      const { data, error } = await supabase.functions.invoke('generate-contextual-image', {
        body: { 
          topic,
          style: "educational illustration, minimalist style",
          childAge
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }
      
      if (!data || !data.imageUrl) {
        console.error('No image URL returned');
        throw new Error('No image URL returned');
      }
      
      return data.imageUrl || getFallbackImage(topic);
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image');
      
      // Silent error handling, no toast for better UX
      return getFallbackImage(topic);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateFallbackAnswer = (query: string): string => {
    const isOceanTopic = query.toLowerCase().includes('ocean') || 
                         query.toLowerCase().includes('sea') || 
                         query.toLowerCase().includes('marine') ||
                         query.toLowerCase().includes('underwater');
                         
    if (isOceanTopic) {
      return "The ocean is Earth's last great frontier! Covering over 70% of our planet, oceans are home to millions of species, from microscopic plankton to enormous whales. Scientists estimate we've explored less than 20% of this vast underwater world. Ocean mysteries include deep sea creatures with bioluminescence, underwater volcanoes, and complex current systems that regulate our climate.";
    }
    
    const fallbacks = {
      ocean: "The ocean is Earth's last great frontier! Covering over 70% of our planet, oceans are home to millions of species, from microscopic plankton to enormous whales. Scientists estimate we've explored less than 20% of this vast underwater world.",
      volcano: "Volcanoes are Earth's natural pressure valves! They form when hot magma from deep underground rises to the surface. While they can be destructive, volcanoes create new land and release minerals that enrich the soil for plants.",
      space: "Space is an endless frontier of discovery! From distant galaxies to mysterious black holes, our universe contains billions of stars and planets. The light we see from some stars has traveled for millions of years to reach Earth.",
      dinosaur: "Dinosaurs ruled Earth for over 165 million years! These fascinating creatures came in all shapes and sizes, from tiny chicken-sized predators to massive plant-eaters longer than three school buses. Scientists learn about them through fossils preserved in rock.",
      robot: "Robots are machines programmed to perform tasks automatically! They range from simple factory robots that assemble cars to advanced AI systems that can learn and make decisions. Engineers are constantly improving robot capabilities.",
      weather: "Weather is the condition of the atmosphere at a specific time and place. It includes temperature, humidity, wind, clouds, and precipitation. Weather patterns are created by the interaction of the sun's energy with Earth's atmosphere and surface.",
      animal: "Animals are incredible in their diversity! From tiny insects to massive whales, they've evolved amazing adaptations to survive in virtually every environment on Earth. Scientists estimate there may be up to 10 million animal species!",
      plant: "Plants are essential for all life on Earth! They produce oxygen through photosynthesis, provide food and habitats for animals, and help regulate the climate. From tiny mosses to massive sequoia trees, plants have evolved incredible adaptations.",
      human: "Humans are remarkable for their capacity to think, create, and adapt. Our unique abilities to use complex language, create art, develop technology, and work together in large societies have allowed us to thrive in environments across the planet."
    };
    
    const queryLower = query.toLowerCase();
    const relevantTopic = Object.keys(fallbacks).find(topic => 
      queryLower.includes(topic)
    );
    
    if (relevantTopic) {
      return fallbacks[relevantTopic];
    }
    
    return `${query} is a fascinating topic to explore! As you journey through this exploration, you'll discover key facts, understand important concepts, and engage with fun activities that will deepen your knowledge.`;
  };
  
  const getFallbackImage = (topic: string): string => {
    const fallbackImages = {
      ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
      volcano: "https://images.unsplash.com/photo-1562117532-14a6c72858c9?q=80&w=1000&auto=format&fit=crop",
      space: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
      dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1000&auto=format&fit=crop",
      robot: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop",
      animal: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1000&auto=format&fit=crop",
      plant: "https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1000&auto=format&fit=crop",
      earth: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop"
    };
    
    const isOceanTopic = topic.toLowerCase().includes('ocean') || 
                         topic.toLowerCase().includes('sea') || 
                         topic.toLowerCase().includes('marine') ||
                         topic.toLowerCase().includes('underwater');
                         
    if (isOceanTopic) {
      return fallbackImages.ocean;
    }
    
    const topicLower = topic.toLowerCase();
    const relevantTopic = Object.keys(fallbackImages).find(key => 
      topicLower.includes(key)
    );
    
    return relevantTopic ? fallbackImages[relevantTopic] : fallbackImages.earth;
  };

  return {
    generateQuickAnswer,
    generateContextualImage,
    isGenerating,
    error
  };
}
