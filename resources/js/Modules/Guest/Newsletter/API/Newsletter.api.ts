/**
 * Newsletter API Module
 * 
 * This module provides API methods for newsletter subscription operations.
 * It follows the rupadana API service standards for Filament resources.
 * 
 * @module NewsletterAPI
 * @version 1.0.0
 */

import axios, { type AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = '/api/admin/newsletters';

// Request/Response interfaces
export interface NewsletterSubscriptionRequest {
  email: string;
}

export interface NewsletterSubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Newsletter API Class
 * 
 * Provides methods for interacting with the newsletter subscription API
 * following rupadana API service patterns.
 */
export class NewsletterAPI {
  /**
   * Subscribe to newsletter
   * 
   * @param email - Email address to subscribe
   * @returns Promise with subscription response
   */
  static async subscribe(email: string): Promise<NewsletterSubscriptionResponse> {
    try {
      const requestData: NewsletterSubscriptionRequest = {
        email: email.trim().toLowerCase()
      };

      const response: AxiosResponse<NewsletterSubscriptionResponse> = await axios.post(
        API_BASE_URL,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      return response.data;
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data as ApiErrorResponse;
        return {
          success: false,
          message: errorData.message || 'Subscription failed',
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
        };
      } else {
        // Other error
        return {
          success: false,
          message: 'An unexpected error occurred. Please try again.',
        };
      }
    }
  }

  /**
   * Validate email format before sending to API
   * 
   * @param email - Email to validate
   * @returns True if email format is valid
   */
  static validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Prepare request data with validation
   * 
   * @param email - Email to prepare
   * @returns Prepared request data or null if invalid
   */
  static prepareSubscriptionData(email: string): NewsletterSubscriptionRequest | null {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      return null;
    }
    
    if (!this.validateEmailFormat(trimmedEmail)) {
      return null;
    }
    
    return {
      email: trimmedEmail
    };
  }

  /**
   * Get API endpoint URL
   * 
   * @returns The base API URL for newsletter operations
   */
  static getApiUrl(): string {
    return API_BASE_URL;
  }
}

// Export default for convenience
export default NewsletterAPI;