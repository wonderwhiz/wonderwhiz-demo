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
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-white hover:text-wonderwhiz-yellow transition-colors">Home</Link>
        <Link to="/about" className="text-white hover:text-wonderwhiz-yellow transition-colors">About</Link>
        <Link to="/features" className="text-white hover:text-wonderwhiz-yellow transition-colors">Features</Link>
        <Link to="/pricing" className="text-white hover:text-wonderwhiz-yellow transition-colors">Pricing</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button variant="ghost" className="hover:bg-opacity-20 text-white bg-wonderwhiz-gold">
            Login
          </Button>
        </Link>
        <Link to="/profiles">
          
        </Link>
      </div>
    </nav>;
};
export default Navbar;