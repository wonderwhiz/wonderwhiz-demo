
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, RefreshCw, User, LogOut, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CurioPageHeaderProps {
  curioTitle: string | null;
  handleBackToDashboard: () => void;
  handleToggleInsights: () => void;
  handleRefresh: () => void;
  refreshing: boolean;
  showInsights: boolean;
  profileId?: string;
  childName?: string;
}

const CurioPageHeader: React.FC<CurioPageHeaderProps> = ({
  curioTitle,
  handleBackToDashboard,
  handleToggleInsights,
  handleRefresh,
  refreshing,
  showInsights,
  profileId,
  childName
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <motion.div 
      className="py-3 sm:py-6 px-4 sm:px-6 bg-gradient-to-r from-wonderwhiz-deep-purple/80 to-wonderwhiz-deep-purple/60 border-b border-white/10 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToDashboard}
            className="text-white/70 hover:text-white -ml-2 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
          
          <div className="flex items-center">
            <WonderWhizLogo className="h-8 mr-2" />
            {curioTitle && (
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-1 sm:line-clamp-none">
                {curioTitle}
              </h1>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-wonderwhiz-dark/95 border-white/20 backdrop-blur-xl text-white">
                {childName && (
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="h-4 w-4 text-wonderwhiz-gold" />
                    <span>{childName}</span>
                  </DropdownMenuLabel>
                )}
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                {profileId && (
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                    onClick={() => navigate(`/parent-zone/${profileId}`)}
                  >
                    <ArrowLeftRight className="h-4 w-4 text-wonderwhiz-blue" />
                    <span>Parent Zone</span>
                  </DropdownMenuItem>
                )}
                
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleInsights}
              className={`text-white/90 border-white/20 hover:bg-white/10 bg-white/5 flex items-center backdrop-blur-md ${showInsights ? 'bg-white/10' : ''}`}
            >
              <Brain className="w-4 h-4 mr-1.5 text-wonderwhiz-bright-pink" />
              <span className="hidden sm:inline">Learning Insights</span>
              <span className="sm:hidden">Insights</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-white/70 hover:text-white hover:bg-white/10"
              title="Refresh content"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurioPageHeader;
