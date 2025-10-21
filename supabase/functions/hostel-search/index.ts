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
            name: tool.name,
            description: tool.description,
            input_schema: tool.inputSchema || { type: 'object', properties: {} }
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
    let finalContent = '';
    let toolResults: any[] = [];
    
    if (data.stop_reason === 'tool_use') {
      console.log('Claude requested tool use, processing...');
      
      // Extract tool calls from Claude's response
      const toolUses = data.content.filter((block: any) => block.type === 'tool_use');
      console.log('Tool uses:', JSON.stringify(toolUses, null, 2));
      
      // Execute each tool call against the MCP server
      for (const toolUse of toolUses) {
        console.log(`Executing tool: ${toolUse.name} with input:`, toolUse.input);
        
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
          console.log('MCP tool result:', JSON.stringify(mcpResult, null, 2));
          
          // Store the raw tool result data for potential direct use
          if (mcpResult.result && !mcpResult.error) {
            console.log('Successful tool result received');
          }
          
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(mcpResult.result || mcpResult)
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
      
      // Send tool results back to Claude for final response
      console.log('Sending tool results back to Claude...');
      const finalRequest = {
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        system: systemPrompt,
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
      
      const finalResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(finalRequest),
      });
      
      if (!finalResponse.ok) {
        const errorText = await finalResponse.text();
        console.error('Claude final API error:', finalResponse.status, errorText);
        throw new Error(`Claude final API error: ${finalResponse.status}`);
      }
      
      const finalData = await finalResponse.json();
      console.log('Claude final response:', JSON.stringify(finalData, null, 2));
      
      // Extract the text content from final response
      const textBlock = finalData.content.find((block: any) => block.type === 'text');
      finalContent = textBlock?.text || '';
    } else {
      // No tool use, extract text directly
      const textBlock = data.content.find((block: any) => block.type === 'text');
      finalContent = textBlock?.text || '';
    }

    console.log('Final content:', finalContent);

    // Parse the JSON response from Claude
    let hostels = [];
    try {
      // Remove markdown code blocks if present
      const jsonMatch = finalContent.match(/```json\n?([\s\S]*?)\n?```/) || finalContent.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : finalContent;
      hostels = JSON.parse(jsonString);
      console.log('Successfully parsed hostels from Claude response:', hostels.length);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      console.log('Attempting to extract hostels from tool results...');
      
      // Try to extract hostel data directly from tool results if parsing fails
      if (data.stop_reason === 'tool_use' && toolResults && toolResults.length > 0) {
        try {
          for (const toolResult of toolResults) {
            const resultContent = JSON.parse(toolResult.content);
            
            // Check if this is a successful hostel search result
            if (resultContent && resultContent.content) {
              const content = Array.isArray(resultContent.content) 
                ? resultContent.content 
                : [resultContent.content];
              
              for (const item of content) {
                if (item.type === 'resource' && item.resource) {
                  const resource = item.resource;
                  
                  // Extract hostel data from the resource
                  if (resource.mimeType === 'application/json' && resource.text) {
                    try {
                      const hostelData = JSON.parse(resource.text);
                      
                      // Handle both single and array results
                      const hostelArray = Array.isArray(hostelData) ? hostelData : [hostelData];
                      
                      for (const h of hostelArray) {
                        if (h.name && h.rating) {
                          hostels.push({
                            name: h.name,
                            rating: h.rating,
                            distance: h.distance || 'N/A',
                            price: h.price || h.lowestPricePerNight || 0,
                            benefits: h.benefits || h.facilities || [],
                            image: h.image || h.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
                            bookingLink: h.bookingLink || h.url
                          });
                        }
                      }
                    } catch (e) {
                      console.error('Error parsing hostel resource text:', e);
                    }
                  }
                }
              }
            }
          }
          
          if (hostels.length > 0) {
            console.log('Successfully extracted', hostels.length, 'hostels from tool results');
          }
        } catch (extractError) {
          console.error('Error extracting hostels from tool results:', extractError);
        }
      }
      
      // If we still have no hostels, use mock data
      if (hostels.length === 0) {
        console.log('No hostels found, using mock data');
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
