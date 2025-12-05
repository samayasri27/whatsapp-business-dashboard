import { useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Custom auth hook that:
 * 1. Uses Clerk for user authentication (sign-in/sign-up)
 * 2. Exchanges Clerk session for JWT token for API communication
 * 
 * This meets hackathon requirements:
 * - Clerk handles user auth (better UX)
 * - JWT used for API communication (hackathon requirement)
 */
export function useAuth() {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { userId: clerkUserId } = useClerkAuth();
  const setUserId = useStore((state) => state.setUserId);

  useEffect(() => {
    async function exchangeClerkForJWT() {
      if (!isUserLoaded) return;
      
      if (isSignedIn && clerkUserId) {
        try {
          // Check if we already have a valid JWT
          const existingJWT = localStorage.getItem('jwt_token');
          const jwtExpiry = localStorage.getItem('jwt_expiry');
          
          if (existingJWT && jwtExpiry) {
            const expiryTime = parseInt(jwtExpiry);
            if (Date.now() < expiryTime) {
              console.log('✅ Using existing JWT token');
              setUserId(clerkUserId);
              return;
            }
          }

          // Exchange Clerk session for JWT token
          console.log('🔄 Exchanging Clerk session for JWT token...');
          
          const response = await fetch(`${API_URL}/auth/clerk-to-jwt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerk_user_id: clerkUserId,
              email: user?.primaryEmailAddress?.emailAddress,
              name: user?.fullName || user?.firstName,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to exchange Clerk session for JWT');
          }

          const data = await response.json();
          
          // Store JWT token and expiry
          localStorage.setItem('jwt_token', data.token);
          localStorage.setItem('jwt_expiry', (Date.now() + (data.expires_in_hours * 60 * 60 * 1000)).toString());
          
          setUserId(clerkUserId);
          
          console.log('✅ JWT token obtained successfully');
          toast.success('Authenticated successfully!');
        } catch (error) {
          console.error('❌ Failed to exchange Clerk session for JWT:', error);
          toast.error('Authentication failed. Please try again.');
        }
      } else if (!isSignedIn) {
        // Clear JWT when user signs out
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('jwt_expiry');
        setUserId(null);
      }
    }

    exchangeClerkForJWT();
  }, [isUserLoaded, isSignedIn, clerkUserId, user, setUserId]);

  return {
    user,
    isLoaded: isUserLoaded,
    isSignedIn,
    clerkUserId,
  };
}
