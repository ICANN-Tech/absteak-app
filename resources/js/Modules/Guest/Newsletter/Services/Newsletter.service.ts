import { t } from '@Utils/Global/Translation';
import { NewsletterAPI, type NewsletterSubscriptionResponse } from '../API/Newsletter.api';

// Local Response interface for service layer
export interface Response {
  success: boolean;
  message: string;
  data?: {
    email: string;
    timestamp: Date;
    id?: number;
  };
}

export interface NewsletterSubscription {
  email: string;
  timestamp: Date;
  id?: number;
}

// Legacy interface for backward compatibility
export interface NewsletterResponse extends Response {}


export class NewsletterService {
  // Email validation regex
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validates email format
   */
  static validateEmail(email: string): boolean {
    return NewsletterAPI.validateEmailFormat(email);
  }

  /**
   * Subscribe to newsletter using the API
   * Connects to the backend newsletter subscription endpoint
   */
  static async subscribe(email: string): Promise<Response> {
    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format before API call
    if (!this.validateEmail(trimmedEmail)) {
      return {
        success: false,
        message: t('footer.newsletter.forms.email.validation.email', 'Please enter a valid email address')
      };
    }

    try {
      // Call the API
      const apiResponse: NewsletterSubscriptionResponse = await NewsletterAPI.subscribe(trimmedEmail);
      
      if (apiResponse.success && apiResponse.data) {
        const subscription: NewsletterSubscription = {
          email: apiResponse.data.email,
          timestamp: new Date(apiResponse.data.created_at),
          id: apiResponse.data.id
        };

        return {
          success: true,
          message: t('footer.newsletter.forms.message.success', 'Successfully subscribed!'),
          data: subscription
        };
      } else {
        return {
          success: false,
          message: apiResponse.message || t('footer.newsletter.forms.message.error', 'Failed to subscribe. Please try again.')
        };
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        message: t('footer.newsletter.forms.message.error', 'Failed to subscribe. Please try again.')
      };
    }
  }

  /**
   * Gets validation error message for email
   */
  static async getEmailValidationError(email: string): Promise<string | null> {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return t('footer.newsletter.forms.email.validation.required', 'Email is required');
    }
    
    if (!this.validateEmail(trimmedEmail)) {
      return t('footer.newsletter.forms.email.validation.email', 'Please enter a valid email address');
    }
    
    return null;
  }

  /**
   * Handle form submission - delegates to store
   */
  static async handleSubmit(event: Event, store: any) {
    event.preventDefault();
    return await store.subscribeToNewsletter();
  }

  /**
   * Handle email input - delegates to store
   */
  static handleEmailInput(event: Event, store: any) {
    console.log('handleEmailInput called');
    const target = event.target as HTMLInputElement;
    console.log('Input value:', target.value);
    store.setEmail(target.value);
  }

  /**
   * Create a reactive email binding for Input components
   * Returns an object with getter/setter for two-way binding
   */
  static createEmailBinding(store: any) {
    let localEmail = '';
    
    // Subscribe to store changes
    store.subscribe((state: any) => {
      localEmail = state.email;
    });

    return {
      get value() {
        return localEmail;
      },
      set value(newValue: string) {
        if (newValue !== localEmail) {
          store.setEmail(newValue);
        }
      }
    };
  }

  /**
   * Get current email value from store
   */
  static getEmailValue(store: any): string {
    let currentEmail = '';
    const unsubscribe = store.subscribe((state: any) => {
      currentEmail = state.email;
    });
    unsubscribe();
    return currentEmail;
  }

  /**
   * Set email value in store
   */
  static setEmailValue(store: any, email: string) {
    store.setEmail(email);
  }

  /**
   * Clear success message in store
   */
  static clearSuccess(store: any) {
    store.clearSuccess();
  }

  /**
   * Clear error message in store
   */
  static clearError(store: any) {
    store.clearError();
  }
}