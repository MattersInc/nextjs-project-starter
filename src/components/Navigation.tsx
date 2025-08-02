'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Navigation component that appears at the top of every page
// Shows different options based on whether user is logged in or not
export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Helper function to determine if a navigation link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand section */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              FoodSwipe
            </Link>
          </div>

          {/* Navigation links - only show if user is authenticated */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Main navigation links */}
              <div className="hidden md:flex items-center space-x-1">
                <Link
                  href="/swipe"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive('/swipe')
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  )}
                >
                  Discover
                </Link>
                <Link
                  href="/matches"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive('/matches')
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  )}
                >
                  Matches
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive('/profile')
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  )}
                >
                  Profile
                </Link>
              </div>

              {/* User info and logout */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-sm"
                >
                  Logout
                </Button>
              </div>

              {/* Mobile menu button - shows navigation links on small screens */}
              <div className="md:hidden">
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/swipe"
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-colors",
                      isActive('/swipe')
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:text-primary"
                    )}
                  >
                    Discover
                  </Link>
                  <Link
                    href="/matches"
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-colors",
                      isActive('/matches')
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:text-primary"
                    )}
                  >
                    Matches
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Show login/register buttons if user is not authenticated
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
