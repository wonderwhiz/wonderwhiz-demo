
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle, Menu, X, Search, Home, Settings, LogOut, HelpCircle, Sparkles } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  childName: string;
  profileId?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ childName, profileId }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    toast.success('Bye for now! Come back soon!', {
      icon: '👋',
      position: 'bottom-center'
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-wonderwhiz-dark/80 backdrop-blur-xl border-b border-white/10 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="text-white hover:text-wonderwhiz-gold transition-colors mr-2 lg:hidden" />
        
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <WonderWhizLogo className="h-8 w-8 sm:h-9 sm:w-9" />
          <motion.h1 
            className="ml-2 font-baloo text-xl text-white hidden sm:block"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            WonderWhiz
          </motion.h1>
        </motion.div>
      </div>
      
      <div className="flex-1 max-w-xl mx-auto px-4 hidden md:block">
        <motion.div 
          className="relative text-white/60"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search for space, animals, dinosaurs..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/10 border border-white/10 focus:outline-none focus:ring-1 focus:ring-wonderwhiz-gold/50 focus:border-wonderwhiz-gold/50 text-sm placeholder:text-white/40"
            onClick={() => {
              const searchInput = document.querySelector('input[placeholder="What are you curious about? (e.g., Why is the sky blue?)"]') as HTMLElement;
              if (searchInput) {
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                searchInput.focus();
              }
            }}
          />
        </motion.div>
      </div>
      
      <div className="flex items-center gap-2">
        <motion.div 
          className="hidden sm:flex items-center mr-2 bg-wonderwhiz-dark/60 border border-white/10 px-3 py-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Sparkles className="h-4 w-4 text-wonderwhiz-gold mr-1" />
          <span className="text-white text-sm font-medium">Hello, {childName}</span>
        </motion.div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white hover:bg-white/10 rounded-full"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserCircle className="h-8 w-8 sm:h-9 sm:w-9 text-wonderwhiz-purple" />
              </motion.div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-wonderwhiz-dark/95 border-white/20 backdrop-blur-xl text-white">
            <DropdownMenuLabel className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-wonderwhiz-gold" />
              <span>{childName}</span>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 text-wonderwhiz-blue" />
              <span>Home</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
              onClick={() => navigate(`/parent-zone/${profileId}`)}
            >
              <Settings className="h-4 w-4 text-wonderwhiz-pink" />
              <span>Parent Zone</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
              onClick={() => navigate('/help')}
            >
              <HelpCircle className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
              <span>Help</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-white hover:bg-red-500/20 focus:bg-red-500/20 hover:text-red-400 focus:text-red-400 cursor-pointer" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-white hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-wonderwhiz-dark/95 backdrop-blur-md flex flex-col lg:hidden pt-16"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <div className="relative text-white/60 mb-4">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search topics..."
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-white/10 border border-white/10 focus:outline-none focus:ring-1 focus:ring-wonderwhiz-gold/50 focus:border-wonderwhiz-gold/50"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const searchInput = document.querySelector('input[placeholder="What are you curious about? (e.g., Why is the sky blue?)"]') as HTMLElement;
                    if (searchInput) {
                      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      searchInput.focus();
                    }
                  }}
                />
              </div>
              
              {[
                { icon: <Home className="h-5 w-5" />, label: "Home", action: () => navigate('/') },
                { icon: <Settings className="h-5 w-5" />, label: "Parent Zone", action: () => navigate(`/parent-zone/${profileId}`) },
                { icon: <HelpCircle className="h-5 w-5" />, label: "Help", action: () => navigate('/help') },
                { icon: <LogOut className="h-5 w-5" />, label: "Logout", action: handleLogout, danger: true },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg w-full text-left 
                            ${item.danger 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                              : 'bg-white/10 text-white hover:bg-white/15'}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    item.action();
                  }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default DashboardHeader;
