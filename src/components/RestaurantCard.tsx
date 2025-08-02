'use client';

import React, { useState } from 'react';
import { Restaurant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Props interface for the RestaurantCard component
interface RestaurantCardProps {
  restaurant: Restaurant;
  onSwipe?: (restaurantId: string, action: 'like' | 'dislike') => void;
  isSwipeable?: boolean; // Whether the card can be swiped (used in different contexts)
  showActions?: boolean; // Whether to show like/dislike buttons
}

// Individual restaurant card component that displays restaurant information
// Can be used in both swipeable deck and static list contexts
export default function RestaurantCard({ 
  restaurant, 
  onSwipe, 
  isSwipeable = false,
  showActions = false 
}: RestaurantCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Handle image loading errors with fallback
  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  // Handle image load success
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    // Add empty stars to make 5 total
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }

    return stars;
  };

  // Handle like action
  const handleLike = () => {
    if (onSwipe) {
      onSwipe(restaurant.id, 'like');
    }
  };

  // Handle dislike action
  const handleDislike = () => {
    if (onSwipe) {
      onSwipe(restaurant.id, 'dislike');
    }
  };

  return (
    <Card className={`w-full max-w-sm mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
      isSwipeable ? 'cursor-grab active:cursor-grabbing' : ''
    }`}>
      {/* Restaurant Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!imageError ? (
          <img
            src={restaurant.imageUrl}
            alt={`${restaurant.name} - ${restaurant.cuisine} restaurant`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: isImageLoading ? 'none' : 'block' }}
          />
        ) : (
          // Fallback when image fails to load
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-sm font-medium">{restaurant.name}</p>
            </div>
          </div>
        )}

        {/* Price Range Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800 font-semibold">
            {restaurant.priceRange}
          </Badge>
        </div>
      </div>

      {/* Restaurant Information */}
      <CardContent className="p-4">
        {/* Restaurant Name and Cuisine */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            {restaurant.cuisine} Cuisine
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars(restaurant.rating)}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>

        {/* Location */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            📍 {restaurant.location.address}
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-2">
            {restaurant.description}
          </p>
        </div>

        {/* Hours and Phone */}
        <div className="space-y-1 mb-4">
          <p className="text-xs text-gray-500">
            🕒 {restaurant.openHours}
          </p>
          <p className="text-xs text-gray-500">
            📞 {restaurant.phoneNumber}
          </p>
        </div>

        {/* Action Buttons (only show if showActions is true) */}
        {showActions && onSwipe && (
          <div className="flex space-x-3">
            <button
              onClick={handleDislike}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 border border-red-200"
            >
              Pass
            </button>
            <button
              onClick={handleLike}
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 border border-green-200"
            >
              Like
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Utility CSS classes for text truncation (add to globals.css if needed)
// .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
// .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
