import { derived } from 'svelte/store';
import { modalStore } from '../../../../stores/modal';
import type { DetailMenuItem, DetailModalData } from '../../types/menu.type';

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
	 * Open the detail modal with menu item data
	 */
	static open(menuItem: DetailMenuItem) {
		this.currentMenuItem = menuItem;
		// Convert DetailMenuItem to ModalItem by adding required id property
		const modalItem = {
			id: menuItem.name.toLowerCase().replace(/\s+/g, '-'), // Generate id from name
			...menuItem
		};
		modalStore.open(modalItem);
	}

	/**
	 * Close the detail modal
	 */
	static close() {
		this.currentMenuItem = null;
		modalStore.close();
	}

	/**
   * Toggle the detail modal
   */
  static toggle(menuItem?: DetailMenuItem) {
    if (menuItem) {
      this.currentMenuItem = menuItem;
      // Convert DetailMenuItem to ModalItem by adding required id property
      const modalItem = {
        id: menuItem.name.toLowerCase().replace(/\s+/g, '-'), // Generate id from name
        ...menuItem
      };
      modalStore.open(modalItem);
    } else {
      this.close();
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
	 * Get the modal ID (useful for external components)
	 */
	static getModalId() {
		return this.MODAL_ID;
	}
}