
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { fetchProfiles } from '@/integrations/supabase/profiles';
import { toast } from 'sonner';

const Index = () => {
  const { user } = useUser();
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadProfiles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const childProfiles = await fetchProfiles(user.id);
        setProfiles(childProfiles);
      } catch (error) {
        console.error('Error loading profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfiles();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-purple text-white">
      {/* Hero section with animated background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-deep-purple via-indigo-900 to-purple-950"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white animate-float"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                }}
              />
            ))}
          </div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-wonderwhiz-bright-pink/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-wonderwhiz-cyan/20 rounded-full filter blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-20 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-wonderwhiz-bright-pink/70">
            Welcome to WonderWhiz
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto">
            Ignite your child's curiosity with AI-powered learning adventures
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                {profiles.length > 0 ? (
                  <>
                    <Link to={`/dashboard/${profiles[0].id}`}>
                      <Button size="lg" className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-bold">
                        Go to Dashboard
                      </Button>
                    </Link>
                    
                    <Link to={`/new-dashboard/${profiles[0].id}`}>
                      <Button size="lg" className="bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-bold">
                        Try New Dashboard ✨
                      </Button>
                    </Link>
                    
                    <Link to="/profiles">
                      <Button size="lg" variant="outline">
                        View All Profiles
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/create-profile">
                      <Button size="lg" className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-bold">
                        Create a Profile
                      </Button>
                    </Link>
                    
                    <Link to="/profiles">
                      <Button size="lg" variant="outline">
                        Manage Profiles
                      </Button>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-bold">
                    Get Started
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
                
                <Link to="/demo">
                  <Button size="lg" variant="ghost">
                    Try Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
