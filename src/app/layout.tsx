import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';

// Import Inter font from Google Fonts for modern typography
const inter = Inter({ subsets: ['latin'] });

// Metadata for the app - appears in browser tab and search results
export const metadata: Metadata = {
  title: 'FoodSwipe - Discover Restaurants Like Tinder',
  description: 'Swipe through restaurants and discover your next favorite dining spot. Connect with friends and see what they love!',
};

// Root layout component that wraps all pages
// This is where we set up global providers and navigation
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 
          AuthProvider wraps the entire app to provide authentication context
          This allows any component to access user state and auth functions
        */}
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {/* 
              Navigation component appears on all pages
              It shows different options based on authentication state
            */}
            <Navigation />
            
            {/* 
              Main content area where individual pages will be rendered
              The padding-top accounts for the fixed navigation bar
            */}
            <main className="pt-16">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
