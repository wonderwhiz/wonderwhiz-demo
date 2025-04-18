
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, LogOut, Settings, User, Book, CheckSquare, 
  Sparkles, Award, Clock, Calendar
} from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface DashboardSidebarProps {
  profile: any;
  onClose?: () => void;
  sparksBalance?: number;
  pastCurios?: Curio[];
  currentCurioId?: string;
  onCurioSelect?: (curio: Curio) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  profile, 
  onClose,
  sparksBalance,
  pastCurios = [],
  currentCurioId,
  onCurioSelect
}) => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (!profile) {
    return (
      <Sidebar 
        side="left"
        className="border-r border-white/10"
      >
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-white rounded-full"></div>
        </div>
      </Sidebar>
    );
  }
  
  return (
    <Sidebar 
      side="left" 
      className="border-r border-white/10"
    >
      <SidebarHeader>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
            <AvatarFallback className="bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold text-white">{profile.name}</h2>
            <p className="text-sm text-white/60">Age {profile.age}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-1">
          <Link to={`/dashboard/${profile.id}`}>
            <Button variant="ghost" className="w-full justify-start text-white">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <Link to={`/new-dashboard/${profile.id}`}>
            <Button variant="ghost" className="w-full justify-start text-white">
              <Sparkles className="mr-2 h-4 w-4 text-wonderwhiz-gold" />
              Wonder Canvas ✨
            </Button>
          </Link>
          
          <h3 className="text-white/50 text-xs font-medium uppercase mt-4 mb-2 px-2">Learning</h3>
          
          <Button variant="ghost" className="w-full justify-start text-white">
            <Book className="mr-2 h-4 w-4" />
            Past Explorations
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-white">
            <CheckSquare className="mr-2 h-4 w-4" />
            Tasks & Activities
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-white">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </Button>
          
          <h3 className="text-white/50 text-xs font-medium uppercase mt-4 mb-2 px-2">My Account</h3>
          
          <Link to={`/parent-zone/${profile.id}`}>
            <Button variant="ghost" className="w-full justify-start text-white">
              <User className="mr-2 h-4 w-4" />
              Parent Zone
            </Button>
          </Link>
          
          <Button variant="ghost" className="w-full justify-start text-white">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white/70 hover:text-white mt-6"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
