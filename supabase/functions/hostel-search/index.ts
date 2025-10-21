import "https://deno.land/x/xhr@0.1.0/mod.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MCP_SERVER_URL = 'https://test.apigee.hostelworld.com/inventory-mcp-service-plan-trip-server/mcp';

// Simple in-memory cache for MCP tools (5 minute TTL)
let mcpToolsCache: { tools: any[], timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Retry with exponential backoff for rate limiting and server errors
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  isToolResultCall = false
): Promise<Response> {
  let lastError: Error | null = null;
  const MAX_WAIT_TIME = 30000; // Cap wait time at 30 seconds
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting (429)
      if (response.status === 429) {
        if (isToolResultCall) {
          console.log('Rate limited on tool result call, not retrying to avoid timeout');
          return response;
        }
        
        const retryAfter = response.headers.get('retry-after');
        let waitTime = retryAfter 
          ? Math.min(parseInt(retryAfter) * 1000, MAX_WAIT_TIME)
          : Math.min(1000 * Math.pow(2, attempt), 10000);
        
        console.log(`Rate limited (429). Retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      // Handle server errors (500, 502, 503, 504)
      if (response.status >= 500 && response.status < 600) {
        console.log(`Server error (${response.status}). Retrying in ${1000 * Math.pow(2, attempt)}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        if (attempt < maxRetries - 1) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

// Fetch MCP tools with caching
async function getMcpTools(): Promise<any[]> {
  // Check cache
  if (mcpToolsCache && Date.now() - mcpToolsCache.timestamp < CACHE_TTL) {
    console.log('Using cached MCP tools');
    return mcpToolsCache.tools;
  }
  
  console.log('Fetching fresh MCP tools');
  try {
    const mcpResponse = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 1
      })
    });

    if (mcpResponse.ok) {
      const mcpData = await mcpResponse.json();
      const tools = mcpData.result?.tools?.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema || { type: 'object', properties: {} }
      })) || [];
      
      // Update cache
      mcpToolsCache = { tools, timestamp: Date.now() };
      console.log('Cached', tools.length, 'MCP tools');
      
      return tools;
    }
  } catch (error) {
    console.warn('Error fetching MCP tools:', error);
  }
  
  return [];
}

// Analyze query to determine which fields are needed
function analyzeQueryForFields(query: string): {
  needsFacilities: boolean;
  needsRooms: boolean;
  needsOverview: boolean;
  needsRatingBreakdown: boolean;
} {
  const lowerQuery = query.toLowerCase();
  
  // Keywords that indicate we need facilities data
  const facilityKeywords = [
    'facilities', 'amenities', 'wifi', 'pool', 'bar', 'kitchen', 'breakfast',
    'laundry', 'parking', 'gym', 'locker', 'air conditioning', 'ac',
    'coworking', 'workspace', 'social', 'terrace', 'rooftop', 'common room'
  ];
  
  // Keywords that indicate we need rooms data
  const roomKeywords = [
    'room', 'dorm', 'private', 'ensuite', 'bed', 'bedroom', 'shared',
    'female only', 'male only', 'mixed', 'capacity', 'bunk'
  ];
  
  // Keywords that indicate we need detailed overview
  const overviewKeywords = [
    'atmosphere', 'vibe', 'description', 'about', 'story', 'experience',
    'style', 'culture', 'environment', 'unique', 'special'
  ];
  
  // Keywords that indicate we need detailed ratings
  const ratingKeywords = [
    'rating', 'review', 'score', 'clean', 'cleanliness', 'security',
    'staff', 'location rating', 'value', 'safety'
  ];
  
  return {
    needsFacilities: facilityKeywords.some(keyword => lowerQuery.includes(keyword)),
    needsRooms: roomKeywords.some(keyword => lowerQuery.includes(keyword)),
    needsOverview: overviewKeywords.some(keyword => lowerQuery.includes(keyword)),
    needsRatingBreakdown: ratingKeywords.some(keyword => lowerQuery.includes(keyword))
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, profileBased } = await req.json();
    
    // Handle list-tools action for MCP Inspector
    if (action === 'list-tools') {
      console.log('Fetching tools list for MCP Inspector');
      
      try {
        const mcpResponse = await fetch(MCP_SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/list',
            id: 1
          })
        });

        if (mcpResponse.ok) {
          const mcpData = await mcpResponse.json();
          console.log('MCP tools fetched successfully');
          
          return new Response(JSON.stringify({ 
            success: true,
            tools: mcpData.result?.tools || []
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          throw new Error(`MCP server returned ${mcpResponse.status}`);
        }
      } catch (mcpError) {
        console.error('Error fetching MCP tools:', mcpError);
        return new Response(JSON.stringify({ 
          success: false,
          error: mcpError instanceof Error ? mcpError.message : 'Failed to fetch tools',
          tools: []
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Handle regular hostel search
    console.log('Received hostel search query:', query);
    console.log('Profile-based search:', profileBased);

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    // Step 1: Get MCP tools (with caching)
    const mcpTools = await getMcpTools();

    // Step 2: Build Claude request with MCP tools and enhanced prompt for profile-based searches
    // Get today's date for context
    const today = new Date('2025-10-21');
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const systemPrompt = profileBased 
      ? `You are a personalized hostel recommendation assistant with access to the Hostelworld inventory system.

IMPORTANT: Today's date is ${todayStr} (October 21st, 2025). When using the MCP tools, you MUST provide dates in the future (after ${todayStr}). Use YYYY-MM-DD format for all dates.

This is a PROFILE-BASED search. The user query contains their travel preferences, interests, and requirements.

Your task:
1. Carefully analyze the user's preferences mentioned in the query
2. ${mcpTools.length > 0 ? 'Use the available MCP tools to search the Hostelworld inventory' : 'Search for relevant hostels based on the query'}
3. When calling MCP tools with dates:
   - If no specific date is mentioned, use dates starting from ${todayStr} or later
   - If "tonight" or "today" is mentioned, use ${todayStr}
   - Always ensure dates are in YYYY-MM-DD format and in the future
4. Find hostels that BEST MATCH the user's:
   - Interests (e.g., surfing, partying, culture)
   - Preferred amenities (e.g., bar, pool, social events)
   - Destination preferences
   - Budget range
5. Prioritize hostels with good ratings (7+ preferred)
6. Include hostels with availability

After getting results, format them as a JSON array with this structure:
[
  {
    "name": "hostel name",
    "rating": 4.5,
    "distance": "0.5km from center",
    "price": 25,
    "benefits": ["benefit1", "benefit2", "benefit3"],
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
    "bookingLink": "https://www.hostelworld.com/..."
  }
]

Return only the JSON array, no markdown or explanation.`
      : `You are a hostel search assistant with access to the Hostelworld inventory system.

IMPORTANT: Today's date is ${todayStr} (October 21st, 2025). When using the MCP tools, you MUST provide dates in the future (after ${todayStr}). Use YYYY-MM-DD format for all dates.

Guidelines:
- If no specific date is mentioned, use dates starting from ${todayStr} or later
- If "tonight" or "today" is mentioned, use ${todayStr}
- Always ensure dates are in YYYY-MM-DD format and in the future

Find hostels matching this query and format them as a JSON array with this structure:
[
  {
    "name": "hostel name",
    "rating": 4.5,
    "distance": "0.5km from center",
    "price": 25,
    "benefits": ["benefit1", "benefit2", "benefit3"],
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
    "bookingLink": "https://www.hostelworld.com/..."
  }
]

${mcpTools.length > 0 ? 'Use the available MCP tools to search the Hostelworld inventory.' : 'Search for relevant hostels based on the query.'}

Return only the JSON array, no markdown or explanation.`;

    const claudeRequest: any = {
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: query
        }
      ],
    };

    // Add MCP tools if available
    if (mcpTools.length > 0) {
      claudeRequest.tools = mcpTools;
      console.log('Added', mcpTools.length, 'MCP tools to Claude request');
    }

    // Step 3: Call Claude with MCP tools (with retry logic)
    console.log('Calling Claude API...');
    const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(claudeRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      
      // Return user-friendly error messages
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment and try again.',
          rateLimited: true
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Claude response:', JSON.stringify(data, null, 2));

    // Step 4: Handle tool calls if Claude wants to use MCP tools
    let finalContent = '';
    let toolResults: any[] = [];
    
    if (data.stop_reason === 'tool_use') {
      console.log('Claude requested tool use, processing...');
      
      // Extract tool calls from Claude's response
      const toolUses = data.content.filter((block: any) => block.type === 'tool_use');
      console.log('Tool uses:', JSON.stringify(toolUses, null, 2));
      
      // Execute MCP tool calls
      for (const toolUse of toolUses) {
        console.log(`Executing MCP tool: ${toolUse.name} with input:`, toolUse.input);
        console.log('Stage: MCP - Calling Hostelworld MCP server');
        
        try {
          const mcpToolResponse = await fetch(MCP_SERVER_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/event-stream'
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'tools/call',
              params: {
                name: toolUse.name,
                arguments: toolUse.input
              },
              id: toolUse.id
            })
          });
          
          const mcpResult = await mcpToolResponse.json();
          console.log('Stage: MCP - Results received from Hostelworld');
          console.log('MCP tool result received');
          
          // Return all fields - no filtering
          let summarizedResult = mcpResult;
          
          if (mcpResult.result?.structuredContent?.hostels) {
            const hostels = mcpResult.result.structuredContent.hostels;
            console.log(`Returning ${hostels.length} hostels with all available fields`);
            
            // Log facilities for debugging
            hostels.forEach((h: any, idx: number) => {
              const facilityCount = h.facilities?.length || 0;
              const facilityNames = h.facilities?.flatMap((cat: any) => 
                cat.facilities?.map((f: any) => f.name) || []
              ).slice(0, 5) || [];
              console.log(`Hostel ${idx + 1} (${h.name}): ${facilityCount} facility categories, sample: ${facilityNames.join(', ')}`);
            });
            
            // Return complete hostel data with all optional fields
            summarizedResult = {
              result: {
                structuredContent: {
                  hostels: hostels.map((h: any) => ({
                    id: h.id,
                    name: h.name,
                    lowestPricePerNight: h.lowestPricePerNight,
                    images: h.images || [],
                    bookingLink: h.bookingLink,
                    overallRating: h.overallRating,
                    distance: h.distance,
                    // Include all optional fields
                    facilities: h.facilities,
                    rooms: h.rooms,
                    overview: h.overview,
                    ratingBreakdown: h.ratingBreakdown,
                    freeCancellation: h.freeCancellation,
                    address: h.address,
                    propertyType: h.propertyType
                  }))
                }
              }
            };
          }
          
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(summarizedResult.result || summarizedResult)
          });
        } catch (toolError) {
          console.error(`Error executing tool ${toolUse.name}:`, toolError);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify({ error: toolError instanceof Error ? toolError.message : 'Unknown error' }),
            is_error: true
          });
        }
      }
      
      // Send tool results back to Claude for sorting/formatting
      console.log('Stage: Sorting - Sending results to Claude for sorting and formatting...');
      const finalRequest = {
        model: 'claude-sonnet-4-5',
        max_tokens: 2048,
        system: `${systemPrompt}\n\nIMPORTANT: Sort the hostels based on how well they match the user's request. Consider rating, price, distance, and relevant facilities. Return results as-is without reformatting.`,
        messages: [
          {
            role: 'user',
            content: query
          },
          {
            role: 'assistant',
            content: data.content
          },
          {
            role: 'user',
            content: toolResults
          }
        ],
        tools: mcpTools
      };
      
      const finalResponse = await fetchWithRetry(
        'https://api.anthropic.com/v1/messages', 
        {
          method: 'POST',
          headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify(finalRequest),
        },
        3,
        false
      );
      
      if (!finalResponse.ok) {
        const errorText = await finalResponse.text();
        console.error('Claude sorting API error:', finalResponse.status, errorText);
        
        if (finalResponse.status === 429) {
          return new Response(JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait a moment and try again.',
            rateLimited: true
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // For server errors (502, 503, etc.), fallback to unsorted results
        console.warn(`Claude sorting failed with ${finalResponse.status}. Returning unsorted results as fallback.`);
        // Don't throw - we'll use the unsorted MCP results as fallback
      } else {
        const finalData = await finalResponse.json();
        console.log('Claude sorted results received');
        
        // Extract the text content from final response
        const textBlock = finalData.content.find((block: any) => block.type === 'text');
        finalContent = textBlock?.text || '';
      }
    }

    // Extract MCP response from tool results for frontend
    let mcpResponse = null;
    let noResultsReason = null;
    
    if (toolResults && toolResults.length > 0) {
      try {
        for (const toolResult of toolResults) {
          const resultContent = JSON.parse(toolResult.content);
          
          if (resultContent && resultContent.structuredContent) {
            mcpResponse = resultContent;
            console.log('Found valid MCP response with structuredContent');
            break;
          }
          
          // Check if tool returned empty results with metadata
          if (resultContent && resultContent.error) {
            noResultsReason = resultContent.error;
          }
        }
        
        // If we have MCP response but no hostels, determine the reason
        if (mcpResponse && mcpResponse.structuredContent) {
          const hostels = mcpResponse.structuredContent.hostels || [];
          if (hostels.length === 0) {
            // Analyze the query to provide a specific reason
            const lowerQuery = query.toLowerCase();
            const fieldNeeds = analyzeQueryForFields(query);
            
            if (lowerQuery.match(/\b(london|paris|rome|barcelona|berlin|amsterdam|tokyo|bangkok|new york|sydney)\b/i)) {
              noResultsReason = "No properties found in the requested location. The destination may not have available hostels for the selected dates.";
            } else if (fieldNeeds.needsFacilities || lowerQuery.includes('pool') || lowerQuery.includes('wifi') || lowerQuery.includes('gym')) {
              noResultsReason = "No properties matched the requested facilities. Try searching with fewer or different amenities.";
            } else if (lowerQuery.includes('budget') || lowerQuery.includes('cheap') || lowerQuery.includes('under')) {
              noResultsReason = "No properties found within the specified budget. Try increasing your price range.";
            } else if (lowerQuery.includes('private') || lowerQuery.includes('ensuite')) {
              noResultsReason = "No properties found with the requested room type. Try searching for dorms or shared rooms.";
            } else {
              noResultsReason = "No properties matched your search criteria. Try adjusting your requirements or changing the location.";
            }
            mcpResponse = null;
          }
        }
      } catch (extractError) {
        console.error('Error extracting MCP results:', extractError);
      }
    }

    // Return the raw MCP response or a "no results" message with reason
    if (!mcpResponse) {
      const defaultReason = noResultsReason || "No properties found matching your search criteria. Try adjusting your search terms or selecting different dates.";
      console.log('No results found on Inv MCP:', defaultReason);
      return new Response(JSON.stringify({ 
        message: "No results found on Inv MCP",
        reason: defaultReason,
        mcpResponse: null 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Returning raw MCP response');
    return new Response(JSON.stringify({ 
      message: "Results found",
      mcpResponse: mcpResponse 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in hostel-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        hostels: []
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
