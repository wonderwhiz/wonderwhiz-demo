
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';

const ProfileSelector = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: childProfiles, error } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('parent_user_id', user.id);

        if (error) throw error;

        if (childProfiles.length === 0) {
          // If no profiles exist, redirect to create profile
          navigate('/create-profile');
        } else if (childProfiles.length === 1) {
          // If only one profile exists, go directly to new dashboard
          navigate(`/new-dashboard/${childProfiles[0].id}`);
        } else {
          // Multiple profiles exist
          setProfiles(childProfiles);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
        toast.error('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-purple p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Choose a Profile</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile: any) => (
            <button
              key={profile.id}
              onClick={() => navigate(`/new-dashboard/${profile.id}`)}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors p-6 rounded-xl border border-white/10 text-left"
            >
              <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center">
                    <span className="text-2xl text-wonderwhiz-bright-pink">
                      {profile.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                  <p className="text-white/70">Age: {profile.age}</p>
                </div>
              </div>
            </button>
          ))}
          
          <button
            onClick={() => navigate('/create-profile')}
            className="border-2 border-dashed border-white/20 hover:border-white/40 transition-colors p-6 rounded-xl flex items-center justify-center min-h-[144px]"
          >
            <span className="text-white/70 hover:text-white transition-colors">Add New Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelector;
