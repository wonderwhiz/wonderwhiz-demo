
import { supabase } from './client';

/**
 * Fetches child profiles associated with a specific parent user
 * @param userId - The ID of the parent user
 * @returns Array of child profiles
 */
export const fetchProfiles = async (userId: string) => {
  if (!userId) {
    console.error('No user ID provided to fetchProfiles');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('parent_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProfiles:', error);
    return [];
  }
};

/**
 * Fetches a single child profile by ID
 * @param profileId - The ID of the child profile
 * @returns The child profile or null if not found
 */
export const fetchProfileById = async (profileId: string) => {
  if (!profileId) {
    console.error('No profile ID provided to fetchProfileById');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      console.error('Error fetching profile by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchProfileById:', error);
    return null;
  }
};

/**
 * Updates a child profile
 * @param profileId - The ID of the profile to update
 * @param updates - Object containing the field updates
 * @returns The updated profile or null if the update failed
 */
export const updateProfile = async (profileId: string, updates: any) => {
  if (!profileId) {
    console.error('No profile ID provided to updateProfile');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('child_profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return null;
  }
};
