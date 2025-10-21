import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Hostel {
  name: string;
  image: string;
  rating: number;
  distance: string;
  price: number;
  benefits: string[];
  bookingLink?: string;
}

export const useMcpHostelSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [hostels, setHostels] = useState<Hostel[]>([]);

  const searchHostels = async (query: string, profileBased: boolean = false) => {
    if (!query.trim()) return { success: false, count: 0 };

    setIsSearching(true);
    console.log('Starting MCP hostel search:', query);
    console.log('Profile-based:', profileBased);

    try {
      // Call edge function which handles MCP server connection and Claude integration
      const { data, error } = await supabase.functions.invoke('hostel-search', {
        body: { query, profileBased }
      });

      console.log('Search response:', data);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      if (data?.hostels && Array.isArray(data.hostels) && data.hostels.length > 0) {
        setHostels(data.hostels);
        return { success: true, count: data.hostels.length };
      } else {
        return { success: false, count: 0 };
      }
    } catch (error) {
      console.error('Error in MCP hostel search:', error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchHostels,
    isSearching,
    hostels
  };
};
