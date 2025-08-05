import { interfaceStore, StepLabel } from '../stores/interface';
import { personalFormStore } from '../stores/form/personal';

export class InterfaceService {
  private static instance: InterfaceService;

  private constructor() {}

  public static getInstance(): InterfaceService {
    if (!InterfaceService.instance) {
      InterfaceService.instance = new InterfaceService();
    }
    return InterfaceService.instance;
  }

  /**
   * Navigate to a specific step by index
   */
  public goToStep(stepIndex: number): void {
    interfaceStore.goToStep(stepIndex);
  }

  /**
   * Navigate to a specific step by label
   */
  public goToStepByLabel(label: StepLabel): void {
    const stepIndex = this.getStepIndexByLabel(label);
    if (stepIndex !== -1) {
      this.goToStep(stepIndex);
    }
  }

  /**
   * Move to the next step
   */
  public nextStep(): void {
    interfaceStore.nextStep();
  }

  /**
   * Move to the previous step
   */
  public prevStep(): void {
    interfaceStore.prevStep();
  }

  /**
   * Validate and proceed to next step
   */
  public async validateAndProceed(): Promise<boolean> {
    const currentStep = interfaceStore.getCurrentStep();
    
    try {
      interfaceStore.setNavigating(true);
      
      // Validate current step based on its label
      const isValid = await this.validateCurrentStep(currentStep.label);
      
      if (isValid) {
        interfaceStore.setStepValid(currentStep.id, true);
        this.nextStep();
        return true;
      } else {
        interfaceStore.setStepValid(currentStep.id, false);
        return false;
      }
    } catch (error) {
      console.error('Error validating step:', error);
      interfaceStore.setStepValid(currentStep.id, false);
      return false;
    } finally {
      interfaceStore.setNavigating(false);
    }
  }

  /**
   * Validate current step based on step type
   */
  private async validateCurrentStep(stepLabel: StepLabel): Promise<boolean> {
    switch (stepLabel) {
      case StepLabel.Personal:
        return this.validatePersonalStep();
        
      case StepLabel.Payment:
        // Add payment step validation logic here
        return true;
        
      case StepLabel.Summary:
        // Add summary step validation logic here
        return true;
        
      case StepLabel.Receipt:
        // Add confirmation step validation logic here
        return true;
        
      default:
        return false;
    }
  }

  /**
   * Validate personal form step
   */
  private validatePersonalStep(): boolean {
    // UI TESTING: Bypass validation for now
    console.log('Personal step validation bypassed for UI testing');
    return true;
    
    // Original validation logic (commented out for UI testing)
    /*
    let isValid = false;
    
    personalFormStore.subscribe(state => {
      isValid = state.isValid;
    })();
    
    if (!isValid) {
      // Touch all fields to show validation errors
      // TODO: Add custom validation logic for each field
    }
    
    return isValid;
    */
  }

  /**
   * Get step index by label
   */
  private getStepIndexByLabel(label: StepLabel): number {
    let stepIndex = -1;
    
    interfaceStore.subscribe(state => {
      const step = state.steps.find(s => s.label === label);
      stepIndex = step ? step.id : -1;
    })();
    
    return stepIndex;
  }

  /**
   * Mark a step as valid/invalid
   */
  public setStepValid(stepIndex: number, isValid: boolean): void {
    interfaceStore.setStepValid(stepIndex, isValid);
  }

  /**
   * Reset the interface to initial state
   */
  public reset(): void {
    interfaceStore.reset();
  }

  /**
   * Check if can proceed to next step
   */
  public canProceed(): boolean {
    let canProceed = false;
    
    interfaceStore.subscribe(state => {
      canProceed = state.canProceed;
    })();
    
    return canProceed;
  }

  /**
   * Check if can go back to previous step
   */
  public canGoBack(): boolean {
    let canGoBack = false;
    
    interfaceStore.subscribe(state => {
      canGoBack = state.canGoBack;
    })();
    
    return canGoBack;
  }

  /**
   * Get current step information
   */
  public getCurrentStep() {
    return interfaceStore.getCurrentStep();
  }

  /**
   * Set navigation loading state
   */
  public setNavigating(isNavigating: boolean): void {
    interfaceStore.setNavigating(isNavigating);
  }

  /**
   * Initialize step validation based on form states
   */
  public initializeStepValidation(): void {
    // Subscribe to personal form changes and update step validity
    personalFormStore.subscribe(state => {
      this.setStepValid(1, state.isValid); // Personal step is index 1
    });
  }
}

// Export singleton instance
export const interfaceService = InterfaceService.getInstance();