
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Volume2, Sparkles, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LearningTopic, LearningSection } from '@/types/wonderwhiz';
import { toast } from 'sonner';

interface SectionViewerProps {
  topic: LearningTopic;
  sectionIndex: number;
  childAge: number;
  childProfile: any;
  onSectionComplete: () => void;
  onBackToTOC: () => void;
}

const SectionViewer: React.FC<SectionViewerProps> = ({
  topic,
  sectionIndex,
  childAge,
  childProfile,
  onSectionComplete,
  onBackToTOC
}) => {
  const [section, setSection] = useState<LearningSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingImage, setRequestingImage] = useState(false);
  const [showImagePermission, setShowImagePermission] = useState(false);

  const currentSection = topic.table_of_contents[sectionIndex];

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
        setSection(existingSection);
        setLoading(false);
        return;
      }

      // Generate new section content
      const { data, error } = await supabase.functions.invoke('generate-section-content', {
        body: {
          topic: topic.title,
          section_title: currentSection.title,
          section_description: currentSection.description,
          child_age: childAge,
          section_number: sectionIndex + 1
        }
      });

      if (error) throw error;

      // Save section to database
      const { data: newSection, error: saveError } = await supabase
        .from('learning_sections')
        .insert({
          topic_id: topic.id,
          section_number: sectionIndex + 1,
          title: currentSection.title,
          content: data.content,
          word_count: data.word_count,
          facts: data.facts || [],
          story_mode_content: data.story_mode_content
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setSection(newSection);
      
      // Show image permission after content loads
      setTimeout(() => {
        setShowImagePermission(true);
      }, 2000);

    } catch (error) {
      console.error('Error generating section:', error);
      toast.error("Let's try loading this section again! 🔄");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePermission = async (granted: boolean) => {
    setShowImagePermission(false);
    
    if (!granted || !section) return;

    setRequestingImage(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-section-image', {
        body: {
          section_title: section.title,
          section_content: section.content.substring(0, 500),
          child_age: childAge
        }
      });

      if (error) throw error;

      // Update section with image
      const { error: updateError } = await supabase
        .from('learning_sections')
        .update({
          image_url: data.image_url,
          image_generated: true
        })
        .eq('id', section.id);

      if (updateError) throw updateError;

      setSection(prev => prev ? { ...prev, image_url: data.image_url, image_generated: true } : null);
      toast.success("Beautiful image generated! 🎨");

    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Image generation failed, but that's okay! 😊");
    } finally {
      setRequestingImage(false);
    }
  };

  const handleComplete = async () => {
    // Award points for section completion
    try {
      await supabase.rpc('award_learning_points', {
        child_id_param: childProfile.id,
        topic_id_param: topic.id,
        points_param: 10,
        reason_param: `Completed section: ${currentSection.title}`
      });
      
      toast.success("Great work! +10 Wonder Points! ⭐");
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
        <p className="text-white/80">
          {childAge <= 8 
            ? "Creating something amazing for you... 🌟" 
            : "Generating detailed content tailored just for you... ✨"
          }
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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

      {/* Image Permission Modal */}
      {showImagePermission && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <Card className="bg-wonderwhiz-deep-purple/90 backdrop-blur-md border-wonderwhiz-purple/30 p-6 max-w-md">
            <div className="text-center">
              <Camera className="h-12 w-12 text-wonderwhiz-bright-pink mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-3">
                {childAge <= 8 
                  ? "Want to see a cool picture? 🎨" 
                  : "Generate Visual Content? 📸"
                }
              </h3>
              <p className="text-white/80 mb-6">
                {childAge <= 8 
                  ? "I can create a fun picture to help you understand this topic better!"
                  : "Would you like me to generate a fascinating image to enhance your understanding of this section?"
                }
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleImagePermission(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Not now
                </Button>
                <Button
                  onClick={() => handleImagePermission(true)}
                  className="flex-1 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Yes, please!
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Content */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/20 p-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">{section?.title}</h1>
          <p className="text-white/70">
            {currentSection.description}
          </p>
        </div>

        {/* Generated Image */}
        {(section?.image_url || requestingImage) && (
          <div className="mb-8">
            {requestingImage ? (
              <div className="aspect-[16/9] bg-white/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink mx-auto mb-2"></div>
                  <p className="text-white/70 text-sm">Creating your image... 🎨</p>
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
            <div className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
              {section.content}
            </div>

            {/* Fun Facts */}
            {section.facts && section.facts.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-lg border border-yellow-400/20">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {childAge <= 8 ? "Super Cool Facts! 🤩" : "Mind-Blowing Facts! 🧠"}
                </h3>
                <ul className="space-y-2">
                  {section.facts.map((fact, index) => (
                    <li key={index} className="text-white/80 flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Story Mode (for complex topics) */}
            {section.story_mode_content && (
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-lg border border-purple-400/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">
                  📖 Story Time!
                </h3>
                <div className="text-white/80 italic">
                  {section.story_mode_content}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            📊 Word count: {section?.word_count || 0} • 
            ⏱️ Reading time: ~{currentSection.estimated_reading_time} minutes
          </div>
          
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {childAge <= 8 ? "I'm Done! 🎉" : "Mark as Complete"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SectionViewer;
