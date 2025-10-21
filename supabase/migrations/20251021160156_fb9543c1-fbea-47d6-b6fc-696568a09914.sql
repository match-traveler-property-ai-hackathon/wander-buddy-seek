-- Temporarily disable RLS for seeding demo data
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Insert 6 strategic demo profiles (user_id set to NULL since they're not tied to auth users)
INSERT INTO profiles (
  user_id, 
  name, 
  email, 
  interests, 
  hostel_preferences, 
  preferred_destinations, 
  budget_range, 
  travel_style, 
  age_range, 
  search_history, 
  last_search_query, 
  favorite_hostels
) VALUES
  -- Profile 1: Social Backpacker (Emma)
  (
    NULL,
    'Emma Rodriguez',
    'emma.demo@hostelworld.com',
    ARRAY['surfing', 'party vibes', 'social atmosphere', 'beach bars', 'nightlife'],
    '{"bar": true, "pool": false, "kitchen": false, "social_events": true, "free_wifi": true, "air_conditioning": false}'::jsonb,
    ARRAY['Mediterranean coastline', 'Spain', 'France', 'Italy', 'Portugal'],
    '{"min": 20, "max": 50}'::jsonb,
    'social backpacker',
    '18-30',
    ARRAY['"beach party hostels Barcelona"'::jsonb, '"surfing hostels Portugal"'::jsonb, '"hostels with bar in Lisbon"'::jsonb],
    'hostels with beach bars and social vibes in Mediterranean',
    ARRAY[]::text[]
  ),
  
  -- Profile 2: Digital Nomad (Alex)
  (
    NULL,
    'Alex Chen',
    'alex.demo@hostelworld.com',
    ARRAY['remote work', 'coworking spaces', 'quiet atmosphere', 'coffee culture', 'reliable wifi'],
    '{"bar": false, "pool": false, "kitchen": true, "social_events": false, "free_wifi": true, "air_conditioning": true}'::jsonb,
    ARRAY['Chiang Mai', 'Lisbon', 'Medellín', 'Prague', 'Budapest'],
    '{"min": 25, "max": 60}'::jsonb,
    'digital nomad',
    '26-35',
    ARRAY['"hostels with coworking Lisbon"'::jsonb, '"quiet work-friendly hostels"'::jsonb, '"hostels with desk space"'::jsonb],
    'hostels with fast wifi and desk space in Europe',
    ARRAY[]::text[]
  ),
  
  -- Profile 3: Budget Explorer (Marco)
  (
    NULL,
    'Marco Silva',
    'marco.demo@hostelworld.com',
    ARRAY['hiking', 'local food', 'cultural experiences', 'street art', 'free walking tours'],
    '{"bar": false, "pool": false, "kitchen": true, "social_events": false, "free_wifi": true, "air_conditioning": false}'::jsonb,
    ARRAY['Southeast Asia', 'Eastern Europe', 'South America', 'Balkans', 'Vietnam'],
    '{"min": 8, "max": 20}'::jsonb,
    'budget backpacker',
    '18-25',
    ARRAY['"cheapest hostels with kitchen"'::jsonb, '"budget hostels near city center"'::jsonb, '"hostels under $15"'::jsonb],
    'affordable hostels in Eastern Europe under $15 per night',
    ARRAY[]::text[]
  ),
  
  -- Profile 4: Comfort Seeker (Sophie)
  (
    NULL,
    'Sophie Anderson',
    'sophie.demo@hostelworld.com',
    ARRAY['boutique experiences', 'cleanliness', 'design hotels', 'wellness', 'photography'],
    '{"bar": false, "pool": true, "kitchen": false, "social_events": false, "free_wifi": true, "air_conditioning": true}'::jsonb,
    ARRAY['Amsterdam', 'Copenhagen', 'Melbourne', 'Tokyo', 'San Francisco'],
    '{"min": 40, "max": 80}'::jsonb,
    'comfort traveler',
    '26-35',
    ARRAY['"boutique hostels Amsterdam"'::jsonb, '"design hostels with private rooms"'::jsonb, '"upscale hostels"'::jsonb],
    'upscale hostels with modern amenities and ensuite bathrooms',
    ARRAY[]::text[]
  ),
  
  -- Profile 5: Adventure Seeker (Jake)
  (
    NULL,
    'Jake Murphy',
    'jake.demo@hostelworld.com',
    ARRAY['rock climbing', 'trekking', 'mountain biking', 'outdoor activities', 'camping'],
    '{"bar": true, "pool": false, "kitchen": true, "social_events": true, "free_wifi": false, "air_conditioning": false}'::jsonb,
    ARRAY['Patagonia', 'New Zealand', 'Nepal', 'Iceland', 'Swiss Alps'],
    '{"min": 20, "max": 45}'::jsonb,
    'adventure seeker',
    '25-35',
    ARRAY['"hostels near hiking trails"'::jsonb, '"adventure activity hostels Iceland"'::jsonb, '"mountain hostels"'::jsonb],
    'hostels with gear storage and mountain tours near trekking routes',
    ARRAY[]::text[]
  ),
  
  -- Profile 6: Cultural Explorer (Priya)
  (
    NULL,
    'Priya Patel',
    'priya.demo@hostelworld.com',
    ARRAY['art galleries', 'local cuisine', 'language exchange', 'history', 'museums'],
    '{"bar": false, "pool": false, "kitchen": true, "social_events": true, "free_wifi": true, "air_conditioning": false}'::jsonb,
    ARRAY['Rome', 'Kyoto', 'Istanbul', 'Buenos Aires', 'Marrakech'],
    '{"min": 18, "max": 40}'::jsonb,
    'cultural explorer',
    '25-35',
    ARRAY['"hostels in historic neighborhoods"'::jsonb, '"language exchange hostels"'::jsonb, '"cultural hostels"'::jsonb],
    'hostels near museums and art districts in historic areas',
    ARRAY[]::text[]
  );

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;