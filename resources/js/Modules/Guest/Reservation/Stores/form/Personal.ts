import { writable, derived } from 'svelte/store';
import type { Branch } from '$lib/components/organisms/reservation/form/BranchSelector.svelte';
import type { Outlet } from '$lib/components/organisms/reservation/form/OutletSelector.svelte';

export interface PersonalFormData {
  // Branch and Outlet selection
  selectedBranch: Branch | null;
  selectedOutlet: Outlet | null;
  
  // Personal information
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  specialRequests: string;
}

export interface PersonalFormErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  partySize?: string;
  selectedBranch?: string;
  selectedOutlet?: string;
}

export interface PersonalFormState {
  data: PersonalFormData;
  errors: PersonalFormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  touched: Record<keyof PersonalFormData, boolean>;
}

const initialData: PersonalFormData = {
  selectedBranch: null,
  selectedOutlet: null,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  partySize: 2,
  specialRequests: ''
};

const initialErrors: PersonalFormErrors = {};

const initialTouched: Record<keyof PersonalFormData, boolean> = {
  selectedBranch: false,
  selectedOutlet: false,
  customerName: false,
  customerEmail: false,
  customerPhone: false,
  partySize: false,
  specialRequests: false
};

const initialState: PersonalFormState = {
  data: initialData,
  errors: initialErrors,
  isValid: false,
  isSubmitting: false,
  touched: initialTouched
};

// Zod validation schema
// Validation schema removed as per user request.
// function validateForm(data: PersonalFormData): PersonalFormErrors {
//   const errors: PersonalFormErrors = {};
//   // ... validation logic removed
//   return errors;
// }

function createPersonalFormStore() {
  const { subscribe, set, update } = writable<PersonalFormState>(initialState);

  return {
    subscribe,

    // Update specific field
    updateField: <K extends keyof PersonalFormData>(field: K, value: PersonalFormData[K], markAsTouched: boolean = true) => {
      update(state => {
        const newData = { ...state.data, [field]: value };

        const newState = {
          ...state,
          data: newData,
          touched: markAsTouched ? { ...state.touched, [field]: true } : state.touched
        };
        
        return { ...newState, errors: {}, isValid: true };
      });
    },

    // Set branch and reset outlet if branch changes
    setBranch: (branch: Branch | null) => {
      update(state => {
        const newData = { 
          ...state.data, 
          selectedBranch: branch,
          selectedOutlet: null // Reset outlet when branch changes
        };

        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, selectedBranch: true, selectedOutlet: false }
        };

        return { ...newState, errors: {}, isValid: true };
      });
    },

    // Set outlet
    setOutlet: (outlet: Outlet | null) => {
      update(state => {
        const newData = { ...state.data, selectedOutlet: outlet };

        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, selectedOutlet: true }
        };

        return { ...newState, errors: {}, isValid: true };
      });
    },

    // Mark field as touched
    touchField: (field: keyof PersonalFormData) => {
      update(state => ({
        ...state,
        touched: { ...state.touched, [field]: true }
      }));
    },

    // Validation is currently disabled as per user request.
    // validateAll: () => {
    //   update(state => {
    //     return { ...state, errors: {}, isValid: true };
    //   });
    // }

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
      let currentState: PersonalFormState;
      subscribe(state => currentState = state)();
      return currentState!.data;
    }
  };
}

export const personalFormStore = createPersonalFormStore();

// Derived stores for easy access
export const personalFormData = derived(personalFormStore, $store => $store.data);
export const personalFormErrors = derived(personalFormStore, $store => $store.errors);
export const personalFormIsValid = derived(personalFormStore, $store => $store.isValid);
export const personalFormIsSubmitting = derived(personalFormStore, $store => $store.isSubmitting);
export const personalFormTouched = derived(personalFormStore, $store => $store.touched);

// Specific derived stores for components
export const selectedBranch = derived(personalFormStore, $store => $store.data.selectedBranch);
export const selectedOutlet = derived(personalFormStore, $store => $store.data.selectedOutlet);
