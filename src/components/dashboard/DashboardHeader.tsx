
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DashboardHeaderProps {
  childName: string;
  profileId?: string;
  streakDays: number; // Added this prop to fix the build error
  childAge: number;   // Added this prop to fix the build error
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  childName, 
  profileId,
  streakDays,
  childAge
}) => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-wonderwhiz-deep-purple/80 border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 border-2 border-white/20">
            <AvatarImage src={`/avatars/child-${(childAge < 8) ? 'young' : (childAge < 13) ? 'middle' : 'teen'}.png`} alt={childName} />
            <AvatarFallback className="bg-wonderwhiz-bright-pink text-white">{childName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-white font-medium">{childName}</h2>
            <div className="flex items-center text-xs text-white/60">
              <Sparkles className="h-3 w-3 mr-1 text-wonderwhiz-gold" />
              <span>{streakDays} day streak</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
