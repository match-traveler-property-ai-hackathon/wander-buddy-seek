import "https://deno.land/x/xhr@0.1.0/mod.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MCP_SERVER_URL = 'https://test.apigee.hostelworld.com/inventory-mcp-service-plan-trip-server/mcp';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, profileBased } = await req.json();
    console.log('Received hostel search query:', query);
    console.log('Profile-based search:', profileBased);

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    // Step 1: Connect to MCP server to get available tools
    console.log('Fetching tools from MCP server:', MCP_SERVER_URL);
    let mcpTools: any[] = [];
    
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
        console.log('MCP server response:', JSON.stringify(mcpData, null, 2));
        
        if (mcpData.result?.tools) {
          mcpTools = mcpData.result.tools.map((tool: any) => ({
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.inputSchema || { type: 'object', properties: {} }
            }
          }));
          console.log('Extracted MCP tools:', JSON.stringify(mcpTools, null, 2));
        }
      } else {
        console.warn('Failed to fetch MCP tools:', await mcpResponse.text());
      }
    } catch (mcpError) {
      console.warn('Error fetching MCP tools:', mcpError);
    }

    // Step 2: Build Claude request with MCP tools and enhanced prompt for profile-based searches
    const systemPrompt = profileBased 
      ? `You are a personalized hostel recommendation assistant with access to the Hostelworld inventory system.

This is a PROFILE-BASED search. The user query contains their travel preferences, interests, and requirements.

Your task:
1. Carefully analyze the user's preferences mentioned in the query
2. ${mcpTools.length > 0 ? 'Use the available MCP tools to search the Hostelworld inventory' : 'Search for relevant hostels based on the query'}
3. Find hostels that BEST MATCH the user's:
   - Interests (e.g., surfing, partying, culture)
   - Preferred amenities (e.g., bar, pool, social events)
   - Destination preferences
   - Budget range
4. Prioritize hostels with good ratings (7+ preferred)
5. Include hostels with availability

User Query: "${query}"`
      : `You are a hostel search assistant with access to the Hostelworld inventory system.

Find hostels matching this query: "${query}"

${mcpTools.length > 0 ? 'Use the available MCP tools to search the Hostelworld inventory.' : 'Search for relevant hostels based on the query.'}`;

    const claudeRequest: any = {
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}

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
        }
      ],
    };

    // Add MCP tools if available
    if (mcpTools.length > 0) {
      claudeRequest.tools = mcpTools;
      console.log('Added', mcpTools.length, 'MCP tools to Claude request');
    }

    // Step 3: Call Claude with MCP tools
    console.log('Calling Claude API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Claude response:', JSON.stringify(data, null, 2));

    // Step 4: Handle tool calls if Claude wants to use MCP tools
    if (data.stop_reason === 'tool_use') {
      console.log('Claude requested tool use, processing...');
      // In a full implementation, we would:
      // 1. Extract tool calls from data.content
      // 2. Execute those calls against the MCP server
      // 3. Send results back to Claude
      // 4. Get final response
      // For now, we'll use the initial response
    }

    const content = data.content[0].text;
    console.log('Claude content:', content);

    // Parse the JSON response from Claude
    let hostels;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      hostels = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      // Return mock data if parsing fails
      hostels = [
        {
          name: "Mock Hostel Result",
          rating: 4.5,
          distance: "0.5km from center",
          price: 25,
          benefits: ["Free WiFi", "Social events", "Pet-friendly"],
          image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"
        },
        {
          name: "Mock Hostel 2",
          rating: 4.7,
          distance: "1.2km from center",
          price: 30,
          benefits: ["Rooftop bar", "Kitchen", "Bike rental"],
          image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400"
        }
      ];
    }

    console.log('Returning hostels:', hostels);

    return new Response(JSON.stringify({ hostels }), {
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
