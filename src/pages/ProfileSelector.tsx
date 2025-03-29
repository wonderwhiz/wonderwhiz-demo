
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, LogOut, Sparkles } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ParticleEffect from '@/components/ParticleEffect';

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  sparks_balance: number;
  pin: string;
}

const AVATAR_BG = {
  'nova': 'bg-gradient-to-r from-blue-400 to-indigo-500',
  'spark': 'bg-gradient-to-r from-yellow-300 to-amber-500',
  'quill': 'bg-gradient-to-r from-emerald-400 to-teal-500',
  'pixel': 'bg-gradient-to-r from-pink-400 to-rose-500',
  'atlas': 'bg-gradient-to-r from-purple-400 to-indigo-500',
  'tempo': 'bg-gradient-to-r from-orange-400 to-red-500',
  'default': 'bg-gradient-to-r from-purple-500 to-pink-500',
};

const ProfileSelector = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pinError, setPinError] = useState(false);
  
  useEffect(() => {
    const checkUserSessionAndLoadProfiles = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        toast.error("Please log in first");
        return;
      }
      
      // Load child profiles
      const { data: profilesData, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_user_id', data.session.user.id);
        
      if (error) {
        toast.error("Failed to load profiles");
        console.error(error);
      } else {
        setProfiles(profilesData || []);
      }
      
      setIsLoading(false);
    };
    
    checkUserSessionAndLoadProfiles();
  }, [navigate]);
  
  const handleProfileClick = (profile: ChildProfile) => {
    setSelectedProfile(profile);
    setIsPinDialogOpen(true);
    setPinInput('');
    setPinError(false);
  };
  
  const handlePinSubmit = () => {
    if (selectedProfile && pinInput === selectedProfile.pin) {
      setIsPinDialogOpen(false);
      
      // Store the selected profile in local storage or state management
      localStorage.setItem('currentChildProfile', JSON.stringify(selectedProfile));
      
      // Navigate to child dashboard
      navigate(`/dashboard/${selectedProfile.id}`);
    } else {
      setPinError(true);
      toast.error("Incorrect PIN, please try again");
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast.success("You have been signed out");
  };
  
  const getAvatarBg = (avatar: string) => {
    return AVATAR_BG[avatar as keyof typeof AVATAR_BG] || AVATAR_BG.default;
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col">
      <Helmet>
        <title>Choose Profile - WonderWhiz</title>
        <meta name="description" content="Select a profile to start exploring with WonderWhiz." />
      </Helmet>
      
      <ParticleEffect type="stars" intensity="medium" />
      
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center">
          <WonderWhizLogo className="h-10" />
          <span className="ml-3 text-xl font-baloo font-bold text-white">WonderWhiz</span>
        </div>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white text-center">
          Who's Exploring Today?
        </h1>
        <p className="text-gray-200 mb-12">Choose a profile to start your journey</p>
        
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {profiles.map(profile => (
              <motion.div key={profile.id} variants={item}>
                <button
                  onClick={() => handleProfileClick(profile)}
                  className="w-full perspective-800 transform transition-all duration-300 hover:scale-105"
                >
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-white/20 backdrop-blur-sm bg-white/10 hover:shadow-wonderwhiz-pink/20">
                    <div className={`h-32 ${getAvatarBg(profile.avatar_url)} flex items-center justify-center`}>
                      <span className="text-5xl font-bold text-white">{profile.name.charAt(0)}</span>
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-xl font-bold text-white mb-1">{profile.name}</h3>
                      <div className="flex items-center justify-center text-wonderwhiz-gold">
                        <Sparkles className="h-4 w-4 mr-1" />
                        <span className="text-sm">{profile.sparks_balance} Sparks</span>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
            
            <motion.div variants={item}>
              <button 
                onClick={() => navigate('/create-profile')}
                className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 hover:border-wonderwhiz-pink hover:bg-white/5 flex flex-col items-center justify-center py-10 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-8 w-8 text-white/70" />
                </div>
                <span className="text-white font-medium">Add Profile</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="bg-wonderwhiz-dark border border-white/20">
          <DialogTitle className="text-white text-center">Enter PIN</DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            Enter {selectedProfile?.name}'s PIN to continue
          </DialogDescription>
          
          <div className="my-4">
            <Input
              type="password"
              maxLength={6}
              className={`text-center text-2xl bg-white/10 border-white/20 text-white ${
                pinError ? 'border-red-500 animate-shake' : ''
              }`}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="• • • •"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePinSubmit();
                }
              }}
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsPinDialogOpen(false)}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePinSubmit}
              className="bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110 text-white"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSelector;
