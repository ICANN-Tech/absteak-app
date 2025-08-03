import { t } from '$lib/utils/translation';

export interface NewsletterSubscription {
  email: string;
  timestamp: Date;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: NewsletterSubscription;
}


export class NewsletterService {
  // Email validation regex
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validates email format
   */
  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email.trim());
  }

  /**
   * Simulates newsletter subscription (dummy implementation)
   * In real implementation, this would call your backend API
   */
  static async subscribe(email: string): Promise<NewsletterResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!this.validateEmail(trimmedEmail)) {
      return {
        success: false,
        message: t('footer.newsletter.forms.email.validation.email', 'Please enter a valid email address')
      };
    }

    // Simulate random success/failure for demo purposes
    // In real implementation, this would be actual API call
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      const subscription: NewsletterSubscription = {
        email: trimmedEmail,
        timestamp: new Date()
      };

      return {
        success: true,
        message: t('footer.newsletter.forms.message.success', 'Successfully subscribed!'),
        data: subscription
      };
    } else {
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