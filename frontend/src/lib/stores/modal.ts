import { writable } from 'svelte/store';
import { viewportStore } from './viewport.js';
import { getVisibilityStore, createVisibilityToggle, lockVisibility, unlockVisibility } from './visibility.js';

export interface ModalItem {
	name: string;
	desc: string;
	price: string;
	img: string;
}

export interface ModalState {
	isOpen: boolean;
	item: ModalItem | null;
}

function createModalStore() {
	const { subscribe, set, update } = writable<ModalState>({
		isOpen: false,
		item: null
	});

	// Get header visibility store and toggle function
	const headerVisibility = getVisibilityStore('header');
	const toggleHeaderVisibility = createVisibilityToggle('header');

	return {
		subscribe,
		open: (item: ModalItem) => {
			// Disable scroll when modal opens
			viewportStore.disableScroll();
			// Lock all visibility to false when modal opens
			lockVisibility();
			set({ isOpen: true, item });
		},
		close: () => {
			// Enable scroll when modal closes
			viewportStore.enableScroll();
			// Unlock all visibility when modal closes
			unlockVisibility();
			// Show header when modal closes (set to true)
			headerVisibility.set(true);
			set({ isOpen: false, item: null });
		},
		toggle: () => update(state => {
			const newIsOpen = !state.isOpen;
			// Toggle scroll based on modal state
			if (newIsOpen) {
				viewportStore.disableScroll();
				// Lock all visibility to false when modal opens
				lockVisibility();
			} else {
				viewportStore.enableScroll();
				// Unlock all visibility when modal closes
				unlockVisibility();
				// Show header when modal closes (set to true)
				headerVisibility.set(true);
			}
			return { ...state, isOpen: newIsOpen };
		}),
		// Expose the toggle function for header visibility
		toggleHeaderVisibility
	};
}

export const modalStore = createModalStore();