
import { supabase } from '@/integrations/supabase/client';

export async function handleAuthRedirect() {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session, redirecting to login');
      window.location.href = '/login';
      return null;
    }
    
    // Get child profiles for this user
    const { data: childProfiles, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('parent_user_id', session.user.id);
    
    if (error) throw error;
    
    // Determine where to redirect based on child profiles
    if (!childProfiles || childProfiles.length === 0) {
      console.log('No child profiles found, redirecting to create profile');
      window.location.href = '/create-profile';
      return null;
    } else if (childProfiles.length === 1) {
      // Single profile - go directly to dashboard
      console.log('Single profile found, redirecting to dashboard', childProfiles[0].id);
      window.location.href = `/new-dashboard/${childProfiles[0].id}`;
      return childProfiles[0];
    } else {
      // Multiple profiles - go to selector
      console.log('Multiple profiles found, redirecting to profile selector');
      window.location.href = '/profiles';
      return childProfiles;
    }
  } catch (error) {
    console.error('Error in auth redirect:', error);
    return null;
  }
}

export function ensureAuthenticated(callback: () => void) {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      window.location.href = '/login';
    } else {
      callback();
    }
  });
}
