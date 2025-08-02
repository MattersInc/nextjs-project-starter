'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants, getRestaurantsByLocation } from '@/data/restaurants';
import { Restaurant, SwipeAction, Coordinates } from '@/types';
import SwipeDeck from '@/components/SwipeDeck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

// Main swipe page where users discover restaurants
export default function SwipePage() {
  const { user, likeRestaurant, dislikeRestaurant, updateUserLocation } = useAuth();
  const router = useRouter();
  
  // State management
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Initialize restaurants and try to get user location
  useEffect(() => {
    if (user) {
      // Filter out restaurants that user has already swiped on
      const availableRestaurants = mockRestaurants.filter(restaurant => 
        !user.likedRestaurants.includes(restaurant.id) && 
        !user.dislikedRestaurants.includes(restaurant.id)
      );
      
      setRestaurants(availableRestaurants);
      setFilteredRestaurants(availableRestaurants);
      
      // Try to get user's location
      getUserLocation();
    }
  }, [user]);

  // Apply filters when location, cuisine, or price range changes
  useEffect(() => {
    let filtered = restaurants;

    // Apply location filter if user location is available
    if (userLocation) {
      filtered = getRestaurantsByLocation(userLocation.lat, userLocation.lng, 10);
      // Remove already swiped restaurants
      filtered = filtered.filter(restaurant => 
        !user?.likedRestaurants.includes(restaurant.id) && 
        !user?.dislikedRestaurants.includes(restaurant.id)
      );
    }

    // Apply cuisine filter
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    // Apply price range filter
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.priceRange === selectedPriceRange
      );
    }

    setFilteredRestaurants(filtered);
  }, [restaurants, userLocation, selectedCuisine, selectedPriceRange, user]);

  // Get user's current location using browser geolocation API
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        
        // Update user location in auth context
        // For demo purposes, we'll use "Current Location" as city name
        updateUserLocation(coords.lat, coords.lng, 'Current Location');
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Handle swipe actions
  const handleSwipe = (restaurantId: string, action: SwipeAction) => {
    if (action === SwipeAction.LIKE) {
      likeRestaurant(restaurantId);
    } else {
      dislikeRestaurant(restaurantId);
    }
  };

  // Handle when deck is empty
  const handleDeckEmpty = () => {
    // Could show a message or redirect to matches
    console.log('All restaurants swiped!');
  };

  // Get unique cuisines for filter
  const availableCuisines = Array.from(new Set(restaurants.map(r => r.cuisine)));
  const availablePriceRanges = ['$', '$$', '$$$', '$$$$'];

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Restaurants
          </h1>
          <p className="text-gray-600">
            Swipe right on restaurants you'd love to try!
          </p>
        </div>

        {/* Location and Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Location & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Location Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Your Location</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getUserLocation}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Getting Location...
                    </div>
                  ) : (
                    'Update Location'
                  )}
                </Button>
              </div>
              
              {userLocation ? (
                <div className="flex items-center text-sm text-green-600">
                  <span className="mr-2">📍</span>
                  Location detected - showing nearby restaurants
                </div>
              ) : locationError ? (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {locationError}
                  <p className="mt-1 text-xs">
                    Don't worry! You can still browse all available restaurants.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Enable location access to see nearby restaurants
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Cuisines</option>
                  {availableCuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Price Ranges</option>
                  {availablePriceRanges.map(range => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCuisine !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCuisine}
                  <button
                    onClick={() => setSelectedCuisine('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedPriceRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedPriceRange}
                  <button
                    onClick={() => setSelectedPriceRange('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Swipe Deck */}
        {filteredRestaurants.length > 0 ? (
          <SwipeDeck
            restaurants={filteredRestaurants}
            onSwipe={handleSwipe}
            onDeckEmpty={handleDeckEmpty}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No restaurants found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or location settings to see more restaurants.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCuisine('all');
                  setSelectedPriceRange('all');
                }}
              >
                Clear Filters
              </Button>
              <Button onClick={getUserLocation}>
                Update Location
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            You've liked {user.likedRestaurants.length} restaurants • 
            Passed on {user.dislikedRestaurants.length} restaurants
          </p>
        </div>
      </div>
    </div>
  );
}
