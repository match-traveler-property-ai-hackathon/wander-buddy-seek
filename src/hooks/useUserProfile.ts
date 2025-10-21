import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  user_id?: string;
  name: string;
  interests: string[];
  hostel_preferences: {
    bar?: boolean;
    pool?: boolean;
    kitchen?: boolean;
    social_events?: boolean;
    free_wifi?: boolean;
    air_conditioning?: boolean;
  };
  preferred_destinations: string[];
  budget_range: { min: number; max: number };
  travel_style: string;
  age_range: string;
}

// Mock profile for guests/unauthenticated users
const MOCK_GUEST_PROFILE: UserProfile = {
  id: 'guest-001',
  name: 'Travel Enthusiast',
  interests: ['surfing', 'party vibes', 'social atmosphere'],
  hostel_preferences: {
    bar: true,
    pool: false,
    kitchen: false,
    social_events: true,
    free_wifi: true,
    air_conditioning: false
  },
  preferred_destinations: [
    'Mediterranean coastline',
    'Spain',
    'France', 
    'Italy'
  ],
  budget_range: { min: 20, max: 50 },
  travel_style: 'social backpacker',
  age_range: '18-30'
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Try to fetch user profile from database
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          // No profile found, use mock profile
          setProfile(MOCK_GUEST_PROFILE);
        } else {
          // Transform database data to UserProfile
          setProfile({
            id: data.id,
            user_id: data.user_id,
            name: data.name || 'User',
            interests: data.interests || [],
            hostel_preferences: (data.hostel_preferences as any) || {},
            preferred_destinations: data.preferred_destinations || [],
            budget_range: (data.budget_range as any) || { min: 20, max: 50 },
            travel_style: data.travel_style || 'backpacker',
            age_range: data.age_range || '18-30'
          });
        }
      } else {
        // Not authenticated, use mock profile
        setProfile(MOCK_GUEST_PROFILE);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // On error, use mock profile
      setProfile(MOCK_GUEST_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading };
};
