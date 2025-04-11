
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle, ArrowLeftRight, LogOut, User } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  childName: string;
  profileId?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ childName, profileId }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="sticky top-0 z-10 bg-wonderwhiz-dark/80 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="text-white hover:bg-white/10 rounded-full" />
      </div>
      
      <div className="flex-1 flex justify-center items-center">
        <Link to="/dashboard" className="flex items-center">
          <WonderWhizLogo className="h-8" />
          <span className="ml-2 font-baloo text-xl text-white hidden sm:block">WonderWhiz</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white hover:bg-white/10 rounded-full p-1"
            >
              <UserCircle className="h-10 w-10 text-wonderwhiz-purple" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-wonderwhiz-dark/95 border-white/20 backdrop-blur-xl text-white">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="h-4 w-4 text-wonderwhiz-gold" />
              <span>{childName}</span>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
              onClick={() => navigate(`/parent-zone/${profileId}`)}
            >
              <ArrowLeftRight className="h-4 w-4 text-wonderwhiz-blue" />
              <span>Parent Zone</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
              onClick={() => navigate('/profiles')}
            >
              <User className="h-4 w-4 text-wonderwhiz-bright-pink" />
              <span>Switch Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 hover:text-red-400 focus:text-red-400 cursor-pointer" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
