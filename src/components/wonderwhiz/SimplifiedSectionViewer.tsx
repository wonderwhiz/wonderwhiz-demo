
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle, BookOpen, Clock, Award } from 'lucide-react';
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
        
        // Generate image silently if needed
        if (!convertedSection.image_url) {
          generateImageSilently();
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
        
        // Generate image silently
        generateImageSilently();
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

  const generateImageSilently = async () => {
    if (!section) return;
    
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
      
      // Simple toast notification
      toast.success(`Great work! +10 Wonder Points!`, {
        duration: 2000,
        style: {
          background: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600'
        }
      });
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
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-white p-12 shadow-lg border border-gray-200 rounded-3xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isYoungChild 
                ? "Creating something amazing for you... ✨" 
                : "Preparing your content... 🚀"
              }
            </h3>
            <p className="text-gray-600 text-lg">This will just take a moment!</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onBackToTOC}
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-semibold text-lg px-6 py-3 rounded-2xl"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Contents
        </Button>
        
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-6 py-3 rounded-2xl font-semibold border border-purple-200">
          Section {sectionIndex + 1} of {topic.table_of_contents.length}
        </div>
      </div>

      {/* Enhanced Main Content */}
      <Card className="bg-white shadow-xl border border-gray-200 rounded-3xl overflow-hidden">
        {/* Beautiful Header Section */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{section?.title}</h1>
              <p className="text-white/90 text-lg font-medium">
                {currentSection.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Generated Image */}
          {section?.image_url && (
            <div className="mb-8">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={section.image_url}
                alt={section.title}
                className="w-full aspect-[16/9] object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Main Content */}
          {section && (
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {section.content}
                </div>
              </div>

              {/* Enhanced Fun Facts */}
              {section.facts && section.facts.length > 0 && (
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 p-6 shadow-md rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {isYoungChild ? "Amazing Facts! 🤩" : "Did You Know? 🧠"}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {section.facts.map((fact, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-yellow-800 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-800 font-medium text-lg">{fact}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Modern Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">{section?.word_count || 0} words</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">~{Math.ceil((section?.word_count || 0) / 200)} min read</span>
              </div>
            </div>
            
            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Award className="h-6 w-6 mr-2" />
              {isYoungChild ? "I'm Done! 🎉" : "Complete Section"}
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SimplifiedSectionViewer;
