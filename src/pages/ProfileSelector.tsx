import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, LogOut, Sparkles, Star, Heart, Crown } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ParticleEffect from '@/components/ParticleEffect';
import FloatingElements from '@/components/FloatingElements';
import MagicalBorder from '@/components/MagicalBorder';
import SparksBadge from '@/components/SparksBadge';
import ParentsZoneCard from '@/components/unified/ParentsZoneCard';
import { useAuth } from '@/hooks/useAuth';

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  sparks_balance: number;
  pin: string;
}

const AVATAR_BG = {
  'nova': 'bg-gradient-to-br from-blue-400 to-indigo-600',
  'spark': 'bg-gradient-to-br from-amber-300 to-orange-500',
  'quill': 'bg-gradient-to-br from-emerald-400 to-teal-600',
  'pixel': 'bg-gradient-to-br from-pink-400 to-rose-600',
  'atlas': 'bg-gradient-to-br from-purple-400 to-indigo-600',
  'tempo': 'bg-gradient-to-br from-orange-400 to-red-600',
  'default': 'bg-gradient-to-br from-purple-500 to-pink-600',
};

const AVATAR_ICONS = {
  'nova': <Star className="h-12 w-12 text-white drop-shadow-md" />,
  'spark': <Sparkles className="h-12 w-12 text-white drop-shadow-md" />,
  'quill': <Heart className="h-12 w-12 text-white drop-shadow-md" />,
  'pixel': <Crown className="h-12 w-12 text-white drop-shadow-md" />,
  'default': <Sparkles className="h-12 w-12 text-white drop-shadow-md" />,
};

const ProfileSelector = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pinError, setPinError] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);
  const [isParentsZoneHovered, setIsParentsZoneHovered] = useState(false);
  
  useEffect(() => {
    const loadProfiles = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('parent_user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error loading profiles:', error);
          toast.error("Failed to load profiles");
          return;
        }
        
        setProfiles(data || []);
      } catch (error) {
        console.error('Error loading profiles:', error);
        toast.error("Failed to load profiles");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfiles();
  }, [user]);
  
  const handleProfileClick = (profile: ChildProfile) => {
    setSelectedProfile(profile);
    setIsPinDialogOpen(true);
    setPinInput('');
    setPinError(false);
  };
  
  const handlePinSubmit = () => {
    if (selectedProfile && pinInput === selectedProfile.pin) {
      setIsPinDialogOpen(false);
      
      // Store the selected profile in local storage
      localStorage.setItem('currentChildProfile', JSON.stringify(selectedProfile));
      
      // Show success toast
      toast.success(`Welcome back, ${selectedProfile.name}! Let's explore!`, {
        position: 'top-center',
        duration: 3000,
        className: 'streak-toast-success'
      });
      
      // Navigate to child dashboard
      navigate(`/dashboard/${selectedProfile.id}`);
    } else {
      setPinError(true);
      toast.error("Incorrect PIN, please try again");
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success("You have been signed out");
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out");
    }
  };
  
  const getAvatarBg = (avatar: string) => {
    return AVATAR_BG[avatar as keyof typeof AVATAR_BG] || AVATAR_BG.default;
  };
  
  const getAvatarIcon = (avatar: string) => {
    return AVATAR_ICONS[avatar as keyof typeof AVATAR_ICONS] || AVATAR_ICONS.default;
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
  
  const title = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col overflow-hidden">
      <Helmet>
        <title>Choose Profile - WonderWhiz</title>
        <meta name="description" content="Select a profile to start exploring with WonderWhiz." />
      </Helmet>
      
      <FloatingElements type="mixed" density="low" />
      <ParticleEffect type="stars" intensity="medium" />
      
      <header className="p-6 flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <WonderWhizLogo className="h-14 w-14" />
          </motion.div>
          <motion.span 
            className="ml-3 text-2xl font-baloo font-bold text-white tracking-wide"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            WonderWhiz
          </motion.span>
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
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          variants={title}
          initial="hidden"
          animate="show"
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white text-center font-baloo">
            Who's Exploring Today?
          </h1>
          <p className="text-gray-200 text-lg">Choose a profile to start your adventure</p>
          
          <motion.div 
            className="absolute top-0 right-1/4 -mt-8"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="h-8 w-8 text-wonderwhiz-gold filter drop-shadow-lg" />
          </motion.div>
          
          <motion.div 
            className="absolute top-1/2 left-1/4 -ml-16"
            animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Sparkles className="h-6 w-6 text-wonderwhiz-blue filter drop-shadow-lg" />
          </motion.div>
        </motion.div>
        
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-wonderwhiz-pink border-t-transparent"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl w-full"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {profiles.map(profile => (
              <motion.div key={profile.id} variants={item}>
                <MagicalBorder 
                  active={hoveredProfile === profile.id} 
                  type="rainbow"
                  className="rounded-2xl"
                >
                  <button
                    onClick={() => handleProfileClick(profile)}
                    onMouseEnter={() => setHoveredProfile(profile.id)}
                    onMouseLeave={() => setHoveredProfile(null)}
                    className="w-full perspective-800 transform transition-all duration-500"
                  >
                    <motion.div 
                      className="rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white/10 backdrop-blur-sm hover:shadow-wonderwhiz-pink/20 h-full"
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`h-40 ${getAvatarBg(profile.avatar_url)} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute w-40 h-40 rounded-full bg-white/30 blur-xl -top-10 -right-10" />
                          <div className="absolute w-20 h-20 rounded-full bg-white/20 blur-md bottom-5 left-5" />
                        </div>
                        
                        <motion.div
                          animate={{ 
                            y: [0, -8, 0],
                            rotate: [0, 5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative z-10"
                        >
                          {getAvatarIcon(profile.avatar_url)}
                        </motion.div>
                        
                        <div className="absolute top-3 right-3">
                          <SparksBadge 
                            sparks={profile.sparks_balance} 
                            size="md"
                          />
                        </div>
                      </div>
                      
                      <div className="p-6 text-center">
                        <h3 className="text-2xl font-bold text-white mb-1 font-baloo">{profile.name}</h3>
                        <div className="flex items-center justify-center text-wonderwhiz-gold">
                          <span className="text-sm opacity-80">Tap to continue your adventure!</span>
                        </div>
                      </div>
                    </motion.div>
                  </button>
                </MagicalBorder>
              </motion.div>
            ))}
            
            <motion.div variants={item}>
              <ParentsZoneCard
                to="/parent-zone"
                isHovered={isParentsZoneHovered}
                onHover={setIsParentsZoneHovered}
              />
            </motion.div>
            
            <motion.div variants={item}>
              <button 
                onClick={() => navigate('/create-profile')}
                className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 hover:border-wonderwhiz-pink hover:bg-white/5 flex flex-col items-center justify-center py-16 transition-all duration-300"
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  <UserPlus className="h-10 w-10 text-white/70" />
                </motion.div>
                <span className="text-white text-xl font-medium font-baloo">Add New Profile</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Pin Dialog */}
      <AnimatePresence>
        {isPinDialogOpen && (
          <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
            <DialogContent className="bg-wonderwhiz-dark border border-white/20 max-w-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    animate={{ 
                      y: [0, -6, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    <WonderWhizLogo className="h-20 w-20" />
                  </motion.div>
                </div>
                
                <DialogTitle className="text-white text-center text-2xl font-baloo mt-6">
                  Enter Your Secret PIN
                </DialogTitle>
                
                <DialogDescription className="text-white/70 text-center">
                  {selectedProfile?.name}'s magical portal awaits!
                </DialogDescription>
                
                <div className="my-8 relative">
                  <MagicalBorder 
                    active={pinError ? false : true} 
                    type={pinError ? 'purple' : 'rainbow'}
                    className="rounded-lg"
                  >
                    <Input
                      type="password"
                      maxLength={6}
                      className={`text-center text-2xl bg-white/10 border-white/20 text-white h-14 ${
                        pinError ? 'border-red-500 animate-shake' : ''
                      }`}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        if (pinError) setPinError(false);
                      }}
                      placeholder="• • • •"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePinSubmit();
                        }
                      }}
                      autoFocus
                    />
                  </MagicalBorder>
                  
                  {pinError && (
                    <motion.p 
                      className="text-red-400 text-sm mt-2 text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Oops! That's not the correct PIN. Try again!
                    </motion.p>
                  )}
                  
                  <FloatingElements type="sparkles" density="low" />
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
                    className="bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110 text-white font-medium px-6"
                  >
                    Let's Go!
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSelector;
