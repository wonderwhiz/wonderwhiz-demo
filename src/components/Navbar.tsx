
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { User, Home } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    // Check if there's a current profile in localStorage
    const currentProfile = localStorage.getItem('currentChildProfile');
    if (currentProfile) {
      const profile = JSON.parse(currentProfile);
      navigate(`/dashboard/${profile.id}`);
    } else {
      // Redirect to profile selector if no current profile
      navigate('/profiles');
    }
  };

  const handleProfilesClick = () => {
    navigate('/profiles');
  };

  return (
    <nav className="py-4 px-6 md:px-10 lg:px-20 flex justify-between items-center relative z-10 bg-wonderwhiz-deep-purple/90 backdrop-blur-md">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <WonderWhizLogo className="h-10 md:h-12" />
          <span className="ml-3 text-xl md:text-2xl font-baloo font-bold text-white">WonderWhiz</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          className="hover:bg-white/10 text-white"
          onClick={handleDashboardClick}
        >
          <Home className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
        <Link to="/login">
          <Button 
            variant="ghost" 
            className="bg-wonderwhiz-bright-pink/20 hover:bg-wonderwhiz-bright-pink/30 text-white"
          >
            Login
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="bg-white/10 hover:bg-white/20 text-white"
          onClick={handleProfilesClick}
        >
          <User className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Profiles</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
