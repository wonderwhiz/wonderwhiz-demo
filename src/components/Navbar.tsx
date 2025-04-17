
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { User, LogOut, Settings, Users } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NavbarProps {
  profileId?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  pageTitle?: string;
}

const Navbar = ({ profileId, showBackButton, onBackClick, pageTitle }: NavbarProps) => {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('You have been signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };

  const navigateToParentZone = () => {
    if (profileId) {
      navigate(`/parent-zone/${profileId}`);
    }
  };

  const navigateToProfiles = () => {
    navigate('/profiles');
  };

  return (
    <nav className="py-4 px-6 md:px-10 lg:px-20 flex justify-between items-center relative z-10 bg-gradient-to-r from-wonderwhiz-deep-purple to-wonderwhiz-purple backdrop-blur-md border-b border-white/10">
      <div className="flex items-center">
        {showBackButton && onBackClick && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBackClick}
            className="mr-3 bg-white/10 hover:bg-white/20 text-white rounded-full h-8 w-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Button>
        )}
        <Link to={profileId ? `/dashboard/${profileId}` : '/'} className="flex items-center">
          <WonderWhizLogo className="h-10 md:h-12" />
          <span className="ml-3 text-xl md:text-2xl font-baloo font-bold text-white">WonderWhiz</span>
        </Link>
        
        {pageTitle && (
          <div className="hidden md:block ml-6 pl-6 border-l border-white/20">
            <h1 className="text-white font-medium">{pageTitle}</h1>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {profileId ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-opacity-20 text-white bg-white/10">
                <User className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-wonderwhiz-purple border border-white/20">
              <DropdownMenuLabel className="text-white">Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={navigateToProfiles}
              >
                <Users className="h-4 w-4 mr-2" />
                Switch Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={navigateToParentZone}
              >
                <Settings className="h-4 w-4 mr-2" />
                Parent Zone
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button variant="ghost" className="hover:bg-opacity-20 text-white bg-white/10">
              <User className="h-5 w-5 mr-1" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
