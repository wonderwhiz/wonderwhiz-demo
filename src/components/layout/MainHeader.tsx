
import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';

interface MainHeaderProps {
  childId: string;
  profileName?: string;
}

const MainHeader = ({ childId, profileName }: MainHeaderProps) => {
  return (
    <header className="px-4 py-3 border-b border-white/10 bg-wonderwhiz-deep-purple/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={`/dashboard/${childId}`} className="flex items-center">
          <WonderWhizLogo className="h-8" />
          <span className="ml-3 font-baloo font-bold text-white">WonderWhiz</span>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative text-white hover:bg-white/10">
              <User className="h-5 w-5 mr-2" />
              <span>{profileName || 'Profile'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-wonderwhiz-deep-purple/95 border-white/20">
            <DropdownMenuItem asChild>
              <Link to="/profiles" className="flex items-center cursor-pointer text-white hover:bg-white/10">
                <User className="h-4 w-4 mr-2" />
                Switch Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/parent-zone/${childId}`} className="flex items-center cursor-pointer text-white hover:bg-white/10">
                <User className="h-4 w-4 mr-2" />
                Parent Zone
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default MainHeader;
