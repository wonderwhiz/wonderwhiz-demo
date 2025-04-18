import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast"
import { useUser } from '@/hooks/use-user';
import { supabase } from '@/integrations/supabase/client';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ParticleEffect from '@/components/ParticleEffect';

const CreateProfile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [avatar_url, setAvatarUrl] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setInterests([...interests, value]);
    } else {
      setInterests(interests.filter((interest) => interest !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .insert([
          {
            name,
            age: parseInt(age),
            interests,
            avatar_url,
            parent_user_id: user?.id,
            pin
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Profile created successfully!",
      });
      
      // Navigate to new dashboard instead of old one
      navigate(`/new-dashboard/${data.id}`);
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Failed to create profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Create Child Profile - WonderWhiz</title>
        <meta name="description" content="Create a profile for your child on WonderWhiz and start their learning journey." />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="medium" />
      
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <WonderWhizLogo className="h-16 animate-float-gentle" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Create a Profile</h1>
          <p className="text-gray-200">Let's get your child's learning adventure started!</p>
        </div>
        
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-gray-200">Enter your child's details to create their profile.</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your child's name" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">Age</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-white/60">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 13 }, (_, i) => i + 3).map((age) => (
                      <SelectItem key={age} value={String(age)}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Interests</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Science', 'Math', 'History', 'Reading', 'Technology', 'Art', 'Music', 'Sports'].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        id={`interest-${interest}`}
                        className="h-4 w-4 rounded text-wonderwhiz-purple focus:ring-wonderwhiz-purple"
                        value={interest}
                        checked={interests.includes(interest)}
                        onChange={handleInterestChange}
                      />
                      <Label htmlFor={`interest-${interest}`} className="text-white cursor-pointer">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar" className="text-white">Avatar URL (Optional)</Label>
                <Input 
                  id="avatar" 
                  placeholder="Enter a URL for your child's avatar" 
                  type="url"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  value={avatar_url}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="text-white">4-Digit PIN</Label>
                <Input 
                  id="pin" 
                  placeholder="Enter a 4-digit PIN for the profile" 
                  type="password"
                  maxLength={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110 text-white font-bold py-2 rounded-full transition-all shadow-lg hover:shadow-wonderwhiz-pink/30 hover:scale-105 active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 text-center border-t border-white/10 pt-4">
            <p className="text-xs text-white/60">
              By creating a profile, you agree to the WonderWhiz Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;
