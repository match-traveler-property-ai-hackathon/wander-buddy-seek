import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMcpHostelSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<'ai' | 'mcp' | 'sorting' | 'complete'>('ai');
  const [profileRecommendations, setProfileRecommendations] = useState<any>(null);
  const [aiSearchResults, setAiSearchResults] = useState<any>(null);

  const searchHostels = async (query: string, profileBased: boolean = false) => {
    if (!query.trim()) return { success: false, message: 'Empty query' };

    setIsSearching(true);
    setSearchStage('ai');
    console.log('Starting MCP hostel search:', query);
    console.log('Profile-based:', profileBased);

    try {
      // Stage 1: Checking AI
      setTimeout(() => setSearchStage('mcp'), 500);
      
      // Stage 2: After 2 seconds, assume we're checking Hostelworld via MCP
      setTimeout(() => setSearchStage('sorting'), 2000);
      
      // Call edge function which handles MCP server connection and Claude integration
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hostel-search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ query, profileBased })
        }
      );

      const data = await response.json();
      console.log('Search response:', data);

      // Handle rate limiting (429 status)
      if (response.status === 429 || data?.rateLimited) {
        console.log('Rate limited - request throttled');
        if (profileBased) {
          setProfileRecommendations(null);
        } else {
          setAiSearchResults(null);
        }
        return { 
          success: false, 
          message: data?.error || 'Rate limit exceeded. Please wait a moment and try again.',
          rateLimited: true 
        };
      }

      // Handle other errors
      if (!response.ok) {
        console.error('Search error:', response.status, data);
        return {
          success: false,
          message: data?.error || `Request failed with status ${response.status}`,
          rateLimited: false
        };
      }

      if (data?.message === "No results found on Inv MCP") {
        console.log('No results found on Inv MCP');
        if (profileBased) {
          setProfileRecommendations(null);
        } else {
          setAiSearchResults(null);
        }
        return { success: false, message: 'No results found on Inv MCP' };
      }

      if (data?.mcpResponse) {
        // Store in appropriate state based on search type
        if (profileBased) {
          setProfileRecommendations(data.mcpResponse);
        } else {
          setAiSearchResults(data.mcpResponse);
        }
        setSearchStage('complete');
        return { success: true, message: 'Results found' };
      } else {
        return { success: false, message: 'No MCP response' };
      }
    } catch (error) {
      console.error('Error in MCP hostel search:', error);
      if (profileBased) {
        setProfileRecommendations(null);
      } else {
        setAiSearchResults(null);
      }
      return {
        success: false,
        message: 'Search failed. Please try again.',
        rateLimited: false
      };
    } finally {
      setIsSearching(false);
      setSearchStage('complete');
    }
  };

  return {
    searchHostels,
    isSearching,
    searchStage,
    profileRecommendations,
    aiSearchResults
  };
};
