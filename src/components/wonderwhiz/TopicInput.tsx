
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LearningTopic, TableOfContentsItem } from '@/types/wonderwhiz';

interface TopicInputProps {
  childAge: number;
  childId: string;
  onTopicCreated: (topic: LearningTopic) => void;
}

const TopicInput: React.FC<TopicInputProps> = ({ childAge, childId, onTopicCreated }) => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const exampleTopics = [
    "How do dinosaurs become fossils? 🦕",
    "Why is the ocean blue? 🌊",
    "How do airplanes fly? ✈️",
    "What makes a rainbow? 🌈",
    "How do plants grow? 🌱",
    "Why do we dream? 😴"
  ];

  const generateTableOfContents = async (topic: string): Promise<TableOfContentsItem[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-topic-outline', {
        body: {
          topic,
          child_age: childAge
        }
      });

      if (error) throw error;
      return data.sections || [];
    } catch (error) {
      console.error('Error generating table of contents:', error);
      // Fallback table of contents
      return [
        { section_number: 1, title: "Introduction", description: `What is ${topic}?`, estimated_reading_time: 3, completed: false },
        { section_number: 2, title: "The Basics", description: `Understanding the fundamentals`, estimated_reading_time: 5, completed: false },
        { section_number: 3, title: "Amazing Facts", description: `Mind-blowing discoveries`, estimated_reading_time: 4, completed: false },
        { section_number: 4, title: "How It Works", description: `The science behind it`, estimated_reading_time: 6, completed: false },
        { section_number: 5, title: "Fun Examples", description: `Real-world examples`, estimated_reading_time: 4, completed: false }
      ];
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast.error("Please enter a topic you'd like to explore! 🤔");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate table of contents
      const tableOfContents = await generateTableOfContents(query);
      
      // Create learning topic in database
      const { data: topic, error } = await supabase
        .from('learning_topics')
        .insert({
          child_id: childId,
          title: query,
          description: `An exciting exploration of ${query} designed for curious minds!`,
          child_age: childAge,
          total_sections: tableOfContents.length,
          current_section: 0,
          status: 'planning',
          table_of_contents: tableOfContents
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Amazing! Let's start this learning adventure! 🚀");
      onTopicCreated(topic);
      
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error("Oops! Let's try that again. 🔄");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example.replace(/[🦕🌊✈️🌈🌱😴]/g, '').trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-wonderwhiz-bright-pink" />
            <h2 className="text-2xl font-bold text-white">
              What would you like to explore today?
            </h2>
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-white/80">
            Ask me anything! I'll create a personalized encyclopedia just for you! 📚✨
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            <Input
              type="text"
              placeholder="Type your question or topic here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleSubmit()}
              className="pl-12 pr-4 py-6 text-lg bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-wonderwhiz-bright-pink"
              disabled={isGenerating}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isGenerating || !query.trim()}
            size="lg"
            className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white font-bold text-lg py-6"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Your Encyclopedia... 
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Create My Learning Adventure!
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-white/70 mb-4 font-medium">
              💡 Need inspiration? Try these popular topics:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleTopics.map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExampleClick(example)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all text-left border border-white/10 hover:border-wonderwhiz-bright-pink/30"
                  disabled={isGenerating}
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            🎯 Each topic includes detailed sections, fun facts, quizzes, and activities!
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default TopicInput;
