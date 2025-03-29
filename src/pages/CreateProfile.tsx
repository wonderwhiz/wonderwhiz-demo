
// Update the CreateProfile component to include language selection
// We'll add this functionality to the existing component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Available avatars
const AVATARS = [
  "/avatars/boy1.png",
  "/avatars/boy2.png",
  "/avatars/boy3.png",
  "/avatars/girl1.png",
  "/avatars/girl2.png",
  "/avatars/girl3.png",
];

// Available interests
const INTERESTS = [
  "Science", "Space", "Animals", "Dinosaurs", "History",
  "Math", "Geography", "Technology", "Art", "Music",
  "Sports", "Cooking", "Nature", "Coding", "Oceans"
];

// Available languages
const LANGUAGES = [
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

const CreateProfile = () => {
  const navigate = useNavigate();

  // Form states
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState(8);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        toast.info("You can select up to 5 interests");
      }
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        toast.error("Please enter a name");
        return;
      }
      
      if (age < 5 || age > 12) {
        toast.error("Age must be between 5 and 12");
        return;
      }
      
      if (pin.length < 4) {
        toast.error("PIN must be at least 4 characters");
        return;
      }
      
      if (pin !== confirmPin) {
        toast.error("PINs don't match");
        return;
      }
      
      setStep(step + 1);
      return;
    }
    
    if (step === 2) {
      setStep(step + 1);
      return;
    }
    
    if (step === 3) {
      if (selectedInterests.length < 1) {
        toast.error("Please select at least one interest");
        return;
      }
      
      handleCreateProfile();
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleCreateProfile = async () => {
    setIsSubmitting(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You need to be logged in to create a profile");
        navigate('/login');
        return;
      }
      
      // Create child profile
      const { data, error } = await supabase
        .from('child_profiles')
        .insert([
          { 
            name, 
            age, 
            pin, 
            avatar_url: selectedAvatar,
            interests: selectedInterests,
            language: language,
            parent_user_id: user.id
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success("Profile created successfully!");
      
      // Navigate to the profiles page
      navigate('/profiles');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error("Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-dark to-black flex flex-col items-center justify-center py-8 px-4">
      <div className="flex flex-col items-center mb-6">
        <WonderWhizLogo className="h-20" />
        <h1 className="text-white text-2xl font-bold mt-4">Create Child Profile</h1>
      </div>
      
      <motion.div 
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div 
              key={stepNumber} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === stepNumber
                ? 'bg-wonderwhiz-purple text-white'
                : step > stepNumber
                  ? 'bg-green-100 text-green-600 border border-green-600'
                  : 'bg-gray-100 text-gray-400'}`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Child's Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                placeholder="Enter age"
                min={5}
                max={12}
              />
              <p className="text-xs text-gray-500">WonderWhiz is designed for children aged 5-12</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">All AI responses and content will be in this language</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pin">Create PIN</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Create a PIN (at least 4 characters)"
                minLength={4}
              />
              <p className="text-xs text-gray-500">Your child will use this PIN to access their account</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm PIN"
              />
            </div>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <Label className="block mb-3">Select an Avatar</Label>
              <div className="grid grid-cols-3 gap-3">
                {AVATARS.map((avatar, index) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedAvatar === avatar ? 'border-wonderwhiz-purple' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <Label className="block mb-2">Select Interests (up to 5)</Label>
              <p className="text-xs text-gray-500 mb-3">
                This helps us personalize content for {name}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {INTERESTS.map((interest) => (
                  <div 
                    key={interest} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={interest} 
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <Label 
                      htmlFor={interest} 
                      className="text-sm cursor-pointer"
                    >
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected: {selectedInterests.length}/5
              </p>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={isSubmitting}
            >
              Back
            </Button>
          ) : <div />}
          
          <Button 
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90"
          >
            {isSubmitting 
              ? "Creating..." 
              : step === 3 
                ? "Create Profile" 
                : "Next"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProfile;
