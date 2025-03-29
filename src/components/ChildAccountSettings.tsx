
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Lock, Languages } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface ChildAccountSettingsProps {
  childId: string;
  initialData?: {
    name?: string;
    age?: number;
    pin?: string;
    language?: string;
  };
  onChange?: () => void;
}

const ChildAccountSettings = ({ childId, initialData, onChange }: ChildAccountSettingsProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState(initialData?.age || 7);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    // Validate PIN if it's being changed
    if (pin) {
      if (pin.length < 4) {
        toast.error("PIN must be at least 4 characters long");
        return;
      }
      
      if (pin !== confirmPin) {
        toast.error("PINs don't match");
        return;
      }
    }

    setIsUpdating(true);
    try {
      const updates: any = {
        name: name.trim(),
        age: age
      };

      if (pin) {
        updates.pin = pin;
      }

      const { error } = await supabase
        .from('child_profiles')
        .update(updates)
        .eq('id', childId);

      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setPin('');
      setConfirmPin('');
      
      if (onChange) {
        onChange();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLanguageChange = () => {
    if (onChange) {
      onChange();
    }
  };
  
  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Child's name"
            disabled={isUpdating}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
            placeholder="Child's age"
            min={5}
            max={12}
            disabled={isUpdating}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center mb-1">
            <Languages className="h-4 w-4 mr-1 text-wonderwhiz-purple" />
            <Label>Preferred Language</Label>
          </div>
          <LanguageSelector 
            childId={childId} 
            initialLanguage={initialData?.language || 'English'} 
            onLanguageChange={handleLanguageChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            This will change the language for all AI responses and content
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center mb-1">
            <Lock className="h-4 w-4 mr-1 text-wonderwhiz-purple" />
            <Label>Change PIN</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-sm">New PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter new PIN"
              disabled={isUpdating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPin" className="text-sm">Confirm PIN</Label>
            <Input
              id="confirmPin"
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirm new PIN"
              disabled={isUpdating}
            />
          </div>
          
          <p className="text-xs text-gray-500">
            Leave blank if you don't want to change the PIN
          </p>
        </div>
        
        <Button 
          onClick={handleUpdateProfile}
          className="w-full bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80" 
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChildAccountSettings;
