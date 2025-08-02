'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Home page component - the landing page users see when they visit the app
export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect them to the swipe page
  React.useEffect(() => {
    if (user) {
      router.push('/swipe');
    }
  }, [user, router]);

  // Don't render the landing page if user is logged in (they'll be redirected)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting to your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-primary block">Favorite Restaurant</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Swipe through restaurants like Tinder. Find amazing places to eat, 
            see what your friends love, and never wonder "where should we eat?" again.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {/* Feature 1: Swipe Interface */}
          <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">👆</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Swipe to Discover</h3>
            <p className="text-gray-600">
              Swipe right on restaurants you love, left on ones you don't. 
              It's that simple to find your perfect dining spot.
            </p>
          </div>

          {/* Feature 2: Friend Activity */}
          <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">👥</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Friends</h3>
            <p className="text-gray-600">
              See which restaurants your friends have liked and discover 
              new places through their recommendations.
            </p>
          </div>

          {/* Feature 3: Location-based */}
          <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">📍</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
            <p className="text-gray-600">
              Find restaurants near you or explore dining options 
              in any city you're planning to visit.
            </p>
          </div>
        </div>

        {/* How it works section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Sign Up</h4>
              <p className="text-gray-600 text-sm">Create your account and set your location preferences</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Start Swiping</h4>
              <p className="text-gray-600 text-sm">Browse restaurants and swipe right on ones you like</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Connect Friends</h4>
              <p className="text-gray-600 text-sm">Import contacts to see what your friends are loving</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Dine Out</h4>
              <p className="text-gray-600 text-sm">Visit your matched restaurants and enjoy great food</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center bg-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Next Favorite Restaurant?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of food lovers who are discovering amazing restaurants every day.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Swiping Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
