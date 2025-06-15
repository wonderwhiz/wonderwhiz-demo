
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Sparkles, Star } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ParticleEffect from '@/components/ParticleEffect';
import FloatingElements from '@/components/FloatingElements';
import ParentsZoneCard from '@/components/unified/ParentsZoneCard';
import { useAuth } from '@/hooks/useAuth';
import { ChildProfile } from '@/types/profiles';
import ProfileCard from '@/components/profiles/ProfileCard';
import AddProfileCard from '@/components/profiles/AddProfileCard';
import PinDialog from '@/components/profiles/PinDialog';

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
      // ProtectedRoute ensures user is not null, so this check is no longer needed.
      // if (!user) {
      //   setIsLoading(false);
      //   return;
      // }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('parent_user_id', user!.id)
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
    
    if (user) {
      loadProfiles();
    }
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

  const handlePinChange = (pin: string) => {
    setPinInput(pin);
    if (pinError) setPinError(false);
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
              <ProfileCard
                key={profile.id}
                profile={profile}
                isHovered={hoveredProfile === profile.id}
                onHover={setHoveredProfile}
                onClick={handleProfileClick}
                variants={item}
              />
            ))}
            
            <motion.div variants={item}>
              <Link to="/parent-zone" className="block w-full h-full">
                <ParentsZoneCard
                  isHovered={isParentsZoneHovered}
                  onHover={setIsParentsZoneHovered}
                />
              </Link>
            </motion.div>
            
            <AddProfileCard variants={item} />

          </motion.div>
        )}
      </div>
      
      <PinDialog
        isOpen={isPinDialogOpen}
        onOpenChange={setIsPinDialogOpen}
        selectedProfile={selectedProfile}
        onSubmit={handlePinSubmit}
        pinError={pinError}
        pinInput={pinInput}
        onPinChange={handlePinChange}
      />
    </div>
  );
};

export default ProfileSelector;
