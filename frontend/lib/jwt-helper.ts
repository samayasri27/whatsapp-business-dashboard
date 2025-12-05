// JWT Helper for API-to-API authentication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generate a JWT token for API-to-API communication
 * 
 * Use this when you need to authenticate:
 * - Service-to-service calls
 * - Legacy system integration
 * - External API access
 * 
 * @param userId - User ID to include in token
 * @param apiKey - API key for authentication
 * @returns JWT token string
 */
export async function generateJWTToken(userId: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/auth/generate-jwt?user_id=${userId}&api_key=${apiKey}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to generate JWT token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
}

/**
 * Verify any token (Clerk or JWT)
 * 
 * @param token - Token to verify
 * @returns Verification result
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

/**
 * Store JWT token in localStorage
 * Use this for API-to-API tokens (not Clerk tokens)
 */
export function storeJWTToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
}

/**
 * Get stored JWT token from localStorage
 */
export function getStoredJWTToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
}

/**
 * Clear stored JWT token
 */
export function clearJWTToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
  }
}
