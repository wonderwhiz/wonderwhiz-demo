import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import { useBlockInteractionHandlers } from '@/hooks/useBlockInteractionHandlers';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';
import VoiceInputButton from '@/components/curio/VoiceInputButton';
import DashboardControls from '@/components/dashboard/DashboardControls';
import AgeSpecificInterface from '@/components/dashboard/AgeSpecificInterface';
import AgeAdaptiveNavigation from '@/components/dashboard/AgeAdaptiveNavigation';
import ProgressVisualization from '@/components/dashboard/ProgressVisualization';
import SingleEntryDashboard from '@/components/dashboard/SingleEntryDashboard';
import PersonalizationDashboard from '@/components/dashboard/PersonalizationDashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

const DashboardContainer = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  const [childAge, setChildAge] = useState<number>(10);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  
  const { streakDays } = useSparksSystem(profileId);

  const {
    childProfile,
    setChildProfile,
    isLoading,
    pastCurios,
    setPastCurios,
    isLoadingSuggestions,
    curioSuggestions,
    handleRefreshSuggestions
  } = useDashboardProfile(profileId);

  const { playText, isPlaying, stopPlaying } = useElevenLabsVoice();

  const {
    query,
    setQuery,
    isGenerating,
    handleSubmitQuery,
    handleFollowRabbitHole,
    handleCurioSuggestionClick: curioCreationSuggestionClick
  } = useCurioCreation(profileId, childProfile, setPastCurios, setChildProfile, () => {});

  const blockInteractionHandlers = useBlockInteractionHandlers(
    profileId, 
    childProfile, 
    setChildProfile, 
    []
  );
  
  const {
    handleBlockReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleSparkEarned
  } = blockInteractionHandlers;

  useEffect(() => {
    if (childProfile?.age) {
      const age = typeof childProfile.age === 'string' 
        ? parseInt(childProfile.age, 10) 
        : childProfile.age;
      
      setChildAge(age);
        
      if (age >= 5 && age <= 7) {
        setAgeGroup('5-7');
      } else if (age >= 8 && age <= 11) {
        setAgeGroup('8-11');
      } else {
        setAgeGroup('12-16');
      }
    }
  }, [childProfile]);

  const handleLoadCurio = useCallback((curio: Curio) => {
    // This component no longer displays single curios.
  }, []);

  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (transcript.trim()) {
      setQuery(transcript);
      setIsVoiceActive(false);
      
      setTimeout(() => {
        handleSubmitQuery();
      }, 300);
    }
  }, [setQuery, setIsVoiceActive, handleSubmitQuery]);

  // Handle search from dashboard - this will create a curio and set it as current
  const handleDashboardSearch = useCallback(async (searchQuery: string) => {
    if (!profileId || processingImage) return;
    
    // Validate that profileId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(profileId)) {
      toast.error("Invalid profile ID. Please check your profile setup.");
      return;
    }
    
    try {
      // Create a new curio
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: searchQuery,
          query: searchQuery,
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating curio:', error);
        toast.error("Failed to create learning session. Please try again.");
        return;
      }
      
      toast.success("Starting your learning journey!");
      
      // Add the curio to the list of past curios
      setPastCurios(prev => [newCurio, ...prev]);
      
      // Set the current curio to the new one
      // No longer setting current curio
      
      // Award sparks for starting a new topic
      handleSparkEarned(2, 'topic-start');
      
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Sorry, we couldn't start your learning session. Please try again.");
    }
  }, [profileId, processingImage, setPastCurios, handleSparkEarned]);

  // Handle image uploads with proper UUID validation
  const handleImageCapture = useCallback(async (file: File) => {
    if (!profileId || processingImage) return;
    
    // Validate that profileId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(profileId)) {
      toast.error("Invalid profile ID. Please check your profile setup.");
      return;
    }
    
    setProcessingImage(true);
    
    try {
      toast.loading("Analyzing your image with AI...");
      
      // Create a real curio in the database
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: `About ${file.name.split('.')[0]}`,
          query: `Tell me about this image: ${file.name}`,
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating curio:', error);
        toast.dismiss();
        toast.error("Failed to create learning session. Please try again.");
        return;
      }
      
      toast.dismiss();
      toast.success("Image analyzed successfully!");
      
      // Add the curio to the list of past curios
      setPastCurios(prev => [newCurio, ...prev]);
      
      // Set the current curio to the new one
      // No longer setting current curio
      
      // Award sparks for uploading an image
      handleSparkEarned(3, 'image-upload');
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.dismiss();
      toast.error("Sorry, we couldn't analyze your image. Please try again.");
    } finally {
      setProcessingImage(false);
    }
  }, [profileId, processingImage, setPastCurios, handleSparkEarned]);

  // Use the logic from the local function but call the one from useCurioCreation
  const handleSuggestionClick = useCallback((suggestion: string) => {
    curioCreationSuggestionClick(suggestion);
  }, [curioCreationSuggestionClick]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90">
      <Helmet>
        <title>WonderWhiz - Explore & Learn</title>
        <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
      </Helmet>
      
      <DashboardSidebar 
        childId={profileId || ''} 
        sparksBalance={childProfile?.sparks_balance || 0}
        pastCurios={pastCurios}
        currentCurioId={null}
        onCurioSelect={handleLoadCurio}
      />
      
      <main className="flex-1 flex flex-col min-h-screen relative">
        <DashboardControls
          childName={childProfile?.name || 'Explorer'}
          childId={profileId || ''}
          sparksBalance={childProfile?.sparks_balance || 0}
          streakDays={streakDays}
          onSearch={handleDashboardSearch}
          isGenerating={isGenerating || processingImage}
          onImageCapture={handleImageCapture}
          childProfile={childProfile}
        />
        
        <div className="flex-1 overflow-y-auto">
          {/* Age-Adaptive Navigation */}
          <AgeAdaptiveNavigation
            childProfile={childProfile}
            currentSection={currentSection}
            onNavigate={setCurrentSection}
          />
          
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {currentSection === 'home' && (
              <SingleEntryDashboard
                childProfile={childProfile}
                onSearch={handleDashboardSearch}
                onImageUpload={handleImageCapture}
                isGenerating={isGenerating || processingImage}
                streakDays={streakDays}
                sparksBalance={childProfile?.sparks_balance || 0}
              />
            )}
            
            {currentSection === 'progress' && (
              <ProgressVisualization
                childProfile={childProfile}
                streakDays={streakDays}
                sparksBalance={childProfile?.sparks_balance || 0}
              />
            )}
            
            {currentSection === 'achievements' && (
              <ProgressVisualization
                childProfile={childProfile}
                streakDays={streakDays}
                sparksBalance={childProfile?.sparks_balance || 0}
              />
            )}
            
            {currentSection === 'personalization' && (
              <PersonalizationDashboard
                childId={profileId || ''}
                childProfile={childProfile}
              />
            )}
          </div>
        </div>
        
        <VoiceInputButton 
          isActive={isVoiceActive}
          onToggle={setIsVoiceActive}
          onTranscript={handleVoiceTranscript}
          childAge={childAge}
        />
        
        {profileId && (
          <TalkToWhizzy 
            childId={profileId}
            curioTitle={undefined}
            ageGroup={ageGroup}
            onNewQuestionGenerated={handleFollowRabbitHole}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardContainer;
