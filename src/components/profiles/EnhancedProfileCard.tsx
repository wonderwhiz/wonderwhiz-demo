import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { ChildProfile } from '@/types/profiles';

interface ProfileCardProps {
  profile: ChildProfile;
  isHovered: boolean;
  onHover: (profileId: string | null) => void;
  onClick: (profile: ChildProfile) => void;
  variants: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  isHovered, 
  onHover, 
  onClick, 
  variants 
}) => {
  // Check if this profile is auto-login enabled
  const isAutoLogin = localStorage.getItem('autoLoginProfile') && 
    JSON.parse(localStorage.getItem('autoLoginProfile') || '{}').id === profile.id;

  const clearAutoLogin = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('autoLoginProfile');
    // Force re-render by triggering a small state change
    onHover(null);
    setTimeout(() => onHover(profile.id), 0);
  };

  return (
    <motion.div
      variants={variants}
      className="relative"
      onMouseEnter={() => onHover(profile.id)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className={`bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 h-64 flex flex-col justify-between ${
          isHovered ? 'scale-105 bg-white/15 border-white/30 shadow-2xl' : ''
        } ${
          isAutoLogin ? 'ring-2 ring-wonderwhiz-vibrant-yellow shadow-lg shadow-wonderwhiz-vibrant-yellow/20' : ''
        }`}
        onClick={() => onClick(profile)}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Auto-login indicator */}
        {isAutoLogin && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-wonderwhiz-vibrant-yellow text-wonderwhiz-dark px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              🔓 Auto-login
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAutoLogin}
              className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
              title="Disable auto-login"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-wonderwhiz-pink to-wonderwhiz-purple mb-4 flex items-center justify-center text-4xl relative overflow-hidden"
            animate={isHovered ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white font-bold text-2xl">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10"
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          <h3 className="text-xl font-bold text-white mb-2 font-baloo">
            {profile.name}
          </h3>
          
          <div className="text-sm text-white/70 space-y-1">
            <p className="flex items-center justify-center gap-1">
              ⭐ {profile.sparks_balance || 0} Sparks
            </p>
          </div>
        </div>
        
        <motion.div
          className="mt-4"
          animate={isHovered ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        >
          <div className="text-white/60 text-sm font-medium">
            {isAutoLogin ? '🚀 Ready to explore!' : '🔐 Tap to enter'}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;