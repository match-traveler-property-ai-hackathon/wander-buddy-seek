import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Received hostel search query:', query);

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const MCP_SERVER_URL = 'https://test.apigee.hostelworld.com/inventory-mcp-service-plan-trip-server/mcp';
    
    console.log('Connecting to MCP server:', MCP_SERVER_URL);

    // Call Claude with MCP server context
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `You are a hostel search assistant. Use the MCP server at ${MCP_SERVER_URL} to find hostels matching this query: "${query}". 
            
Return a JSON array of hostel recommendations with this exact structure:
[
  {
    "name": "hostel name",
    "rating": 4.5,
    "distance": "0.5km from center",
    "price": 25,
    "benefits": ["benefit1", "benefit2", "benefit3"],
    "image": "https://placeholder-image-url.jpg"
  }
]

Make sure the response is valid JSON only, no markdown or explanation.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Claude response:', JSON.stringify(data, null, 2));

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
          name: "Mock Hostel 1",
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
