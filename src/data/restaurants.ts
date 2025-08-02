import { Restaurant } from '@/types';

// Mock restaurant data for the FoodSwipe app
// This simulates data that would typically come from a restaurant API
export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'La Bella Cucina',
    cuisine: 'Italian',
    rating: 4.5,
    priceRange: '$$$',
    location: {
      city: 'New York',
      address: '123 Little Italy St, New York, NY 10013',
      lat: 40.7128,
      lng: -74.0060
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9b40b2bc-02b2-46f4-98c6-f45d68ffa42d.png',
    description: 'Authentic Italian cuisine with fresh pasta made daily and an extensive wine selection.',
    openHours: '11:00 AM - 10:00 PM',
    phoneNumber: '(212) 555-0123'
  },
  {
    id: '2',
    name: 'Sakura Sushi Bar',
    cuisine: 'Japanese',
    rating: 4.8,
    priceRange: '$$$$',
    location: {
      city: 'New York',
      address: '456 East Village Ave, New York, NY 10009',
      lat: 40.7282,
      lng: -73.9942
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0b19b094-62b9-4d82-af04-6ddf8fb83c4e.png',
    description: 'Premium sushi experience with the freshest fish flown in daily from Japan.',
    openHours: '5:00 PM - 11:00 PM',
    phoneNumber: '(212) 555-0456'
  },
  {
    id: '3',
    name: 'Taco Libre',
    cuisine: 'Mexican',
    rating: 4.2,
    priceRange: '$$',
    location: {
      city: 'New York',
      address: '789 Chelsea Market, New York, NY 10011',
      lat: 40.7424,
      lng: -74.0061
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/366a0207-4e78-4150-b7e5-dfa90290267f.png',
    description: 'Authentic Mexican street food with handmade tortillas and fresh salsas.',
    openHours: '12:00 PM - 9:00 PM',
    phoneNumber: '(212) 555-0789'
  },
  {
    id: '4',
    name: 'The French Corner',
    cuisine: 'French',
    rating: 4.6,
    priceRange: '$$$$',
    location: {
      city: 'New York',
      address: '321 Upper East Side, New York, NY 10021',
      lat: 40.7831,
      lng: -73.9712
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c83bf0b6-e257-4696-9d5c-46fc5fd722d9.png',
    description: 'Classic French bistro offering traditional dishes with a modern twist.',
    openHours: '6:00 PM - 11:00 PM',
    phoneNumber: '(212) 555-0321'
  },
  {
    id: '5',
    name: 'Burger Palace',
    cuisine: 'American',
    rating: 4.0,
    priceRange: '$$',
    location: {
      city: 'New York',
      address: '654 Times Square, New York, NY 10036',
      lat: 40.7580,
      lng: -73.9855
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/be0835c1-7326-4e6e-a7a1-00d37d33a52f.png',
    description: 'Gourmet burgers made with locally sourced beef and artisanal buns.',
    openHours: '11:00 AM - 12:00 AM',
    phoneNumber: '(212) 555-0654'
  },
  {
    id: '6',
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.4,
    priceRange: '$$$',
    location: {
      city: 'New York',
      address: '987 Curry Hill, New York, NY 10016',
      lat: 40.7505,
      lng: -73.9934
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bdd72b50-6324-4954-9973-ff5f33d40b9c.png',
    description: 'Authentic Indian cuisine with traditional spices and tandoor-cooked specialties.',
    openHours: '12:00 PM - 10:00 PM',
    phoneNumber: '(212) 555-0987'
  },
  {
    id: '7',
    name: 'Mediterranean Breeze',
    cuisine: 'Mediterranean',
    rating: 4.3,
    priceRange: '$$$',
    location: {
      city: 'New York',
      address: '147 Greenwich Village, New York, NY 10014',
      lat: 40.7335,
      lng: -74.0027
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/005fe17e-0d8d-4624-8b64-2c72b73d5dd9.png',
    description: 'Fresh Mediterranean dishes with locally sourced ingredients and olive oils.',
    openHours: '11:30 AM - 10:30 PM',
    phoneNumber: '(212) 555-0147'
  },
  {
    id: '8',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    rating: 4.1,
    priceRange: '$$',
    location: {
      city: 'New York',
      address: '258 Chinatown, New York, NY 10013',
      lat: 40.7157,
      lng: -73.9970
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e115d304-e574-476c-b407-2193f4302e9f.png',
    description: 'Traditional Chinese cuisine with dim sum and Peking duck specialties.',
    openHours: '10:00 AM - 11:00 PM',
    phoneNumber: '(212) 555-0258'
  },
  {
    id: '9',
    name: 'Steakhouse Prime',
    cuisine: 'Steakhouse',
    rating: 4.7,
    priceRange: '$$$$',
    location: {
      city: 'New York',
      address: '369 Midtown West, New York, NY 10019',
      lat: 40.7614,
      lng: -73.9776
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/30d62880-da50-4098-b11c-9c3a7a472cd9.png',
    description: 'Premium steakhouse featuring dry-aged beef and an extensive wine cellar.',
    openHours: '5:00 PM - 11:00 PM',
    phoneNumber: '(212) 555-0369'
  },
  {
    id: '10',
    name: 'Café Parisien',
    cuisine: 'Café',
    rating: 4.2,
    priceRange: '$$',
    location: {
      city: 'New York',
      address: '741 SoHo District, New York, NY 10012',
      lat: 40.7230,
      lng: -74.0020
    },
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/448208e8-4da6-4602-985b-1d42941ee1d0.png',
    description: 'Charming café serving French pastries, coffee, and light lunch options.',
    openHours: '7:00 AM - 6:00 PM',
    phoneNumber: '(212) 555-0741'
  }
];

// Mock contacts data - simulates imported contacts from user's phone
export const mockContacts = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phoneNumber: '(555) 123-4567' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phoneNumber: '(555) 234-5678' },
  { id: '3', name: 'Mike Davis', email: 'mike@example.com', phoneNumber: '(555) 345-6789' },
  { id: '4', name: 'Emily Wilson', email: 'emily@example.com', phoneNumber: '(555) 456-7890' },
  { id: '5', name: 'David Brown', email: 'david@example.com', phoneNumber: '(555) 567-8901' }
];

// Mock data showing which friends liked which restaurants
// In a real app, this would come from a database
export const mockFriendActivity = {
  '1': ['John Smith', 'Sarah Johnson'], // La Bella Cucina liked by John and Sarah
  '2': ['Mike Davis'], // Sakura Sushi Bar liked by Mike
  '3': ['Emily Wilson', 'David Brown'], // Taco Libre liked by Emily and David
  '4': ['Sarah Johnson'], // The French Corner liked by Sarah
  '6': ['John Smith', 'Mike Davis'], // Spice Garden liked by John and Mike
};

// Utility function to get restaurants by location (for location-based filtering)
export const getRestaurantsByLocation = (userLat: number, userLng: number, radiusKm: number = 10): Restaurant[] => {
  return mockRestaurants.filter(restaurant => {
    // Simple distance calculation (Haversine formula would be more accurate)
    const latDiff = Math.abs(restaurant.location.lat - userLat);
    const lngDiff = Math.abs(restaurant.location.lng - userLng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    
    // Convert to approximate km (rough calculation for demo purposes)
    const distanceKm = distance * 111; // 1 degree ≈ 111 km
    
    return distanceKm <= radiusKm;
  });
};

// Utility function to get restaurants by cuisine type
export const getRestaurantsByCuisine = (cuisine: string): Restaurant[] => {
  return mockRestaurants.filter(restaurant => 
    restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
  );
};

// Utility function to get restaurants by price range
export const getRestaurantsByPriceRange = (priceRange: string): Restaurant[] => {
  return mockRestaurants.filter(restaurant => restaurant.priceRange === priceRange);
};
