'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null; // Current logged-in user or null if not authenticated
  login: (email: string, password: string) => Promise<boolean>; // Login function
  register: (name: string, email: string, password: string) => Promise<boolean>; // Register function
  logout: () => void; // Logout function
  updateUserLocation: (lat: number, lng: number, city: string) => void; // Update user's location
  likeRestaurant: (restaurantId: string) => void; // Add restaurant to liked list
  dislikeRestaurant: (restaurantId: string) => void; // Add restaurant to disliked list
  isLoading: boolean; // Loading state for async operations
}

// Create the context with undefined as default (will be provided by AuthProvider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database - in a real app, this would be handled by a backend
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    likedRestaurants: [],
    dislikedRestaurants: []
  }
];

// AuthProvider component that wraps the app and provides authentication state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const savedUser = localStorage.getItem('foodswipe_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('foodswipe_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('foodswipe_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodswipe_user');
    }
  }, [user]);

  // Login function - simulates authentication with mock data
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password combination
    // In a real app, this would validate against a backend
    if (email && password) {
      // Check if user exists in mock database
      let existingUser = mockUsers.find(u => u.email === email);
      
      // If user doesn't exist, create a new one
      if (!existingUser) {
        existingUser = {
          id: Date.now().toString(),
          name: email.split('@')[0], // Use email prefix as name
          email,
          likedRestaurants: [],
          dislikedRestaurants: []
        };
        mockUsers.push(existingUser);
      }
      
      setUser(existingUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Register function - creates a new user account
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false; // User already exists
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      likedRestaurants: [],
      dislikedRestaurants: []
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  // Logout function - clears user state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodswipe_user');
  };

  // Update user's location (for location-based filtering)
  const updateUserLocation = (lat: number, lng: number, city: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        location: { lat, lng, city }
      };
      setUser(updatedUser);
    }
  };

  // Add restaurant to user's liked list
  const likeRestaurant = (restaurantId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        likedRestaurants: [...user.likedRestaurants, restaurantId],
        // Remove from disliked if it was there
        dislikedRestaurants: user.dislikedRestaurants.filter(id => id !== restaurantId)
      };
      setUser(updatedUser);
    }
  };

  // Add restaurant to user's disliked list
  const dislikeRestaurant = (restaurantId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        dislikedRestaurants: [...user.dislikedRestaurants, restaurantId],
        // Remove from liked if it was there
        likedRestaurants: user.likedRestaurants.filter(id => id !== restaurantId)
      };
      setUser(updatedUser);
    }
  };

  // Context value that will be provided to all child components
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUserLocation,
    likeRestaurant,
    dislikeRestaurant,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
// This ensures the context is used within an AuthProvider
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
