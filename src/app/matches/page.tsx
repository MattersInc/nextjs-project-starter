'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants, mockFriendActivity } from '@/data/restaurants';
import { Restaurant } from '@/types';
import RestaurantCard from '@/components/RestaurantCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Matches page where users can see their liked restaurants and friend activity
export default function MatchesPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State for liked restaurants and friend activity
  const [likedRestaurants, setLikedRestaurants] = useState<Restaurant[]>([]);
  const [friendActivity, setFriendActivity] = useState<{[key: string]: string[]}>({});

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Get user's liked restaurants
    const userLikedRestaurants = mockRestaurants.filter(restaurant =>
      user.likedRestaurants.includes(restaurant.id)
    );
    setLikedRestaurants(userLikedRestaurants);

    // Set friend activity data
    setFriendActivity(mockFriendActivity);
  }, [user, router]);

  // Get restaurants that friends have also liked
  const getRestaurantsWithFriends = () => {
    return likedRestaurants.map(restaurant => ({
      restaurant,
      friends: friendActivity[restaurant.id] || []
    })).filter(item => item.friends.length > 0);
  };

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

  const restaurantsWithFriends = getRestaurantsWithFriends();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600">
            Restaurants you've liked and what your friends are loving
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {likedRestaurants.length}
              </div>
              <p className="text-gray-600">Restaurants Liked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {restaurantsWithFriends.length}
              </div>
              <p className="text-gray-600">Friend Matches</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {user.dislikedRestaurants.length}
              </div>
              <p className="text-gray-600">Restaurants Passed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="liked">My Likes ({likedRestaurants.length})</TabsTrigger>
            <TabsTrigger value="friends">Friend Activity ({restaurantsWithFriends.length})</TabsTrigger>
          </TabsList>

          {/* Liked Restaurants Tab */}
          <TabsContent value="liked">
            {likedRestaurants.length > 0 ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Restaurants You've Liked
                  </h2>
                  <p className="text-gray-600">
                    These are all the restaurants you've swiped right on. Time to make some reservations!
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedRestaurants.map((restaurant) => (
                    <div key={restaurant.id} className="relative">
                      <RestaurantCard restaurant={restaurant} />
                      
                      {/* Show if friends also liked this restaurant */}
                      {friendActivity[restaurant.id] && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Friends who also liked this:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {friendActivity[restaurant.id].map((friend, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {friend}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No matches yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start swiping to find restaurants you'll love!
                </p>
                <Link href="/swipe">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                    Start Discovering
                  </button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Friend Activity Tab */}
          <TabsContent value="friends">
            {restaurantsWithFriends.length > 0 ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Friend Activity
                  </h2>
                  <p className="text-gray-600">
                    Restaurants that both you and your friends have liked. Perfect for group dining!
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurantsWithFriends.map(({ restaurant, friends }) => (
                    <div key={restaurant.id} className="relative">
                      <RestaurantCard restaurant={restaurant} />
                      
                      {/* Friend activity overlay */}
                      <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center mb-2">
                          <span className="text-green-600 mr-2">👥</span>
                          <p className="text-sm font-medium text-green-800">
                            Mutual Interest
                          </p>
                        </div>
                        <p className="text-sm text-green-700 mb-2">
                          Also liked by:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {friends.map((friend, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                              {friend}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          Perfect for a group dinner!
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No friend matches yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Import your contacts and start swiping to see what restaurants you and your friends both love!
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/profile">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                      Import Contacts
                    </button>
                  </Link>
                  <Link href="/swipe">
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                      Start Swiping
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        {likedRestaurants.length > 0 && (
          <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to dine out?
            </h3>
            <p className="text-gray-600 mb-6">
              You've found some great restaurants! Time to make reservations and enjoy amazing food.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/swipe">
                <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Discover More
                </button>
              </Link>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Share with Friends
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
