
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LearningTopic, LearningSection } from '@/types/wonderwhiz';
import { toast } from 'sonner';

interface SimplifiedSectionViewerProps {
  topic: LearningTopic;
  sectionIndex: number;
  childAge: number;
  childProfile: any;
  onSectionComplete: () => void;
  onBackToTOC: () => void;
}

const SimplifiedSectionViewer: React.FC<SimplifiedSectionViewerProps> = ({
  topic,
  sectionIndex,
  childAge,
  childProfile,
  onSectionComplete,
  onBackToTOC
}) => {
  const [section, setSection] = useState<LearningSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  const currentSection = topic.table_of_contents[sectionIndex];
  const isYoungChild = childAge <= 8;

  useEffect(() => {
    generateSectionContent();
  }, [sectionIndex]);

  const generateSectionContent = async () => {
    setLoading(true);
    
    try {
      // Check if section already exists
      const { data: existingSection } = await supabase
        .from('learning_sections')
        .select('*')
        .eq('topic_id', topic.id)
        .eq('section_number', sectionIndex + 1)
        .single();

      if (existingSection) {
        const convertedSection: LearningSection = {
          ...existingSection,
          facts: Array.isArray(existingSection.facts) ? existingSection.facts as string[] : []
        };
        setSection(convertedSection);
        
        // Auto-generate image for visual appeal
        if (!convertedSection.image_url) {
          generateImage();
        }
      } else {
        // Generate new section content
        const { data, error } = await supabase.functions.invoke('generate-section-content', {
          body: {
            topicId: topic.id,
            sectionTitle: currentSection.title,
            sectionNumber: sectionIndex + 1,
            childAge: childAge,
            topicTitle: topic.title
          }
        });

        if (error) throw error;

        const convertedSection: LearningSection = {
          ...data,
          facts: Array.isArray(data.facts) ? data.facts as string[] : []
        };
        setSection(convertedSection);
        
        // Auto-generate image
        generateImage();
      }
    } catch (error) {
      console.error('Error generating section:', error);
      
      // Create simple fallback content
      const fallbackSection: LearningSection = {
        id: `fallback-${Date.now()}`,
        topic_id: topic.id,
        section_number: sectionIndex + 1,
        title: currentSection.title,
        content: `Welcome to "${currentSection.title}"! 

${currentSection.description || 'This section covers fascinating aspects of the subject.'}

This topic connects to many other areas of knowledge and has real-world applications. By learning about this, you're developing your understanding of the world around you.

Keep exploring and asking questions - that's how great discoveries are made!`,
        word_count: 100,
        facts: [
          "This topic is studied by scientists around the world",
          "New discoveries are made about this subject regularly",
          "This knowledge helps us understand our world better"
        ],
        story_mode_content: null,
        image_url: null,
        image_generated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setSection(fallbackSection);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!section) return;
    
    setImageLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-section-image', {
        body: {
          section_title: section.title,
          section_content: section.content.substring(0, 500),
          child_age: childAge
        }
      });

      if (!error && data?.image_url) {
        setSection(prev => prev ? { ...prev, image_url: data.image_url, image_generated: true } : null);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await supabase.rpc('award_learning_points', {
        child_id_param: childProfile.id,
        topic_id_param: topic.id,
        points_param: 10,
        reason_param: `Completed section: ${currentSection.title}`
      });
      
      toast.success(isYoungChild ? "Awesome! +10 Wonder Points! ⭐" : "Great work! +10 Wonder Points! ⭐");
    } catch (error) {
      console.error('Error awarding points:', error);
    }
    
    onSectionComplete();
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink mx-auto mb-4"></div>
        <p className="text-white/80 text-lg">
          {isYoungChild 
            ? "Creating something magical for you... ✨" 
            : "Preparing your content... 🚀"
          }
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onBackToTOC}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contents
        </Button>
        
        <div className="text-white/70 text-sm">
          Section {sectionIndex + 1} of {topic.table_of_contents.length}
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/20 p-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">{section?.title}</h1>
          <p className="text-white/70 text-lg">
            {currentSection.description}
          </p>
        </div>

        {/* Generated Image */}
        {(section?.image_url || imageLoading) && (
          <div className="mb-8">
            {imageLoading ? (
              <div className="aspect-[16/9] bg-gradient-to-r from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 rounded-lg flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink mx-auto mb-2"></div>
                  <p className="text-white/70 text-sm">Creating visual content... 🎨</p>
                </div>
              </div>
            ) : (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={section?.image_url}
                alt={section?.title}
                className="w-full aspect-[16/9] object-cover rounded-lg"
              />
            )}
          </div>
        )}

        {/* Content */}
        {section && (
          <div className="prose prose-invert max-w-none">
            <div className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap mb-8">
              {section.content}
            </div>

            {/* Fun Facts */}
            {section.facts && section.facts.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-lg border border-yellow-400/20">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {isYoungChild ? "Cool Facts! 🤩" : "Did You Know? 🧠"}
                </h3>
                <ul className="space-y-3">
                  {section.facts.map((fact, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-white/80 flex items-start gap-3"
                    >
                      <span className="text-yellow-400 text-xl">•</span>
                      <span>{fact}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            📖 {section?.word_count || 0} words • ⏱️ ~{Math.ceil((section?.word_count || 0) / 200)} min read
          </div>
          
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {isYoungChild ? "I'm Done! 🎉" : "Complete Section"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SimplifiedSectionViewer;
