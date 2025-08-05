import { writable, derived } from 'svelte/store';
import type { PaymentMethod } from '$lib/types';

export interface PaymentFormData {
  selectedMethod: PaymentMethod | null;
  customerNotes: string;
  agreeToTerms: boolean;
  promoCode: string;
  totalAmount: number;
  adminFee: number;
  finalAmount: number;
}

export interface PaymentFormErrors {
  selectedMethod?: string;
  agreeToTerms?: string;
  promoCode?: string;
}

export interface PaymentFormState {
  data: PaymentFormData;
  errors: PaymentFormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  touched: Record<keyof PaymentFormData, boolean>;
}

const initialData: PaymentFormData = {
  selectedMethod: null,
  customerNotes: '',
  agreeToTerms: false,
  promoCode: '',
  totalAmount: 0,
  adminFee: 0,
  finalAmount: 0
};

const initialErrors: PaymentFormErrors = {};

const initialTouched: Record<keyof PaymentFormData, boolean> = {
  selectedMethod: false,
  customerNotes: false,
  agreeToTerms: false,
  promoCode: false,
  totalAmount: false,
  adminFee: false,
  finalAmount: false
};

const initialState: PaymentFormState = {
  data: initialData,
  errors: initialErrors,
  isValid: false,
  isSubmitting: false,
  touched: initialTouched
};

function createPaymentFormStore() {
  const { subscribe, set, update } = writable<PaymentFormState>(initialState);

  return {
    subscribe,

    // Update specific field
    updateField: <K extends keyof PaymentFormData>(field: K, value: PaymentFormData[K], markAsTouched: boolean = true) => {
      update(state => {
        const newData = { ...state.data, [field]: value };

        // Auto-calculate amounts when payment method changes
        if (field === 'selectedMethod') {
          const method = value as PaymentMethod | null;
          newData.adminFee = method?.fee || 0;
          newData.finalAmount = newData.totalAmount + newData.adminFee;
        }

        const newState = {
          ...state,
          data: newData,
          touched: markAsTouched ? { ...state.touched, [field]: true } : state.touched
        };
        
        return { ...newState, errors: {}, isValid: validateForm(newData) };
      });
    },

    // Set payment method
    setPaymentMethod: (method: PaymentMethod | null) => {
      update(state => {
        const newData = { 
          ...state.data, 
          selectedMethod: method,
          adminFee: method?.fee || 0,
          finalAmount: state.data.totalAmount + (method?.fee || 0)
        };

        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, selectedMethod: true }
        };

        return { ...newState, errors: {}, isValid: validateForm(newData) };
      });
    },

    // Set total amount (from reservation details)
    setTotalAmount: (amount: number) => {
      update(state => {
        const newData = { 
          ...state.data, 
          totalAmount: amount,
          finalAmount: amount + state.data.adminFee
        };

        return { ...state, data: newData, isValid: validateForm(newData) };
      });
    },

    // Apply promo code
    applyPromoCode: (code: string) => {
      update(state => {
        const newData = { ...state.data, promoCode: code };
        
        // Here you could add promo code validation logic
        // For now, just update the field
        
        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, promoCode: true }
        };

        return { ...newState, errors: {}, isValid: validateForm(newData) };
      });
    },

    // Mark field as touched
    touchField: (field: keyof PaymentFormData) => {
      update(state => ({
        ...state,
        touched: { ...state.touched, [field]: true }
      }));
    },

    // Validate form
    validateAll: () => {
      update(state => {
        const errors = validateFormFields(state.data);
        return { 
          ...state, 
          errors, 
          isValid: Object.keys(errors).length === 0 
        };
      });
    },

    // Set submitting state
    setSubmitting: (isSubmitting: boolean) => {
      update(state => ({ ...state, isSubmitting }));
    },

    // Reset form
    reset: () => {
      set(initialState);
    },

    // Get form data for submission
    getFormData: () => {
      let currentState: PaymentFormState;
      subscribe(state => currentState = state)();
      return currentState!.data;
    }
  };
}

// Validation functions
function validateForm(data: PaymentFormData): boolean {
  return data.selectedMethod !== null && data.agreeToTerms;
}

function validateFormFields(data: PaymentFormData): PaymentFormErrors {
  const errors: PaymentFormErrors = {};

  if (!data.selectedMethod) {
    errors.selectedMethod = 'Pilih metode pembayaran';
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan';
  }

  return errors;
}

export const paymentFormStore = createPaymentFormStore();

// Derived stores for easy access
export const paymentFormData = derived(paymentFormStore, $store => $store.data);
export const paymentFormErrors = derived(paymentFormStore, $store => $store.errors);
export const paymentFormIsValid = derived(paymentFormStore, $store => $store.isValid);
export const paymentFormIsSubmitting = derived(paymentFormStore, $store => $store.isSubmitting);
export const paymentFormTouched = derived(paymentFormStore, $store => $store.touched);

// Specific derived stores for components
export const selectedPaymentMethod = derived(paymentFormStore, $store => $store.data.selectedMethod);
export const paymentTotalAmount = derived(paymentFormStore, $store => $store.data.totalAmount);
export const paymentAdminFee = derived(paymentFormStore, $store => $store.data.adminFee);
export const paymentFinalAmount = derived(paymentFormStore, $store => $store.data.finalAmount);
export const paymentAgreeToTerms = derived(paymentFormStore, $store => $store.data.agreeToTerms);