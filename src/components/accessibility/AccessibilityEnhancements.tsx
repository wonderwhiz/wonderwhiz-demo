
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Type, 
  Eye, 
  Keyboard, 
  MousePointer,
  Settings,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  readingSpeed: number;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  focusIndicators: boolean;
  autoRead: boolean;
}

interface AccessibilityEnhancementsProps {
  visible: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

const AccessibilityEnhancements: React.FC<AccessibilityEnhancementsProps> = ({
  visible,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [currentlyReading, setCurrentlyReading] = useState<string | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--font-size-scale', `${settings.fontSize / 100}`);
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Color blind mode
    root.setAttribute('data-colorblind-mode', settings.colorBlindMode);
    
    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  }, [settings]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'r':
          if (event.ctrlKey) {
            event.preventDefault();
            readCurrentPage();
          }
          break;
        case 's':
          if (event.ctrlKey) {
            event.preventDefault();
            stopReading();
          }
          break;
        case '?':
          event.preventDefault();
          showKeyboardShortcuts();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation]);

  const readCurrentPage = useCallback(() => {
    if (!speechSynthesis) return;

    const content = document.querySelector('main')?.textContent || '';
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = settings.readingSpeed / 100;
    utterance.onstart = () => setCurrentlyReading('page');
    utterance.onend = () => setCurrentlyReading(null);
    
    speechSynthesis.speak(utterance);
  }, [speechSynthesis, settings.readingSpeed]);

  const stopReading = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setCurrentlyReading(null);
    }
  }, [speechSynthesis]);

  const showKeyboardShortcuts = () => {
    // Create and show keyboard shortcuts modal
    console.log('Keyboard shortcuts: Ctrl+R (read page), Ctrl+S (stop reading), ? (show shortcuts)');
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-4 top-20 bottom-4 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-wonderwhiz-cyan" />
          <h3 className="text-lg font-semibold text-white">Accessibility</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white/70 hover:text-white"
        >
          ×
        </Button>
      </div>

      <div className="space-y-6">
        {/* Reading Controls */}
        <Card className="bg-white/5 border-white/10 p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Reading Support
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Auto-read content</span>
              <Switch
                checked={settings.autoRead}
                onCheckedChange={(checked) => updateSetting('autoRead', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white/80 text-sm">Reading Speed</label>
              <Slider
                value={[settings.readingSpeed]}
                onValueChange={([value]) => updateSetting('readingSpeed', value)}
                min={50}
                max={200}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-white/60">{settings.readingSpeed}% speed</div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={readCurrentPage}
                disabled={currentlyReading === 'page'}
                className="flex-1"
              >
                <Play className="h-3 w-3 mr-1" />
                Read Page
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={stopReading}
                disabled={!currentlyReading}
              >
                <Pause className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Visual Settings */}
        <Card className="bg-white/5 border-white/10 p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Type className="h-4 w-4" />
            Visual Settings
          </h4>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-white/80 text-sm">Font Size</label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={75}
                max={150}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-white/60">{settings.fontSize}% size</div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">High Contrast</span>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Reduce Motion</span>
              <Switch
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white/80 text-sm">Color Blind Support</label>
              <Select
                value={settings.colorBlindMode}
                onValueChange={(value: any) => updateSetting('colorBlindMode', value)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Navigation Settings */}
        <Card className="bg-white/5 border-white/10 p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Navigation
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Keyboard Navigation</span>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Enhanced Focus</span>
              <Switch
                checked={settings.focusIndicators}
                onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Screen Reader Support</span>
              <Switch
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Keyboard Shortcuts */}
        {settings.keyboardNavigation && (
          <Card className="bg-white/5 border-white/10 p-4">
            <h4 className="text-white font-medium mb-3">Keyboard Shortcuts</h4>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Read page</span>
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl + R</kbd>
              </div>
              <div className="flex justify-between">
                <span>Stop reading</span>
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between">
                <span>Show shortcuts</span>
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">?</kbd>
              </div>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default AccessibilityEnhancements;
