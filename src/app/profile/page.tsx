'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants } from '@/data/restaurants';
import { Contact } from '@/types';
import ImportContacts from '@/components/ImportContacts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

// Profile page where users can manage their account, contacts, and preferences
export default function ProfilePage() {
  const { user, logout, updateUserLocation } = useAuth();
  const router = useRouter();
  
  // State management
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: ''
  });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Initialize profile data
    setProfileData({
      name: user.name,
      email: user.email,
      location: user.location?.city || ''
    });

    // Load contacts from localStorage
    const savedContacts = localStorage.getItem(`foodswipe_contacts_${user.id}`);
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    }
  }, [user, router]);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    if (user && contacts.length > 0) {
      localStorage.setItem(`foodswipe_contacts_${user.id}`, JSON.stringify(contacts));
    }
  }, [contacts, user]);

  // Handle contacts import
  const handleContactsImported = (newContacts: Contact[]) => {
    setContacts(prev => [...prev, ...newContacts]);
  };

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile via API
    console.log('Profile update:', profileData);
    setIsEditingProfile(false);
    
    // Show success message (you could use a toast library here)
    alert('Profile updated successfully!');
  };

  // Handle contact removal
  const handleRemoveContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  // Get user statistics
  const getUserStats = () => {
    if (!user) return { liked: 0, disliked: 0, total: 0 };
    
    const liked = user.likedRestaurants.length;
    const disliked = user.dislikedRestaurants.length;
    const total = liked + disliked;
    
    return { liked, disliked, total };
  };

  // Get favorite cuisines based on liked restaurants
  const getFavoriteCuisines = () => {
    if (!user) return [];
    
    const likedRestaurants = mockRestaurants.filter(r => 
      user.likedRestaurants.includes(r.id)
    );
    
    const cuisineCounts: { [key: string]: number } = {};
    likedRestaurants.forEach(restaurant => {
      cuisineCounts[restaurant.cuisine] = (cuisineCounts[restaurant.cuisine] || 0) + 1;
    });
    
    return Object.entries(cuisineCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([cuisine, count]) => ({ cuisine, count }));
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

  const stats = getUserStats();
  const favoriteCuisines = getFavoriteCuisines();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.name}
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.liked}
              </div>
              <p className="text-sm text-gray-600">Restaurants Liked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {stats.disliked}
              </div>
              <p className="text-sm text-gray-600">Restaurants Passed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.total}
              </div>
              <p className="text-sm text-gray-600">Total Swiped</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {contacts.length}
              </div>
              <p className="text-sm text-gray-600">Contacts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Profile Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit'}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Your city"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Name</p>
                        <p className="text-gray-900">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-gray-900">{user.location?.city || 'Not set'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Favorite Cuisines */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Favorite Cuisines</CardTitle>
                </CardHeader>
                <CardContent>
                  {favoriteCuisines.length > 0 ? (
                    <div className="space-y-3">
                      {favoriteCuisines.map(({ cuisine, count }) => (
                        <div key={cuisine} className="flex items-center justify-between">
                          <span className="font-medium">{cuisine}</span>
                          <Badge variant="secondary">{count} restaurant{count !== 1 ? 's' : ''}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Start liking restaurants to see your favorite cuisines!</p>
                  )}
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Reset Swipe History
                  </Button>
                  <Button variant="destructive" onClick={logout} className="w-full justify-start">
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="space-y-6">
              <ImportContacts
                onContactsImported={handleContactsImported}
                existingContacts={contacts}
              />
              
              {/* Contact Management */}
              {contacts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            {contact.phoneNumber && (
                              <p className="text-xs text-gray-500">{contact.phoneNumber}</p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveContact(contact.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              {/* Location Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Search Radius</Label>
                    <select className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                      <option value="5">5 miles</option>
                      <option value="10" selected>10 miles</option>
                      <option value="25">25 miles</option>
                      <option value="50">50 miles</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-location" defaultChecked />
                    <Label htmlFor="auto-location">Automatically detect my location</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="friend-activity" defaultChecked />
                    <Label htmlFor="friend-activity">Friend activity updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="new-restaurants" defaultChecked />
                    <Label htmlFor="new-restaurants">New restaurants in your area</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="weekly-digest" />
                    <Label htmlFor="weekly-digest">Weekly digest email</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="profile-visible" defaultChecked />
                    <Label htmlFor="profile-visible">Make my profile visible to friends</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="share-activity" defaultChecked />
                    <Label htmlFor="share-activity">Share my restaurant activity with friends</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="location-sharing" />
                    <Label htmlFor="location-sharing">Allow location-based friend suggestions</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
