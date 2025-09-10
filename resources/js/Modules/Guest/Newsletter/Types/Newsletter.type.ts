/**
 * Newsletter Module Type Definitions
 * 
 * This file contains all type definitions for the newsletter subscription system.
 * It ensures type safety across the API, service, and store layers.
 * 
 * @module NewsletterTypes
 * @version 1.0.0
 */

// Base newsletter subscription data
export interface Newsletter {
  id?: number;
  email: string;
  created_at?: string;
  updated_at?: string;
  subscribed_at?: Date;
  status?: 'active' | 'inactive' | 'pending';
}

// Newsletter subscription request payload
export interface NewsletterSubscriptionRequest {
  email: string;
}

// Newsletter subscription response from API
export interface NewsletterSubscriptionResponse {
  success: boolean;
  message: string;
  data?: Newsletter;
}

// Newsletter service response (local)
export interface NewsletterServiceResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    timestamp: Date;
    id?: number;
  };
}

// Newsletter store state
export interface NewsletterState {
  email: string;
  isSubscribing: boolean;
  error: string | null;
  success: boolean;
  lastResponse: NewsletterServiceResponse | null;
  isFormValid: boolean;
  subscriptionData?: {
    email: string;
    timestamp: Date;
    id?: number;
  };
}

// Newsletter validation result
export interface NewsletterValidationResult {
  isValid: boolean;
  error?: string;
}

// Newsletter API error response
export interface NewsletterApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Newsletter form data
export interface NewsletterFormData {
  email: string;
}

// Newsletter subscription status
export type NewsletterSubscriptionStatus = 'idle' | 'subscribing' | 'success' | 'error';

// Newsletter event types
export interface NewsletterEvents {
  subscribe: NewsletterSubscriptionRequest;
  success: NewsletterServiceResponse;
  error: NewsletterApiError;
  reset: void;
}

// Export legacy interface for backward compatibility
export interface NewsletterResponse extends NewsletterServiceResponse {}

// Export all types as a namespace for organized imports
export namespace NewsletterTypes {
  export type Subscription = Newsletter;
  export type Request = NewsletterSubscriptionRequest;
  export type Response = NewsletterSubscriptionResponse;
  export type ServiceResponse = NewsletterServiceResponse;
  export type State = NewsletterState;
  export type ValidationResult = NewsletterValidationResult;
  export type ApiError = NewsletterApiError;
  export type FormData = NewsletterFormData;
  export type Status = NewsletterSubscriptionStatus;
  export type Events = NewsletterEvents;
}