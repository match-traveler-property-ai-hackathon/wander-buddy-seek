import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMcpHostelSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [mcpResponse, setMcpResponse] = useState<any>(null);

  const searchHostels = async (query: string, profileBased: boolean = false) => {
    if (!query.trim()) return { success: false, message: 'Empty query' };

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
        
        // Check for rate limiting
        if (error.message?.includes('429') || data?.rateLimited) {
          return { 
            success: false, 
            message: 'Rate limit exceeded. Please wait a moment and try again.',
            rateLimited: true 
          };
        }
        
        throw error;
      }

      // Check for rate limit in response
      if (data?.rateLimited) {
        console.log('Rate limited by Claude API');
        setMcpResponse(null);
        return { 
          success: false, 
          message: 'Rate limit exceeded. Please wait a moment and try again.',
          rateLimited: true 
        };
      }

      if (data?.message === "No results found on Inv MCP") {
        console.log('No results found on Inv MCP');
        setMcpResponse(null);
        return { success: false, message: 'No results found on Inv MCP' };
      }

      if (data?.mcpResponse) {
        setMcpResponse(data.mcpResponse);
        return { success: true, message: 'Results found' };
      } else {
        return { success: false, message: 'No MCP response' };
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
    mcpResponse
  };
};
