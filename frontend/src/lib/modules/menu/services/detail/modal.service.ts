import { derived } from 'svelte/store';
import { modalStore } from '$lib/stores/modal';
import type { DetailMenuItem, DetailModalData } from '../../types/menu.type';

export class DetailModalService {
	private static readonly MODAL_ID = 'detail-modal';

	/**
	 * Get the modal state for the detail modal
	 */
	static getModalState() {
		return derived(modalStore, ($store) => $store[this.MODAL_ID] || { isOpen: false });
	}

	/**
	 * Check if the detail modal is open
	 */
	static isOpen() {
		return derived(modalStore, ($store) => $store[this.MODAL_ID]?.isOpen || false);
	}

	/**
	 * Open the detail modal with menu item data
	 */
	static open(menuItem: DetailMenuItem) {
		modalStore.open(this.MODAL_ID, {
			item: menuItem,
			title: menuItem.name,
			content: menuItem.desc,
			type: 'menu-item'
		});
	}

	/**
	 * Close the detail modal
	 */
	static close() {
		modalStore.close(this.MODAL_ID);
	}

	/**
	 * Toggle the detail modal
	 */
	static toggle(menuItem?: DetailMenuItem) {
		if (menuItem) {
			modalStore.toggle(this.MODAL_ID, {
				item: menuItem,
				title: menuItem.name,
				content: menuItem.desc,
				type: 'menu-item'
			});
		} else {
			modalStore.toggle(this.MODAL_ID);
		}
	}

	/**
	 * Get the current modal item
	 */
	static getCurrentItem() {
		return derived(modalStore, ($store) => {
			const modalData = $store[this.MODAL_ID];
			return modalData?.item || null;
		});
	}

	/**
	 * Get the modal ID (useful for external components)
	 */
	static getModalId() {
		return this.MODAL_ID;
	}
}