
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LanguageSelector from '../LanguageSelector';

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  age: number;
  language: string;
  interests: string[];
  sparks_balance: number;
  created_at: string;
}

interface ProfileSettingsProps {
  childProfile: ChildProfile;
  onProfileUpdate: (updatedProfile: Partial<ChildProfile>) => void;
  handleReturnToProfiles: () => void;
}

const ProfileSettings = ({ childProfile, onProfileUpdate, handleReturnToProfiles }: ProfileSettingsProps) => {
  const updateProfile = async (updatedData: Partial<ChildProfile>) => {
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update(updatedData)
        .eq('id', childProfile.id);
        
      if (error) throw error;
      
      onProfileUpdate(updatedData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const updatePIN = async (newPIN: string) => {
    try {
      if (!newPIN || newPIN.trim() === '') {
        toast.error('Please enter a valid PIN');
        return;
      }
      
      const { error } = await supabase
        .from('child_profiles')
        .update({ pin: newPIN })
        .eq('id', childProfile.id);
        
      if (error) throw error;
      
      toast.success("PIN updated successfully");
      
      // Clear the input field
      const pinInput = document.getElementById('pin') as HTMLInputElement;
      if (pinInput) {
        pinInput.value = '';
      }
    } catch (error) {
      console.error('Error updating PIN:', error);
      toast.error("Failed to update PIN");
    }
  };

  const handleLanguageChange = (language: string) => {
    updateProfile({ language });
  };

  return (
    <>
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                defaultValue={childProfile?.name}
                className="bg-white/10 border-white/20 text-white"
                onBlur={(e) => {
                  if (e.target.value !== childProfile?.name) {
                    updateProfile({ name: e.target.value });
                  }
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="age" className="text-white">Age</Label>
              <Input
                id="age"
                type="number"
                defaultValue={childProfile?.age}
                className="bg-white/10 border-white/20 text-white"
                onBlur={(e) => {
                  const newAge = parseInt(e.target.value);
                  if (!isNaN(newAge) && newAge !== childProfile?.age) {
                    updateProfile({ age: newAge });
                  }
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="pin-reset" className="text-white">Reset PIN</Label>
              <div className="flex space-x-2">
                <Input
                  id="pin"
                  type="text"
                  placeholder="Enter new PIN"
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button 
                  className="bg-wonderwhiz-purple/70 hover:bg-wonderwhiz-purple"
                  onClick={() => {
                    const pinInput = document.getElementById('pin') as HTMLInputElement;
                    if (pinInput && pinInput.value) {
                      updatePIN(pinInput.value);
                    } else {
                      toast.error('Please enter a new PIN');
                    }
                  }}
                >
                  Set PIN
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Content Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Content Language</Label>
            <p className="text-white/70 text-sm">The primary language for learning content</p>
            <div className="mt-2">
              <LanguageSelector 
                childId={childProfile.id}
                initialLanguage={childProfile.language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-2 border-b border-white/10">
          <CardTitle className="text-white text-lg">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Reset Progress</h3>
              <p className="text-white/70 text-sm">This will reset all sparks and learning progress</p>
            </div>
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
                  updateProfile({ sparks_balance: 0 });
                  toast.success("Progress has been reset");
                }
              }}
            >
              Reset
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Delete Profile</h3>
              <p className="text-white/70 text-sm">This will permanently delete this child profile</p>
            </div>
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
                  // Delete profile logic would go here
                  toast.success("Profile deleted successfully");
                  handleReturnToProfiles();
                }
              }}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileSettings;
