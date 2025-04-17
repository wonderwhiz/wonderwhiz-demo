
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { User, Home, BookOpen } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="py-4 px-6 md:px-10 lg:px-20 flex justify-between items-center relative z-10">
      <div className="flex items-center">
        <WonderWhizLogo className="h-10 md:h-12" />
        <span className="ml-3 text-xl md:text-2xl font-baloo font-bold text-white">WonderWhiz</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="hover:bg-opacity-20 text-white bg-wonderwhiz-blue bg-opacity-20">
            <Home className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Home</span>
          </Button>
        </Link>
        
        <Link to="/library">
          <Button variant="ghost" size="sm" className="hover:bg-opacity-20 text-white bg-wonderwhiz-green bg-opacity-20">
            <BookOpen className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Library</span>
          </Button>
        </Link>
        
        <Link to="/profiles">
          <Button variant="ghost" size="sm" className="hover:bg-opacity-20 text-white bg-wonderwhiz-pink bg-opacity-20">
            <User className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Profile</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
