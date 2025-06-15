
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Heart, Crown } from 'lucide-react';
import MagicalBorder from '@/components/MagicalBorder';
import SparksBadge from '@/components/SparksBadge';
import { ChildProfile } from '@/types/profiles';

interface ProfileCardProps {
  profile: ChildProfile;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (profile: ChildProfile) => void;
  variants: any;
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

const getAvatarBg = (avatar: string) => {
  return AVATAR_BG[avatar as keyof typeof AVATAR_BG] || AVATAR_BG.default;
};

const getAvatarIcon = (avatar: string) => {
  return AVATAR_ICONS[avatar as keyof typeof AVATAR_ICONS] || AVATAR_ICONS.default;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isHovered, onHover, onClick, variants }) => {
  return (
    <motion.div variants={variants}>
      <MagicalBorder 
        active={isHovered} 
        type="rainbow"
        className="rounded-2xl"
      >
        <button
          onClick={() => onClick(profile)}
          onMouseEnter={() => onHover(profile.id)}
          onMouseLeave={() => onHover(null)}
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
  );
};

export default ProfileCard;
