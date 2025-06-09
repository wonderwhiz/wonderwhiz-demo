
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Trophy, Eye, Sparkles as SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { usePersonalizationEngine } from '@/hooks/usePersonalizationEngine';
import DashboardContainer from './DashboardContainer';
import FloatingSearch from '@/components/ui/floating-search';
import SmartBreadcrumbs from '@/components/navigation/SmartBreadcrumbs';
import AchievementSystem from '@/components/engagement/AchievementSystem';
import CuriosityChains from '@/components/engagement/CuriosityChains';
import AccessibilityEnhancements from '@/components/accessibility/AccessibilityEnhancements';

const EnhancedDashboardContainer = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<string>('');

  const { childProfile } = useDashboardProfile(profileId);
  const { personalizationData, trackInteraction } = usePersonalizationEngine(profileId || '');

  // Default accessibility settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 100,
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    readingSpeed: 100,
    colorBlindMode: 'none' as const,
    focusIndicators: true,
    autoRead: false
  });

  // Load accessibility settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`accessibility-${profileId}`);
    if (saved) {
      try {
        setAccessibilitySettings(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, [profileId]);

  // Save accessibility settings
  const handleAccessibilityChange = (settings: typeof accessibilitySettings) => {
    setAccessibilitySettings(settings);
    localStorage.setItem(`accessibility-${profileId}`, JSON.stringify(settings));
  };

  // Handle search from floating component
  const handleFloatingSearch = (query: string) => {
    setCurrentTopic(query);
    // This would trigger navigation to the topic
    trackInteraction({
      contentType: 'search',
      timeSpent: 0,
      completionRate: 1,
      difficulty: 'medium',
      engagement: 0.8,
      needsHelp: false
    });
  };

  // Handle voice input
  const handleVoiceStart = () => {
    // Implement voice input logic
    console.log('Voice input started');
  };

  // Handle image capture
  const handleImageCapture = (file: File) => {
    // Implement image analysis logic
    console.log('Image captured:', file.name);
  };

  // Handle curiosity chain step selection
  const handleCuriosityStepSelect = (step: any) => {
    setCurrentTopic(step.title);
    trackInteraction({
      contentType: 'curiosity-chain',
      timeSpent: 0,
      completionRate: 0,
      difficulty: step.difficulty,
      engagement: 0.9,
      needsHelp: false
    });
  };

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient relative">
      {/* Enhanced Dashboard */}
      <DashboardContainer />

      {/* Smart Breadcrumbs */}
      <div className="fixed top-4 left-4 z-40">
        <SmartBreadcrumbs
          childId={profileId || ''}
          currentTopic={currentTopic}
          currentSection={currentSection}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAchievements(!showAchievements)}
          className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
        >
          <Trophy className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAccessibility(!showAccessibility)}
          className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Floating Search */}
      <FloatingSearch
        onSearch={handleFloatingSearch}
        onImageCapture={handleImageCapture}
        onVoiceStart={handleVoiceStart}
        placeholder="What sparks your curiosity?"
      />

      {/* Curiosity Chains */}
      {currentTopic && personalizationData && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-80 z-40">
          <CuriosityChains
            currentTopic={currentTopic}
            childAge={childProfile?.age || 10}
            interests={personalizationData.preferences.interestTopics}
            onStepSelect={handleCuriosityStepSelect}
          />
        </div>
      )}

      {/* Achievement System */}
      <AchievementSystem
        childId={profileId || ''}
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      {/* Accessibility Enhancements */}
      <AccessibilityEnhancements
        visible={showAccessibility}
        onClose={() => setShowAccessibility(false)}
        settings={accessibilitySettings}
        onSettingsChange={handleAccessibilityChange}
      />

      {/* Global Styles for Accessibility */}
      <style jsx global>{`
        :root {
          --font-size-scale: ${accessibilitySettings.fontSize / 100};
        }
        
        .high-contrast {
          --wonderwhiz-deep-purple: #000000;
          --wonderwhiz-bright-pink: #ffffff;
          --wonderwhiz-vibrant-yellow: #ffff00;
        }
        
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .enhanced-focus *:focus {
          outline: 3px solid #4A6FFF !important;
          outline-offset: 2px !important;
        }
        
        [data-colorblind-mode="protanopia"] {
          filter: url(#protanopia);
        }
        
        [data-colorblind-mode="deuteranopia"] {
          filter: url(#deuteranopia);
        }
        
        [data-colorblind-mode="tritanopia"] {
          filter: url(#tritanopia);
        }
        
        html {
          font-size: calc(16px * var(--font-size-scale, 1));
        }
      `}</style>

      {/* SVG Filters for Color Blind Support */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default EnhancedDashboardContainer;
