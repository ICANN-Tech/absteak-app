import { writable, derived } from 'svelte/store';

export enum StepLabel {
  Personal = 'Personal',
  Payment = 'Payment',
  Confirmation = 'Confirmation'
}

export interface Step {
  id: number;
  label: StepLabel;
  status: 'pending' | 'current' | 'completed';
  isValid: boolean;
  canNavigate: boolean;
}

export interface InterfaceState {
  currentStepIndex: number;
  steps: Step[];
  isNavigating: boolean;
  canProceed: boolean;
  canGoBack: boolean;
}

const initialSteps: Step[] = [
  {
    id: 0,
    label: StepLabel.Personal,
    status: 'current',
    isValid: false,
    canNavigate: true
  },
  {
    id: 1,
    label: StepLabel.Payment,
    status: 'pending',
    isValid: false,
    canNavigate: false
  },
  {
    id: 2,
    label: StepLabel.Confirmation,
    status: 'pending',
    isValid: false,
    canNavigate: false
  }
];

const initialState: InterfaceState = {
  currentStepIndex: 0,
  steps: initialSteps,
  isNavigating: false,
  canProceed: false,
  canGoBack: false
};

function createInterfaceStore() {
  const { subscribe, set, update } = writable<InterfaceState>(initialState);

  return {
    subscribe,

    // Navigate to specific step
    goToStep: (stepIndex: number) => {
      update(state => {
        if (stepIndex < 0 || stepIndex >= state.steps.length) return state;
        if (!state.steps[stepIndex].canNavigate) return state;

        const newSteps = state.steps.map((step, index) => ({
          ...step,
          status: (index < stepIndex ? 'completed' : 
                 index === stepIndex ? 'current' : 'pending') as 'pending' | 'current' | 'completed'
        }));

        return {
          ...state,
          currentStepIndex: stepIndex,
          steps: newSteps,
          canProceed: stepIndex < state.steps.length - 1,
          canGoBack: stepIndex > 0
        };
      });
    },

    // Go to next step
    nextStep: () => {
      update(state => {
        const nextIndex = state.currentStepIndex + 1;
        if (nextIndex >= state.steps.length) return state;
        if (!state.canProceed) return state;

        const newSteps = state.steps.map((step, index) => ({
          ...step,
          status: (index < nextIndex ? 'completed' : 
                 index === nextIndex ? 'current' : 'pending') as 'pending' | 'current' | 'completed',
          canNavigate: index <= nextIndex
        }));

        return {
          ...state,
          currentStepIndex: nextIndex,
          steps: newSteps,
          canProceed: nextIndex < state.steps.length - 1,
          canGoBack: true
        };
      });
    },

    // Go to previous step
    prevStep: () => {
      update(state => {
        const prevIndex = state.currentStepIndex - 1;
        if (prevIndex < 0) return state;

        const newSteps = state.steps.map((step, index) => ({
          ...step,
          status: (index < prevIndex ? 'completed' : 
                 index === prevIndex ? 'current' : 'pending') as 'pending' | 'current' | 'completed'
        }));

        return {
          ...state,
          currentStepIndex: prevIndex,
          steps: newSteps,
          canProceed: true,
          canGoBack: prevIndex > 0
        };
      });
    },

    // Mark current step as valid/invalid
    setStepValid: (stepIndex: number, isValid: boolean) => {
      update(state => {
        const newSteps = state.steps.map((step, index) => 
          index === stepIndex ? { ...step, isValid } : step
        );

        const currentStep = newSteps[state.currentStepIndex];
        const canProceed = currentStep?.isValid && state.currentStepIndex < state.steps.length - 1;

        return {
          ...state,
          steps: newSteps,
          canProceed
        };
      });
    },

    // Set navigation state
    setNavigating: (isNavigating: boolean) => {
      update(state => ({ ...state, isNavigating }));
    },

    // Reset to initial state
    reset: () => {
      set(initialState);
    },

    // Get current step data
    getCurrentStep: () => {
      let currentState: InterfaceState;
      subscribe(state => currentState = state)();
      return currentState!.steps[currentState!.currentStepIndex];
    }
  };
}

export const interfaceStore = createInterfaceStore();

// Derived stores
export const currentStep = derived(interfaceStore, $store => 
  $store.steps[$store.currentStepIndex]
);

export const steps = derived(interfaceStore, $store => $store.steps);

export const currentStepIndex = derived(interfaceStore, $store => $store.currentStepIndex);

export const canProceed = derived(interfaceStore, $store => $store.canProceed);

export const canGoBack = derived(interfaceStore, $store => $store.canGoBack);

export const isNavigating = derived(interfaceStore, $store => $store.isNavigating);

// Helper derived stores
export const isFirstStep = derived(currentStepIndex, $index => $index === 0);

export const isLastStep = derived(interfaceStore, $store => 
  $store.currentStepIndex === $store.steps.length - 1
);

export const completedSteps = derived(steps, $steps => 
  $steps.filter(step => step.status === 'completed')
);

export const progressPercentage = derived(interfaceStore, $store => 
  (($store.currentStepIndex + 1) / $store.steps.length) * 100
);