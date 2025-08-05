/**
 * @fileoverview Branch Service for Reservation Module
 * @description Manages branch selection, validation, and related operations
 * @author ABSteak Development Team
 * @version 1.0.0
 */

import { get } from 'svelte/store';
import { personalFormStore } from '../stores/form/personal';
import type { Branch } from '$lib/components/molecules/card/Branch.svelte';

/**
 * Branch Service Class
 * Handles all branch-related operations for the reservation form
 */
export class BranchService {
	/**
	 * Get selected branch
	 */
	static getSelectedBranch(): Branch | null {
		const formData = get(personalFormStore);
		return formData.data.selectedBranch;
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
			}

			return success;
		} catch (err) {
			console.error('Error handling branch selection:', err);
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
	 * Get branch state snapshot
	 */
	static getBranchState() {
		const selectedBranch = this.getSelectedBranch();
		return {
			selectedBranch,
			isSelected: !!selectedBranch,
			isAvailable: selectedBranch?.available ?? false
		};
	}

	/**
	 * Validate branch selection
	 */
	static validateBranchSelection(): boolean {
		try {
			const selectedBranch = this.getSelectedBranch();
			
			if (!selectedBranch) {
				console.warn('Branch validation failed: no branch selected');
				return false;
			}

			if (!selectedBranch.available) {
				console.warn('Branch validation failed: selected branch is not available');
				return false;
			}

			return true;
		} catch (err) {
			console.error('Error validating branch selection:', err);
			return false;
		}
	}

	/**
	 * Handle keyboard navigation for branch selection
	 */
	static handleKeyboardNavigation(event: KeyboardEvent): boolean {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				this.clearBranchSelection();
				return true;
			default:
				return false;
		}
	}

	/**
	 * Event handler for branch selection from component
	 */
	static handleBranchSelected(event: CustomEvent<Branch>): void {
		const branch = event.detail;
		this.handleBranchSelection(branch);
	}

	/**
	 * Event handler for branch deselection from component
	 */
	static handleBranchDeselected(): void {
		this.clearBranchSelection();
	}

	/**
	 * Callback wrapper for branch selection (adapts callback props to event handlers)
	 */
	static handleBranchSelectedCallback(branch: Branch): void {
		this.handleBranchSelected({ detail: branch } as CustomEvent<Branch>);
	}

	/**
	 * Callback wrapper for branch deselection (adapts callback props to event handlers)
	 */
	static handleBranchDeselectedCallback(): void {
		this.handleBranchDeselected();
	}
}

// Export interface objects for modular access
export const branchInterface = {
	getSelectedBranch: BranchService.getSelectedBranch.bind(BranchService),
	selectBranch: BranchService.selectBranch.bind(BranchService),
	handleSelection: BranchService.handleBranchSelection.bind(BranchService),
	clearSelection: BranchService.clearBranchSelection.bind(BranchService)
};

export const branchStateInterface = {
	getBranchState: BranchService.getBranchState.bind(BranchService),
	validate: BranchService.validateBranchSelection.bind(BranchService)
};

export const branchActionInterface = {
	handleKeyboard: BranchService.handleKeyboardNavigation.bind(BranchService),
	handleBranchSelected: BranchService.handleBranchSelected.bind(BranchService),
	handleBranchDeselected: BranchService.handleBranchDeselected.bind(BranchService),
	handleBranchSelectedCallback: BranchService.handleBranchSelectedCallback.bind(BranchService),
	handleBranchDeselectedCallback: BranchService.handleBranchDeselectedCallback.bind(BranchService)
};

export default BranchService;