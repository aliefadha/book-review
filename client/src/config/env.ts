/**
 * Environment configuration for the client application
 */

export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // Development Configuration
  isDevelopment: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV,
  
  // Build Configuration
  isProduction: import.meta.env.PROD,
} as const;

/**
 * API endpoints configuration
 */
export const apiEndpoints = {
  books: `${config.apiBaseUrl}/books`,
  search: `${config.apiBaseUrl}/search`,
  reviews: `${config.apiBaseUrl}/reviews`,
} as const;

/**
 * Validate required environment variables
 */
export const validateEnv = () => {
  const requiredVars = {
    VITE_API_BASE_URL: config.apiBaseUrl,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  if (config.isDevelopment) {
    console.log('Environment configuration:', {
      apiBaseUrl: config.apiBaseUrl,
      isDevelopment: config.isDevelopment,
      isProduction: config.isProduction,
    });
  }
};