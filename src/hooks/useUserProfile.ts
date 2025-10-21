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
  const [availableProfiles, setAvailableProfiles] = useState<UserProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    localStorage.getItem('selectedProfileId')
  );

  useEffect(() => {
    loadProfile();
    loadAvailableProfiles();
  }, [selectedProfileId]);

  const loadAvailableProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .is('user_id', null)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading available profiles:', error);
        return;
      }

      if (data) {
        // Remove duplicates by name
        const uniqueProfiles = data.reduce((acc: any[], current: any) => {
          const exists = acc.find(p => p.name === current.name);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        const profiles = uniqueProfiles.map(d => ({
          id: d.id,
          user_id: d.user_id,
          name: d.name || 'User',
          interests: d.interests || [],
          hostel_preferences: (d.hostel_preferences as any) || {},
          preferred_destinations: d.preferred_destinations || [],
          budget_range: (d.budget_range as any) || { min: 20, max: 50 },
          travel_style: d.travel_style || 'backpacker',
          age_range: d.age_range || '18-30'
        }));
        
        console.log('Available profiles loaded:', profiles.length);
        setAvailableProfiles(profiles);
      }
    } catch (error) {
      console.error('Error loading available profiles:', error);
    }
  };

  const loadProfile = async () => {
    try {
      // Priority 1: Load selected profile if exists
      if (selectedProfileId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', selectedProfileId)
          .single();

        if (!error && data) {
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
          setLoading(false);
          return;
        }
      }

      // Priority 2: Check for authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          setProfile(MOCK_GUEST_PROFILE);
        } else {
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
        // Priority 3: Use mock profile as fallback
        setProfile(MOCK_GUEST_PROFILE);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(MOCK_GUEST_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const switchProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    localStorage.setItem('selectedProfileId', profileId);
    setLoading(true);
  };

  return { 
    profile, 
    loading, 
    availableProfiles, 
    switchProfile, 
    selectedProfileId 
  };
};
