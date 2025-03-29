
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Check, Star, Sparkles, Book, Rocket, Heart, Music, Globe, Palette } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ParticleEffect from '@/components/ParticleEffect';

const AVATAR_OPTIONS = [
  { id: 'nova', name: 'Nova', bg: 'bg-gradient-to-r from-blue-400 to-indigo-500' },
  { id: 'spark', name: 'Spark', bg: 'bg-gradient-to-r from-yellow-300 to-amber-500' },
  { id: 'quill', name: 'Quill', bg: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  { id: 'pixel', name: 'Pixel', bg: 'bg-gradient-to-r from-pink-400 to-rose-500' },
  { id: 'atlas', name: 'Atlas', bg: 'bg-gradient-to-r from-purple-400 to-indigo-500' },
  { id: 'tempo', name: 'Tempo', bg: 'bg-gradient-to-r from-orange-400 to-red-500' },
];

const INTEREST_OPTIONS = [
  { id: 'animals', label: 'Animals', icon: <Star className="h-4 w-4" /> },
  { id: 'space', label: 'Space', icon: <Rocket className="h-4 w-4" /> },
  { id: 'science', label: 'Science', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'arts', label: 'Arts', icon: <Palette className="h-4 w-4" /> },
  { id: 'books', label: 'Books', icon: <Book className="h-4 w-4" /> },
  { id: 'music', label: 'Music', icon: <Music className="h-4 w-4" /> },
  { id: 'geography', label: 'Geography', icon: <Globe className="h-4 w-4" /> },
  { id: 'sports', label: 'Sports', icon: <Heart className="h-4 w-4" /> },
];

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'arabic', label: 'Arabic' },
];

const CreateProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: 8,
    pin: '',
    confirmPin: '',
    avatar: AVATAR_OPTIONS[0].id,
    interests: [] as string[],
    language: 'english',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUser(data.session.user);
      } else {
        // Redirect to login if no session
        navigate('/login');
        toast.error("Please log in first");
      }
    };

    checkUserSession();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interestId)) {
        return { ...prev, interests: prev.interests.filter(id => id !== interestId) };
      } else {
        return { ...prev, interests: [...prev.interests, interestId] };
      }
    });
  };

  const validatePinStep = () => {
    if (formData.pin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return false;
    }
    if (formData.pin !== formData.confirmPin) {
      toast.error("PINs don't match");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !formData.name) {
      toast.error("Please enter a name");
      return;
    }
    if (step === 3 && !validatePinStep()) {
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);
  
  const handleAgeChange = (value: number[]) => {
    setFormData({ ...formData, age: value[0] });
  };

  const handleSubmit = async () => {
    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create child profile in Supabase
      const { error } = await supabase.from('child_profiles').insert({
        parent_user_id: currentUser?.id,
        name: formData.name,
        age: formData.age,
        avatar_url: formData.avatar,
        pin: formData.pin,
        interests: formData.interests,
        language: formData.language,
        sparks_balance: 0,
      });
      
      if (error) throw error;
      
      toast.success("Profile created successfully!");
      navigate('/profiles');
    } catch (error: any) {
      toast.error("Failed to create profile", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="name" className="text-white font-medium">Child's name</Label>
              <Input 
                id="name"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 text-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="age" className="text-white font-medium">Age: {formData.age}</Label>
              <Slider
                className="my-4"
                defaultValue={[formData.age]}
                min={5}
                max={16}
                step={1}
                onValueChange={handleAgeChange}
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>5</span>
                <span>16</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="language" className="text-white font-medium">Preferred language</Label>
              <Select 
                value={formData.language}
                onValueChange={(value) => handleSelectChange('language', value)}
              >
                <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-wonderwhiz-dark border-white/20">
                  {LANGUAGES.map(language => (
                    <SelectItem 
                      key={language.value} 
                      value={language.value}
                      className="text-white hover:bg-white/10"
                    >
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Label className="text-white font-medium">Select an avatar</Label>
            <div className="grid grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map(avatar => (
                <Button
                  key={avatar.id}
                  type="button"
                  onClick={() => handleSelectChange('avatar', avatar.id)}
                  className={`${avatar.bg} h-24 aspect-square rounded-2xl flex flex-col items-center justify-center relative ${
                    formData.avatar === avatar.id 
                      ? 'ring-4 ring-white ring-opacity-80' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {formData.avatar === avatar.id && (
                    <div className="absolute -top-2 -right-2 bg-wonderwhiz-purple text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <span className="text-xl font-bold">{avatar.name.charAt(0)}</span>
                  <span className="text-xs mt-1">{avatar.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-white font-medium">Create a PIN (4+ digits)</Label>
              <p className="text-white/60 text-sm">This PIN will be used for your child to securely access their profile.</p>
              <Input 
                id="pin"
                name="pin"
                type="password"
                placeholder="Enter PIN"
                value={formData.pin}
                onChange={handleInputChange}
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 text-lg"
                maxLength={6}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPin" className="text-white font-medium">Confirm PIN</Label>
              <Input 
                id="confirmPin"
                name="confirmPin"
                type="password"
                placeholder="Confirm PIN"
                value={formData.confirmPin}
                onChange={handleInputChange}
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 text-lg"
                maxLength={6}
              />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div>
              <Label className="text-white font-medium">Select interests (Choose at least one)</Label>
              <p className="text-white/60 text-sm mb-4">These will help personalize the curiosity feed.</p>
              
              <div className="grid grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map(interest => (
                  <Button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInterestToggle(interest.id)}
                    variant={formData.interests.includes(interest.id) ? "default" : "outline"}
                    className={`justify-start h-12 ${
                      formData.interests.includes(interest.id) 
                        ? 'bg-wonderwhiz-purple text-white' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="mr-2">
                      {interest.icon}
                    </div>
                    {interest.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Create Child Profile - WonderWhiz</title>
        <meta name="description" content="Create a personalized learning profile for your child on WonderWhiz." />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="low" />
      
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <WonderWhizLogo className="h-12" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">Create Child Profile</h1>
          <p className="text-gray-200">Let's set up a magical learning journey</p>
        </div>
        
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white text-lg">Step {step} of 4</CardTitle>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map(i => (
                  <div 
                    key={i}
                    className={`h-2 w-10 rounded-full ${
                      i <= step ? 'bg-wonderwhiz-pink' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            <CardDescription className="text-white/70 mt-1">
              {step === 1 && "Let's get to know your child"}
              {step === 2 && "Choose a fun avatar"}
              {step === 3 && "Set up security"}
              {step === 4 && "What are they curious about?"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
          
          <div className="p-6 pt-0 flex justify-between">
            {step > 1 ? (
              <Button 
                onClick={handleBack} 
                variant="outline" 
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Back
              </Button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            {step < 4 ? (
              <Button 
                onClick={handleNext} 
                className="bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110 text-white"
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110 text-white flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Profile...' : (
                  <>
                    Create Profile
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;
