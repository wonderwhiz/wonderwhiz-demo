
import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SUPPORTED_LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'Spanish', name: 'Español' },
  { code: 'French', name: 'Français' },
  { code: 'German', name: 'Deutsch' },
  { code: 'Chinese', name: 'Chinese (中文)' },
  { code: 'Japanese', name: 'Japanese (日本語)' },
  { code: 'Portuguese', name: 'Português' },
  { code: 'Hindi', name: 'Hindi (हिन्दी)' },
  { code: 'Arabic', name: 'Arabic (العربية)' },
  { code: 'Russian', name: 'Russian (русский)' }
];

interface LanguageSelectorProps {
  childId: string;
  initialLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

const LanguageSelector = ({ childId, initialLanguage = 'English', onLanguageChange }: LanguageSelectorProps) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === language) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({ language: newLanguage })
        .eq('id', childId);

      if (error) throw error;
      
      setLanguage(newLanguage);
      
      if (onLanguageChange) {
        onLanguageChange(newLanguage);
      }
      
      toast.success(`Language updated to ${newLanguage}`);
    } catch (error) {
      console.error('Error updating language:', error);
      toast.error('Failed to update language');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <Select 
        value={language} 
        onValueChange={handleLanguageChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
