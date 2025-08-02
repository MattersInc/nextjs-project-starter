'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Restaurant, SwipeAction } from '@/types';
import RestaurantCard from './RestaurantCard';
import { Button } from '@/components/ui/button';

// Props interface for the SwipeDeck component
interface SwipeDeckProps {
  restaurants: Restaurant[];
  onSwipe: (restaurantId: string, action: SwipeAction) => void;
  onDeckEmpty?: () => void; // Callback when all restaurants have been swiped
}

// SwipeDeck component that handles the Tinder-like swiping interface
// Shows one restaurant at a time with swipe gestures and action buttons
export default function SwipeDeck({ restaurants, onSwipe, onDeckEmpty }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Refs for touch/mouse event handling
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Get current restaurant
  const currentRestaurant = restaurants[currentIndex];

  // Check if deck is empty and call callback
  useEffect(() => {
    if (currentIndex >= restaurants.length && onDeckEmpty) {
      onDeckEmpty();
    }
  }, [currentIndex, restaurants.length, onDeckEmpty]);

  // Handle swipe action (like or dislike)
  const handleSwipe = (action: SwipeAction) => {
    if (!currentRestaurant || isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(action === SwipeAction.LIKE ? 'right' : 'left');

    // Call the onSwipe callback
    onSwipe(currentRestaurant.id, action);

    // Animate card exit and move to next card
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  // Handle like action
  const handleLike = () => {
    handleSwipe(SwipeAction.LIKE);
  };

  // Handle dislike action
  const handleDislike = () => {
    handleSwipe(SwipeAction.DISLIKE);
  };

  // Touch/Mouse event handlers for swipe gestures
  const handleStart = (clientX: number, clientY: number) => {
    if (isAnimating) return;
    
    startX.current = clientX;
    startY.current = clientY;
    currentX.current = clientX;
    currentY.current = clientY;
    isDragging.current = true;

    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || isAnimating) return;

    currentX.current = clientX;
    currentY.current = clientY;

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;

    // Only allow horizontal swiping
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (cardRef.current) {
        const rotation = deltaX * 0.1; // Slight rotation based on swipe distance
        cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        
        // Add visual feedback based on swipe direction
        if (deltaX > 50) {
          cardRef.current.style.borderColor = '#10b981'; // Green for like
        } else if (deltaX < -50) {
          cardRef.current.style.borderColor = '#ef4444'; // Red for dislike
        } else {
          cardRef.current.style.borderColor = 'transparent';
        }
      }
    }
  };

  const handleEnd = () => {
    if (!isDragging.current || isAnimating) return;

    const deltaX = currentX.current - startX.current;
    const threshold = 100; // Minimum distance to trigger swipe

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out, border-color 0.3s ease-out';
      cardRef.current.style.borderColor = 'transparent';
    }

    if (Math.abs(deltaX) > threshold) {
      // Trigger swipe based on direction
      if (deltaX > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    } else {
      // Snap back to center if swipe wasn't far enough
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0px) rotate(0deg)';
      }
    }

    isDragging.current = false;
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        handleEnd();
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Show empty state if no more restaurants
  if (currentIndex >= restaurants.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          You've seen all restaurants!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Great job exploring! Check your matches to see the restaurants you liked, 
          or adjust your location settings to discover more places.
        </p>
        <Button onClick={() => setCurrentIndex(0)} variant="outline">
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-4">
      {/* Progress indicator */}
      <div className="w-full max-w-sm mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Restaurant {currentIndex + 1} of {restaurants.length}</span>
          <span>{Math.round(((currentIndex) / restaurants.length) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / restaurants.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card stack container */}
      <div className="relative w-full max-w-sm h-[500px] mb-6">
        {/* Show next card behind current card for depth */}
        {restaurants[currentIndex + 1] && (
          <div className="absolute inset-0 transform scale-95 opacity-50 z-0">
            <RestaurantCard restaurant={restaurants[currentIndex + 1]} />
          </div>
        )}

        {/* Current card */}
        <div
          ref={cardRef}
          className={`absolute inset-0 z-10 cursor-grab active:cursor-grabbing transition-all duration-300 ${
            isAnimating ? (swipeDirection === 'right' ? 'translate-x-full rotate-12' : '-translate-x-full -rotate-12') : ''
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            border: '2px solid transparent',
          }}
        >
          <RestaurantCard restaurant={currentRestaurant} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-6">
        <Button
          variant="outline"
          size="lg"
          onClick={handleDislike}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
        >
          <span className="text-2xl">✕</span>
        </Button>
        
        <Button
          size="lg"
          onClick={handleLike}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white"
        >
          <span className="text-2xl">♥</span>
        </Button>
      </div>

      {/* Swipe instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Swipe right to like • Swipe left to pass</p>
        <p>Or use the buttons below</p>
      </div>
    </div>
  );
}
