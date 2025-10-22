-- Update all profiles with new unique hostel images
-- Alex Chen - Mexico City themed
UPDATE public.profiles 
SET default_hostels = '[
  {"name": "Casa Pepe", "image": "/src/assets/hostels/casa-pepe.jpg", "rating": 4.8, "distance": "1.2 km from centre", "price": 25, "ratingBreakdown": [{"category": "Cleanliness", "rating": 9.8}, {"category": "Location", "rating": 9.6}, {"category": "Staff", "rating": 9.4}]},
  {"name": "Mexico City Rooftop", "image": "/src/assets/hostels/mexico-rooftop.jpg", "rating": 4.9, "distance": "0.8 km from centre", "price": 32, "ratingBreakdown": [{"category": "Atmosphere", "rating": 10.0}, {"category": "Location", "rating": 9.8}, {"category": "Facilities", "rating": 9.6}]},
  {"name": "La Casa Colorida", "image": "/src/assets/hostels/casa-colorida.jpg", "rating": 4.7, "distance": "1.5 km from centre", "price": 28, "ratingBreakdown": [{"category": "Staff", "rating": 9.8}, {"category": "Value", "rating": 9.4}, {"category": "Security", "rating": 9.2}]},
  {"name": "Green Garden Hostel", "image": "/src/assets/hostels/green-garden.jpg", "rating": 4.9, "distance": "2.1 km from centre", "price": 30, "ratingBreakdown": [{"category": "Cleanliness", "rating": 10.0}, {"category": "Facilities", "rating": 9.8}, {"category": "Atmosphere", "rating": 9.6}]},
  {"name": "Colonial Charm", "image": "/src/assets/hostels/colonial-charm.jpg", "rating": 4.6, "distance": "1.8 km from centre", "price": 27, "ratingBreakdown": [{"category": "Atmosphere", "rating": 9.6}, {"category": "Value", "rating": 9.4}, {"category": "Location", "rating": 9.2}]}
]'::jsonb
WHERE name = 'Alex Chen';

-- Sophie Anderson - European budget
UPDATE public.profiles 
SET default_hostels = '[
  {"name": "Budget Berlin Base", "image": "/src/assets/hostels/berlin-base.jpg", "rating": 4.5, "distance": "1.0 km from centre", "price": 18, "ratingBreakdown": [{"category": "Value", "rating": 9.8}, {"category": "Location", "rating": 9.2}, {"category": "Atmosphere", "rating": 8.8}]},
  {"name": "Amsterdam Backpackers", "image": "/src/assets/hostels/amsterdam-backpackers.jpg", "rating": 4.6, "distance": "0.5 km from centre", "price": 22, "ratingBreakdown": [{"category": "Location", "rating": 9.9}, {"category": "Social", "rating": 9.4}, {"category": "Value", "rating": 9.0}]},
  {"name": "Prague Party Palace", "image": "/src/assets/hostels/prague-party.jpg", "rating": 4.7, "distance": "1.3 km from centre", "price": 20, "ratingBreakdown": [{"category": "Atmosphere", "rating": 10.0}, {"category": "Value", "rating": 9.6}, {"category": "Social", "rating": 9.8}]},
  {"name": "Lisbon Sunset Villa", "image": "/src/assets/hostels/lisbon-sunset.jpg", "rating": 4.8, "distance": "0.9 km from centre", "price": 24, "ratingBreakdown": [{"category": "Views", "rating": 10.0}, {"category": "Staff", "rating": 9.6}, {"category": "Cleanliness", "rating": 9.4}]},
  {"name": "Barcelona Beach Hub", "image": "/src/assets/hostels/barcelona-beach.jpg", "rating": 4.9, "distance": "0.3 km from beach", "price": 26, "ratingBreakdown": [{"category": "Location", "rating": 10.0}, {"category": "Facilities", "rating": 9.8}, {"category": "Atmosphere", "rating": 9.6}]}
]'::jsonb
WHERE name = 'Sophie Anderson';

-- Jake Murphy - Luxury
UPDATE public.profiles 
SET default_hostels = '[
  {"name": "London Luxe Living", "image": "/src/assets/hostels/london-luxe.jpg", "rating": 4.9, "distance": "0.4 km from centre", "price": 55, "ratingBreakdown": [{"category": "Facilities", "rating": 10.0}, {"category": "Cleanliness", "rating": 10.0}, {"category": "Design", "rating": 9.8}]},
  {"name": "Sydney Harbour View", "image": "/src/assets/hostels/sydney-harbour.jpg", "rating": 5.0, "distance": "0.2 km from harbour", "price": 62, "ratingBreakdown": [{"category": "Views", "rating": 10.0}, {"category": "Location", "rating": 10.0}, {"category": "Luxury", "rating": 10.0}]},
  {"name": "Rome Renaissance Suite", "image": "/src/assets/hostels/rome-renaissance.jpg", "rating": 4.8, "distance": "0.6 km from Colosseum", "price": 58, "ratingBreakdown": [{"category": "Historic Charm", "rating": 10.0}, {"category": "Comfort", "rating": 9.8}, {"category": "Service", "rating": 9.6}]},
  {"name": "Tokyo Modern Capsule", "image": "/src/assets/hostels/tokyo-capsule.jpg", "rating": 4.9, "distance": "0.3 km from Shibuya", "price": 65, "ratingBreakdown": [{"category": "Technology", "rating": 10.0}, {"category": "Design", "rating": 10.0}, {"category": "Cleanliness", "rating": 9.9}]},
  {"name": "Paris Chic Retreat", "image": "/src/assets/hostels/paris-chic.jpg", "rating": 4.8, "distance": "0.8 km from Louvre", "price": 60, "ratingBreakdown": [{"category": "Style", "rating": 10.0}, {"category": "Location", "rating": 9.8}, {"category": "Amenities", "rating": 9.6}]}
]'::jsonb
WHERE name = 'Jake Murphy';

-- Marco Silva - Adventure
UPDATE public.profiles 
SET default_hostels = '[
  {"name": "Mountain Base Camp", "image": "/src/assets/hostels/mountain-base.jpg", "rating": 4.7, "distance": "5 km from ski lift", "price": 35, "ratingBreakdown": [{"category": "Adventure Access", "rating": 10.0}, {"category": "Equipment Storage", "rating": 9.6}, {"category": "Community", "rating": 9.4}]},
  {"name": "Coastal Surf Lodge", "image": "/src/assets/hostels/coastal-surf.jpg", "rating": 4.8, "distance": "Beach front", "price": 38, "ratingBreakdown": [{"category": "Location", "rating": 10.0}, {"category": "Surf Culture", "rating": 9.8}, {"category": "Vibe", "rating": 9.6}]},
  {"name": "Jungle Eco Camp", "image": "/src/assets/hostels/jungle-eco.jpg", "rating": 4.9, "distance": "15 km from town", "price": 32, "ratingBreakdown": [{"category": "Nature Immersion", "rating": 10.0}, {"category": "Sustainability", "rating": 10.0}, {"category": "Activities", "rating": 9.8}]},
  {"name": "Desert Oasis Hostel", "image": "/src/assets/hostels/desert-oasis.jpg", "rating": 4.6, "distance": "20 km from city", "price": 29, "ratingBreakdown": [{"category": "Unique Experience", "rating": 10.0}, {"category": "Stargazing", "rating": 10.0}, {"category": "Adventure Tours", "rating": 9.4}]},
  {"name": "Alpine Adventure Hub", "image": "/src/assets/hostels/alpine-adventure.jpg", "rating": 4.8, "distance": "2 km from trails", "price": 40, "ratingBreakdown": [{"category": "Trail Access", "rating": 9.8}, {"category": "Gear Rental", "rating": 9.6}, {"category": "Expert Guides", "rating": 9.8}]}
]'::jsonb
WHERE name = 'Marco Silva';

-- Emma Rodriguez - Cultural
UPDATE public.profiles 
SET default_hostels = '[
  {"name": "Traditional Kyoto House", "image": "/src/assets/hostels/kyoto-traditional.jpg", "rating": 4.9, "distance": "1.5 km from Gion", "price": 42, "ratingBreakdown": [{"category": "Cultural Authenticity", "rating": 10.0}, {"category": "Host Knowledge", "rating": 9.8}, {"category": "Local Experience", "rating": 9.8}]},
  {"name": "Marrakech Riad Hostel", "image": "/src/assets/hostels/marrakech-riad.jpg", "rating": 4.8, "distance": "0.8 km from medina", "price": 36, "ratingBreakdown": [{"category": "Architecture", "rating": 10.0}, {"category": "Cultural Programs", "rating": 9.6}, {"category": "Local Cuisine", "rating": 9.8}]},
  {"name": "Istanbul Ottoman Palace", "image": "/src/assets/hostels/istanbul-ottoman.jpg", "rating": 4.7, "distance": "1.2 km from Grand Bazaar", "price": 38, "ratingBreakdown": [{"category": "Historical Setting", "rating": 10.0}, {"category": "Cultural Tours", "rating": 9.4}, {"category": "Traditional Food", "rating": 9.6}]},
  {"name": "Buenos Aires Tango House", "image": "/src/assets/hostels/buenos-aires-tango.jpg", "rating": 4.9, "distance": "0.9 km from San Telmo", "price": 34, "ratingBreakdown": [{"category": "Dance Classes", "rating": 10.0}, {"category": "Local Integration", "rating": 9.8}, {"category": "Cultural Events", "rating": 9.8}]},
  {"name": "Dublin Literary Lounge", "image": "/src/assets/hostels/dublin-literary.jpg", "rating": 4.8, "distance": "0.5 km from Temple Bar", "price": 40, "ratingBreakdown": [{"category": "Literary Heritage", "rating": 10.0}, {"category": "Storytelling Nights", "rating": 9.8}, {"category": "Pub Culture", "rating": 9.6}]}
]'::jsonb
WHERE name = 'Emma Rodriguez';

-- Priya Patel - Wellness
UPDATE public.profiles 
SET default_hostels = '[
  {"name": "Bali Wellness Retreat", "image": "/src/assets/hostels/bali-wellness.jpg", "rating": 4.9, "distance": "3 km from Ubud", "price": 45, "ratingBreakdown": [{"category": "Wellness Programs", "rating": 10.0}, {"category": "Peace & Quiet", "rating": 9.8}, {"category": "Healthy Food", "rating": 9.8}]},
  {"name": "Goa Beach Yoga", "image": "/src/assets/hostels/goa-yoga.jpg", "rating": 4.8, "distance": "Beach front", "price": 38, "ratingBreakdown": [{"category": "Yoga Classes", "rating": 10.0}, {"category": "Location", "rating": 9.6}, {"category": "Community", "rating": 9.4}]},
  {"name": "Thailand Meditation Center", "image": "/src/assets/hostels/thailand-meditation.jpg", "rating": 4.7, "distance": "10 km from town", "price": 32, "ratingBreakdown": [{"category": "Meditation", "rating": 10.0}, {"category": "Tranquility", "rating": 9.8}, {"category": "Value", "rating": 9.4}]},
  {"name": "Costa Rica Eco Wellness", "image": "/src/assets/hostels/costa-rica-wellness.jpg", "rating": 4.9, "distance": "5 km from beach", "price": 50, "ratingBreakdown": [{"category": "Nature", "rating": 10.0}, {"category": "Spa Facilities", "rating": 9.8}, {"category": "Organic Food", "rating": 9.6}]},
  {"name": "Sedona Spiritual Haven", "image": "/src/assets/hostels/sedona-spiritual.jpg", "rating": 4.8, "distance": "2 km from vortex", "price": 55, "ratingBreakdown": [{"category": "Energy Healing", "rating": 10.0}, {"category": "Scenic Beauty", "rating": 9.8}, {"category": "Workshops", "rating": 9.6}]}
]'::jsonb
WHERE name = 'Priya Patel';