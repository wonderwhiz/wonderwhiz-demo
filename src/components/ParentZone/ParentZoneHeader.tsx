
import React from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChildProfileForHeader {
  id: string;
  name: string;
  avatar_url: string;
  age: number;
  sparks_balance: number;
  created_at: string;
}

interface ParentZoneHeaderProps {
  childProfile: ChildProfileForHeader | null;
  allProfiles: ChildProfileForHeader[];
  handleBackToChild: () => void;
  handleReturnToProfiles: () => void;
  handleProfileSwitch: (profileId: string) => void;
}

const ParentZoneHeader = ({ childProfile, allProfiles, handleBackToChild, handleReturnToProfiles, handleProfileSwitch }: ParentZoneHeaderProps) => {
  return (
    <>
      <header className="p-4 border-b border-white/10 bg-wonderwhiz-dark/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <WonderWhizLogo className="h-8" />
            <span className="ml-3 font-baloo font-bold text-white">Parent Zone</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {allProfiles && allProfiles.length > 1 && childProfile && (
              <Select onValueChange={handleProfileSwitch} value={childProfile.id}>
                <SelectTrigger className="w-auto min-w-[150px] text-white bg-white/10 border-white/20 hover:bg-white/20 data-[state=open]:ring-2 data-[state=open]:ring-wonderwhiz-purple focus:ring-offset-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                       <AvatarFallback className="bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-pink text-white text-xs">
                         {childProfile.name.charAt(0)}
                       </AvatarFallback>
                    </Avatar>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-wonderwhiz-dark/90 border-white/20 text-white">
                  {allProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id} className="cursor-pointer hover:bg-wonderwhiz-purple/50 focus:bg-wonderwhiz-purple">
                       <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                           <AvatarFallback className="bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-pink text-white text-xs">
                             {profile.name.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <span>{profile.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {childProfile && (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={handleBackToChild}
              >
                <User className="h-4 w-4 mr-2" />
                Child View
              </Button>
            )}
            
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={handleReturnToProfiles}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Profiles
            </Button>
          </div>
        </div>
      </header>
      
      {childProfile && (
        <div className="mb-8 max-w-6xl mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarFallback className="bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-pink text-white text-2xl">
                  {childProfile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-white">{childProfile.name}'s Dashboard</h1>
                <p className="text-white/70">Age: {childProfile.age} • Joined: {new Date(childProfile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-white/10 px-4 py-2 rounded-lg">
              <Sparkles className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
              <div className="text-right">
                <div className="text-xl font-bold text-white">{childProfile.sparks_balance}</div>
                <div className="text-xs text-white/70">Total Sparks</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParentZoneHeader;
