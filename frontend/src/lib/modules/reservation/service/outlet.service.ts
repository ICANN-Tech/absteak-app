/**
 * @fileoverview Outlet Service for Reservation Module
 * @description Manages outlet selection, validation, and related operations
 * @author ABSteak Development Team
 * @version 1.0.0
 */

import { get } from 'svelte/store';
import { personalFormStore } from '../stores/form/personal';
import type { Outlet } from '$lib/components/organisms/reservation/form/OutletSelector.svelte';

/**
 * Outlet Service Class
 * Handles all outlet-related operations for the reservation form
 */
export class OutletService {
	/**
	 * Get selected outlet
	 */
	static getSelectedOutlet(): Outlet | null {
		const formData = get(personalFormStore);
		return formData.data.selectedOutlet;
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

			// Select the outlet
			const success = this.selectOutlet(outlet);
			
			if (success) {
				// Mark outlet field as touched
				personalFormStore.touchField('selectedOutlet');
			}

			return success;
		} catch (err) {
			console.error('Error handling outlet selection:', err);
			return false;
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
	 * Get outlet state snapshot
	 */
	static getOutletState() {
		const selectedOutlet = this.getSelectedOutlet();
		return {
			selectedOutlet,
			isSelected: !!selectedOutlet,
			isAvailable: selectedOutlet?.available ?? false
		};
	}

	/**
	 * Validate outlet selection
	 */
	static validateOutletSelection(): boolean {
		try {
			const selectedOutlet = this.getSelectedOutlet();
			
			if (!selectedOutlet) {
				console.warn('Outlet validation failed: no outlet selected');
				return false;
			}

			if (!selectedOutlet.available) {
				console.warn('Outlet validation failed: selected outlet is not available');
				return false;
			}

			return true;
		} catch (err) {
			console.error('Error validating outlet selection:', err);
			return false;
		}
	}

	/**
	 * Get outlets for selected branch
	 */
	static getOutletsForBranch(branchId: string): Outlet[] {
		try {
			// This would typically fetch from an API or store
			// For now, return empty array as placeholder
			console.log(`Getting outlets for branch: ${branchId}`);
			return [];
		} catch (err) {
			console.error('Error getting outlets for branch:', err);
			return [];
		}
	}

	/**
	 * Handle keyboard navigation for outlet selection
	 */
	static handleKeyboardNavigation(event: KeyboardEvent): boolean {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				this.clearOutletSelection();
				return true;
			default:
				return false;
		}
	}

	/**
	 * Check if outlet is compatible with selected branch
	 */
	static isOutletCompatibleWithBranch(outlet: Outlet, branchId: string): boolean {
		try {
			// Validate outlet belongs to the selected branch
			return outlet.branchId === branchId;
		} catch (err) {
			console.error('Error checking outlet compatibility:', err);
			return false;
		}
	}

	/**
	 * Event handler for outlet selection from component
	 */
	static handleOutletSelected(event: CustomEvent<Outlet>): void {
		const outlet = event.detail;
		this.handleOutletSelection(outlet);
	}

	/**
	 * Event handler for outlet deselection from component
	 */
	static handleOutletDeselected(): void {
		this.clearOutletSelection();
	}

	/**
	 * Callback wrapper for outlet selection (adapts callback props to event handlers)
	 */
	static handleOutletSelectedCallback(outlet: Outlet): void {
		this.handleOutletSelected({ detail: outlet } as CustomEvent<Outlet>);
	}

	/**
	 * Callback wrapper for outlet deselection (adapts callback props to event handlers)
	 */
	static handleOutletDeselectedCallback(): void {
		this.handleOutletDeselected();
	}
}

// Export interface objects for modular access
export const outletInterface = {
	getSelectedOutlet: OutletService.getSelectedOutlet.bind(OutletService),
	selectOutlet: OutletService.selectOutlet.bind(OutletService),
	handleSelection: OutletService.handleOutletSelection.bind(OutletService),
	clearSelection: OutletService.clearOutletSelection.bind(OutletService)
};

export const outletStateInterface = {
	getOutletState: OutletService.getOutletState.bind(OutletService),
	validate: OutletService.validateOutletSelection.bind(OutletService),
	getOutletsForBranch: OutletService.getOutletsForBranch.bind(OutletService),
	isCompatibleWithBranch: OutletService.isOutletCompatibleWithBranch.bind(OutletService)
};

export const outletActionInterface = {
	handleKeyboard: OutletService.handleKeyboardNavigation.bind(OutletService),
	handleOutletSelected: OutletService.handleOutletSelected.bind(OutletService),
	handleOutletDeselected: OutletService.handleOutletDeselected.bind(OutletService),
	handleOutletSelectedCallback: OutletService.handleOutletSelectedCallback.bind(OutletService),
	handleOutletDeselectedCallback: OutletService.handleOutletDeselectedCallback.bind(OutletService)
};

export default OutletService;