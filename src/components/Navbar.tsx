
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { User } from 'lucide-react';

const Navbar = () => {
  return <nav className="py-4 px-6 md:px-10 lg:px-20 flex justify-between items-center relative z-10">
      <div className="flex items-center">
        <WonderWhizLogo className="h-10 md:h-12" />
        <span className="ml-3 text-xl md:text-2xl font-baloo font-bold text-white">WonderWhiz</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button variant="ghost" className="hover:bg-opacity-20 text-white bg-wonderwhiz-pink bg-[wonderwhiz-bright-pink]">
            Login
          </Button>
        </Link>
        <Link to="/profiles">
          <Button variant="ghost" className="hover:bg-opacity-20 text-white">
            <User className="h-5 w-5 mr-1" />
            Profiles
          </Button>
        </Link>
      </div>
    </nav>;
};

export default Navbar;
