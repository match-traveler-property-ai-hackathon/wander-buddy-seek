import { UserProfile } from '@/hooks/useUserProfile';

export function buildProfileQuery(profile: UserProfile): string {
  const parts: string[] = [];
  
  // Interests
  if (profile.interests?.length > 0) {
    parts.push(`I'm interested in ${profile.interests.join(', ')}`);
  }
  
  // Hostel preferences
  const prefs = Object.entries(profile.hostel_preferences || {})
    .filter(([_, value]) => value)
    .map(([key, _]) => key.replace(/_/g, ' '));
  if (prefs.length > 0) {
    parts.push(`I like hostels with ${prefs.join(', ')}`);
  }
  
  // Destinations
  if (profile.preferred_destinations?.length > 0) {
    const destinations = profile.preferred_destinations.join(', ');
    parts.push(`I want to travel around ${destinations}`);
  }
  
  // Budget
  if (profile.budget_range) {
    parts.push(`with prices between $${profile.budget_range.min}-${profile.budget_range.max} per night`);
  }
  
  parts.push('Show me the best hostels with availability that suit me');
  
  return parts.join('. ') + '.';
}
