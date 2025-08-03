import { writable, derived } from 'svelte/store';
import { NewsletterService, type NewsletterResponse } from '../services/newsletter.service';

interface NewsletterState {
  email: string;
  isSubscribing: boolean;
  error: string | null;
  success: boolean;
  lastResponse: NewsletterResponse | null;
  isFormValid: boolean;
}

// Initial state
const initialState: NewsletterState = {
  email: '',
  isSubscribing: false,
  error: null,
  success: false,
  lastResponse: null,
  isFormValid: false
};

// Create the main store
function createNewsletterStore() {
  const { subscribe, set, update } = writable<NewsletterState>(initialState);

  return {
    subscribe,
    
    // Set email value
    setEmail: (email: string) => {
      console.log('setEmail called with:', email);
      update(state => {
        console.log('Previous state:', state);
        const newState = {
          ...state,
          email,
          error: null, // Clear error when user types
          success: false, // Clear success state when user types
          isFormValid: email.trim() !== '' && email.includes('@') && email.includes('.')
        };
        console.log('New state:', newState);
        return newState;
      });
    },

    // Validate email and set error if invalid
    validateEmail: async () => {
      let currentState: NewsletterState;
      
      // Get current state
      const unsubscribe = subscribe(state => {
        currentState = state;
      });
      unsubscribe();

      const error = await NewsletterService.getEmailValidationError(currentState!.email);
      
      update(state => ({
        ...state,
        error,
        isFormValid: state.email.trim() !== '' && error === null
      }));
    },

    // Subscribe to newsletter
    subscribeToNewsletter: async () => {
      let currentState: NewsletterState;
      
      // Get current state
      const unsubscribe = subscribe(state => {
        currentState = state;
      });
      unsubscribe();

      // Validate email before subscribing
      const validationError = await NewsletterService.getEmailValidationError(currentState!.email);
      if (validationError) {
        update(state => ({
          ...state,
          error: validationError,
          isFormValid: false
        }));
        return;
      }

      // Set loading state
      update(state => ({
        ...state,
        isSubscribing: true,
        error: null,
        success: false,
        isFormValid: state.email.trim() !== ''
      }));

      try {
        const response = await NewsletterService.subscribe(currentState!.email);
        
        update(state => ({
          ...state,
          isSubscribing: false,
          error: response.success ? null : response.message,
          success: response.success,
          lastResponse: response,
          email: response.success ? '' : state.email, // Clear email on success
          isFormValid: response.success ? false : (state.email.trim() !== '' && !response.message)
        }));

        return response;
      } catch (error) {
        update(state => ({
          ...state,
          isSubscribing: false,
          error: 'An unexpected error occurred. Please try again.',
          success: false,
          lastResponse: null,
          isFormValid: false
        }));
        
        return {
          success: false,
          message: 'An unexpected error occurred. Please try again.'
        };
      }
    },

    // Reset store to initial state
    reset: () => {
      set(initialState);
    },

    // Clear error
    clearError: () => {
      update(state => ({
        ...state,
        error: null,
        isFormValid: state.email.trim() !== ''
      }));
    },

    // Clear success
    clearSuccess: () => {
      update(state => ({
        ...state,
        success: false,
        isFormValid: state.email.trim() !== ''
      }));
    }
  };
}

// Create the store instance
export const newsletterStore = createNewsletterStore();

// Export the main store as default for direct access
export default newsletterStore;