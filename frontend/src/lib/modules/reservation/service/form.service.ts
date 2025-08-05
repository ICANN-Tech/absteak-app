import { get } from 'svelte/store';
import { personalFormStore } from '../stores/form/personal';
import { interfaceStore } from '../stores/interface';
import type { Branch } from '$lib/components/molecules/card/Branch.svelte';
import type { Outlet } from '$lib/components/molecules/card/Outlet.svelte';
import type { PersonalFormData } from '../stores/form/personal';

/**
 * Form Service
 * Provides centralized management for reservation form interactions
 */
export class FormService {
	/**
	 * Get current form data
	 */
	static getFormData(): PersonalFormData {
		return personalFormStore.getFormData();
	}

	/**
	 * Get selected branch
	 */
	static getSelectedBranch(): Branch | null {
		const formData = this.getFormData();
		return formData.selectedBranch;
	}

	/**
	 * Get selected outlet
	 */
	static getSelectedOutlet(): Outlet | null {
		const formData = this.getFormData();
		return formData.selectedOutlet;
	}

	/**
	 * Select a branch and reset outlet selection
	 */
	static selectBranch(branch: Branch | null): boolean {
		try {
			if (!branch) {
				console.warn('Cannot select branch: branch is required');
				return false;
			}

			if (!branch.available) {
				console.warn(`Cannot select branch: ${branch.name} is not available`);
				return false;
			}

			personalFormStore.setBranch(branch);
			console.log(`Branch selected: ${branch.name}`);
			return true;
		} catch (err) {
			console.error('Error selecting branch:', err);
			return false;
		}
	}

	/**
	 * Handle branch selection with validation
	 */
	static handleBranchSelection(branch: Branch): boolean {
		try {
			// Validate branch availability
			if (!branch.available) {
				console.warn(`Branch ${branch.name} is not available for selection`);
				return false;
			}

			// Select the branch (this will also reset outlet)
			const success = this.selectBranch(branch);
			
			if (success) {
				// Mark branch field as touched
				personalFormStore.touchField('selectedBranch');
				
				// Validate form after branch selection
				this.validateCurrentStep();
			}

			return success;
		} catch (err) {
			console.error('Error handling branch selection:', err);
			return false;
		}
	}

	/**
	 * Select an outlet
	 */
	static selectOutlet(outlet: Outlet | null): boolean {
		try {
			if (!outlet) {
				console.warn('Cannot select outlet: outlet is required');
				return false;
			}

			if (!outlet.available) {
				console.warn(`Cannot select outlet: ${outlet.name} is not available`);
				return false;
			}

			// Validate that outlet belongs to selected branch
			const selectedBranch = this.getSelectedBranch();
			if (!selectedBranch) {
				console.warn('Cannot select outlet: no branch selected');
				return false;
			}

			if (outlet.branchId !== selectedBranch.id) {
				console.warn(`Cannot select outlet: ${outlet.name} does not belong to selected branch`);
				return false;
			}

			personalFormStore.setOutlet(outlet);
			console.log(`Outlet selected: ${outlet.name}`);
			return true;
		} catch (err) {
			console.error('Error selecting outlet:', err);
			return false;
		}
	}

	/**
	 * Handle outlet selection with validation
	 */
	static handleOutletSelection(outlet: Outlet): boolean {
		try {
			// Validate outlet availability
			if (!outlet.available) {
				console.warn(`Outlet ${outlet.name} is not available for selection`);
				return false;
			}

			// Validate branch selection first
			const selectedBranch = this.getSelectedBranch();
			if (!selectedBranch) {
				console.warn('Please select a branch first before choosing an outlet');
				return false;
			}

			// Validate outlet belongs to selected branch
			if (outlet.branchId !== selectedBranch.id) {
				console.warn(`Outlet ${outlet.name} is not available for the selected branch`);
				return false;
			}

			// Select the outlet
			const success = this.selectOutlet(outlet);
			
			if (success) {
				// Mark outlet field as touched
				personalFormStore.touchField('selectedOutlet');
				
				// Validate form after outlet selection
				this.validateCurrentStep();
			}

			return success;
		} catch (err) {
			console.error('Error handling outlet selection:', err);
			return false;
		}
	}

	/**
	 * Clear branch selection and reset outlet
	 */
	static clearBranchSelection(): void {
		try {
			personalFormStore.setBranch(null);
			console.log('Branch selection cleared');
		} catch (err) {
			console.error('Error clearing branch selection:', err);
		}
	}

	/**
	 * Clear outlet selection
	 */
	static clearOutletSelection(): void {
		try {
			personalFormStore.setOutlet(null);
			console.log('Outlet selection cleared');
		} catch (err) {
			console.error('Error clearing outlet selection:', err);
		}
	}

	/**
	 * Validate current step and update interface
	 */
	static validateCurrentStep(): boolean {
		try {
			const formData = this.getFormData();
			
			// Basic validation for personal form step
			const isValid = !!(
				formData.selectedBranch &&
				formData.selectedOutlet &&
				formData.customerName.trim() &&
				formData.customerEmail.trim() &&
				formData.customerPhone.trim() &&
				formData.partySize > 0
			);

			// Update interface step validity
			interfaceStore.setStepValid(0, isValid); // Assuming personal form is step 0

			console.log(`Current step validation: ${isValid ? 'valid' : 'invalid'}`);
			return isValid;
		} catch (err) {
			console.error('Error validating current step:', err);
			return false;
		}
	}

	/**
	 * Handle form submission and proceed to next step
	 */
	static handleSubmit(): boolean {
		try {
			// Validate form before submission
			const isValid = this.validateCurrentStep();
			
			if (!isValid) {
				console.warn('Cannot submit: form validation failed');
				return false;
			}

			// Set submitting state
			personalFormStore.setSubmitting(true);

			// Proceed to next step
			interfaceStore.nextStep();

			// Clear submitting state
			setTimeout(() => {
				personalFormStore.setSubmitting(false);
			}, 500);

			console.log('Form submitted successfully, proceeding to next step');
			return true;
		} catch (err) {
			console.error('Error handling form submission:', err);
			personalFormStore.setSubmitting(false);
			return false;
		}
	}

	/**
	 * Reset form to initial state
	 */
	static reset(): void {
		try {
			personalFormStore.reset();
			console.log('Form reset to initial state');
		} catch (err) {
			console.error('Error resetting form:', err);
		}
	}

	/**
	 * Get form state snapshot
	 */
	static getState() {
		const formData = this.getFormData();
		return {
			selectedBranch: formData.selectedBranch,
			selectedOutlet: formData.selectedOutlet,
			customerName: formData.customerName,
			customerEmail: formData.customerEmail,
			customerPhone: formData.customerPhone,
			partySize: formData.partySize,
			specialRequests: formData.specialRequests,
			isValid: this.validateCurrentStep()
		};
	}

	/**
	 * Validate form data integrity
	 */
	static validateFormData(): boolean {
		try {
			const formData = this.getFormData();
			
			// Check if branch and outlet are properly linked
			if (formData.selectedBranch && formData.selectedOutlet) {
				if (formData.selectedOutlet.branchId !== formData.selectedBranch.id) {
					console.warn('Form data integrity error: outlet does not belong to selected branch');
					return false;
				}
			}

			// Check if outlet is selected without branch
			if (formData.selectedOutlet && !formData.selectedBranch) {
				console.warn('Form data integrity error: outlet selected without branch');
				return false;
			}

			return true;
		} catch (err) {
			console.error('Error validating form data:', err);
			return false;
		}
	}

	/**
	 * Handle keyboard navigation for form
	 */
	static handleKeyboardNavigation(event: KeyboardEvent): boolean {
		switch (event.key) {
			case 'Enter':
				if (event.ctrlKey || event.metaKey) {
					event.preventDefault();
					return this.handleSubmit();
				}
				return false;
			case 'Escape':
				event.preventDefault();
				this.clearOutletSelection();
				return true;
			default:
				return false;
		}
	}
}

export const branchInterface = {
	getSelectedBranch: FormService.getSelectedBranch.bind(FormService),
	selectBranch: FormService.selectBranch.bind(FormService),
	handleSelection: FormService.handleBranchSelection.bind(FormService),
	clearSelection: FormService.clearBranchSelection.bind(FormService)
};

export const outletInterface = {
	getSelectedOutlet: FormService.getSelectedOutlet.bind(FormService),
	selectOutlet: FormService.selectOutlet.bind(FormService),
	handleSelection: FormService.handleOutletSelection.bind(FormService),
	clearSelection: FormService.clearOutletSelection.bind(FormService)
};

export const formActionInterface = {
	handleSubmit: FormService.handleSubmit.bind(FormService),
	reset: FormService.reset.bind(FormService),
	validateCurrentStep: FormService.validateCurrentStep.bind(FormService),
	handleKeyboard: FormService.handleKeyboardNavigation.bind(FormService)
};

export const formStateInterface = {
	getFormData: FormService.getFormData.bind(FormService),
	getState: FormService.getState.bind(FormService),
	validate: FormService.validateFormData.bind(FormService)
};

export default FormService;