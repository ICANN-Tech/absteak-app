import { get, derived } from 'svelte/store';
import { modalStore } from '../../../../stores/modal';
import type { DetailMenuItem, DetailModalData } from '../../types/menu.type';

/**
 * Detail Modal Service
 * Provides centralized management for detail modal interactions
 */
export class DetailModalService {
	private static readonly MODAL_ID = 'detail-modal';
	private static currentMenuItem: DetailMenuItem | null = null;

	/**
	 * Get the modal state for the detail modal
	 */
	static getModalState() {
		return derived(modalStore, ($store) => ({ isOpen: $store.isOpen }));
	}

	/**
	 * Check if the detail modal is open
	 */
	static isOpen() {
		return derived(modalStore, ($store) => $store.isOpen);
	}

	/**
	 * Check if the detail modal is open (synchronous)
	 */
	static isOpenSync(): boolean {
		const store = get(modalStore);
		return store.isOpen;
	}

	/**
	 * Open the detail modal with menu item data
	 */
	static open(menuItem: DetailMenuItem): boolean {
		try {
			if (!menuItem) {
				console.warn('Cannot open modal: menu item is required');
				return false;
			}

			this.currentMenuItem = menuItem;
			// Convert DetailMenuItem to ModalItem by adding required id property
			const modalItem = {
				id: menuItem.name.toLowerCase().replace(/\s+/g, '-'), // Generate id from name
				...menuItem
			};
			modalStore.open(modalItem);
			
			console.log(`Detail modal opened for: ${menuItem.name}`);
			return true;
		} catch (err) {
			console.error('Error opening detail modal:', err);
			return false;
		}
	}

	/**
	 * Close the detail modal
	 */
	static close(): void {
		try {
			this.currentMenuItem = null;
			modalStore.close();
			console.log('Detail modal closed');
		} catch (err) {
			console.error('Error closing detail modal:', err);
		}
	}

	/**
	 * Toggle the detail modal
	 */
	static toggle(menuItem?: DetailMenuItem): boolean {
		try {
			if (this.isOpenSync()) {
				this.close();
				return false;
			} else if (menuItem) {
				return this.open(menuItem);
			} else {
				console.warn('Cannot toggle modal: menu item is required when opening');
				return false;
			}
		} catch (err) {
			console.error('Error toggling detail modal:', err);
			return false;
		}
	}

	/**
	 * Get the current modal item
	 */
	static getCurrentItem() {
		return derived(modalStore, ($store) => {
			// Return the current menu item if modal is open, otherwise return the store item
			return $store.isOpen ? (this.currentMenuItem || $store.item) : null;
		});
	}

	/**
	 * Get the current modal item (synchronous)
	 */
	static getCurrentItemSync(): DetailMenuItem | null {
		const store = get(modalStore);
		return store.isOpen ? (this.currentMenuItem || store.item) : null;
	}

	/**
	 * Get the modal ID (useful for external components)
	 */
	static getModalId(): string {
		return this.MODAL_ID;
	}

	/**
	 * Reset modal to initial state
	 */
	static reset(): void {
		try {
			this.currentMenuItem = null;
			modalStore.close();
			console.log('Detail modal reset to initial state');
		} catch (err) {
			console.error('Error resetting detail modal:', err);
		}
	}

	/**
	 * Get modal state snapshot
	 */
	static getState() {
		const store = get(modalStore);
		return {
			isOpen: store.isOpen,
			currentItem: this.currentMenuItem,
			modalId: this.MODAL_ID,
			storeItem: store.item
		};
	}

	/**
	 * Validate modal data integrity
	 */
	static validateModalData(): boolean {
		try {
			const store = get(modalStore);
			
			if (store.isOpen && !this.currentMenuItem && !store.item) {
				console.warn('Modal is open but no item data is available');
				return false;
			}
			
			return true;
		} catch (err) {
			console.error('Error validating modal data:', err);
			return false;
		}
	}

	/**
	 * Handle keyboard navigation for modal
	 */
	static handleKeyboardNavigation(event: KeyboardEvent): boolean {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				this.close();
				return true;
			default:
				return false;
		}
	}
}

export const modalStateInterface = {
	getModalState: DetailModalService.getModalState.bind(DetailModalService),
	isOpen: DetailModalService.isOpen.bind(DetailModalService),
	isOpenSync: DetailModalService.isOpenSync.bind(DetailModalService),
	getCurrentItem: DetailModalService.getCurrentItem.bind(DetailModalService),
	getCurrentItemSync: DetailModalService.getCurrentItemSync.bind(DetailModalService),
	getState: DetailModalService.getState.bind(DetailModalService),
	validate: DetailModalService.validateModalData.bind(DetailModalService)
};

export const modalActionInterface = {
	open: DetailModalService.open.bind(DetailModalService),
	close: DetailModalService.close.bind(DetailModalService),
	toggle: DetailModalService.toggle.bind(DetailModalService),
	reset: DetailModalService.reset.bind(DetailModalService),
	handleKeyboard: DetailModalService.handleKeyboardNavigation.bind(DetailModalService)
};

export const modalUtilInterface = {
	getModalId: DetailModalService.getModalId.bind(DetailModalService)
};

export default DetailModalService;