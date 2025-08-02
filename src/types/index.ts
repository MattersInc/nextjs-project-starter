// Type definitions for the FoodSwipe app
// These interfaces define the structure of our data objects

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number; // Rating out of 5
  priceRange: '$' | '$$' | '$$$' | '$$$$'; // Price indicator
  location: {
    city: string;
    address: string;
    lat: number; // Latitude for location-based filtering
    lng: number; // Longitude for location-based filtering
  };
  imageUrl: string;
  description: string;
  openHours: string;
  phoneNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location?: {
    city: string;
    lat: number;
    lng: number;
  };
  likedRestaurants: string[]; // Array of restaurant IDs
  dislikedRestaurants: string[]; // Array of restaurant IDs
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

// Enum for swipe actions to make code more readable
export enum SwipeAction {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

// Interface for location coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}
