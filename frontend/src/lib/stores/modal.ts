import { writable, derived } from 'svelte/store';
import { viewportStore } from './viewport.js';
import { getVisibilityStore, createVisibilityToggle, lockVisibility, unlockVisibility } from './visibility.js';

export interface ModalItem {
	name: string;
	desc: string;
	price: string;
	img: string;
	category?: string;
	ingredients?: string[];
	allergens?: string[];
	nutritionInfo?: {
		calories: number;
		protein: string;
		carbs: string;
		fat: string;
	};
}

export interface ModalData {
	isOpen: boolean;
	item?: ModalItem | null;
	title?: string;
	content?: string;
	type?: string;
	data?: any;
}

export interface ModalStoreState {
	[modalId: string]: ModalData;
}

function createModalStore() {
	const { subscribe, set, update } = writable<ModalStoreState>({});

	// Get header visibility store and toggle function
	const headerVisibility = getVisibilityStore('header');
	const toggleHeaderVisibility = createVisibilityToggle('header');

	return {
		subscribe,
		
		// Open modal by ID
		open: (modalId: string, data?: {
			item?: ModalItem;
			title?: string;
			content?: string;
			type?: string;
			data?: any;
		}) => {
			update(state => {
				// Check if any modal is currently open
				const hasOpenModal = Object.values(state).some(modal => modal.isOpen);
				
				// Only manage viewport/visibility if this is the first modal opening
				if (!hasOpenModal) {
					// Disable scroll when modal opens
					viewportStore.disableScroll();
					// Lock all visibility to false when modal opens
					lockVisibility();
				}

				return {
					...state,
					[modalId]: {
						isOpen: true,
						item: data?.item || null,
						title: data?.title || '',
						content: data?.content || '',
						type: data?.type || '',
						data: data?.data || null
					}
				};
			});
		},

		// Close modal by ID
		close: (modalId: string) => {
			update(state => {
				const newState = {
					...state,
					[modalId]: {
						...state[modalId],
						isOpen: false
					}
				};

				// Check if any modal is still open after closing this one
				const hasOpenModal = Object.values(newState).some(modal => modal.isOpen);
				
				// Only manage viewport/visibility if this is the last modal closing
				if (!hasOpenModal) {
					// Enable scroll when modal closes
					viewportStore.enableScroll();
					// Unlock all visibility when modal closes
					unlockVisibility();
					// Show header when modal closes (set to true)
					headerVisibility.set(true);
				}

				return newState;
			});
		},

		// Toggle modal by ID
		toggle: (modalId: string, data?: {
			item?: ModalItem;
			title?: string;
			content?: string;
			type?: string;
			data?: any;
		}) => {
			update(state => {
				const currentModal = state[modalId];
				const isCurrentlyOpen = currentModal?.isOpen || false;
				
				if (isCurrentlyOpen) {
					// Close the modal
					const newState = {
						...state,
						[modalId]: {
							...currentModal,
							isOpen: false
						}
					};

					// Check if any modal is still open
					const hasOpenModal = Object.values(newState).some(modal => modal.isOpen);
					
					if (!hasOpenModal) {
						viewportStore.enableScroll();
						unlockVisibility();
						headerVisibility.set(true);
					}

					return newState;
				} else {
					// Open the modal
					const hasOpenModal = Object.values(state).some(modal => modal.isOpen);
					
					if (!hasOpenModal) {
						viewportStore.disableScroll();
						lockVisibility();
					}

					return {
						...state,
						[modalId]: {
							isOpen: true,
							item: data?.item || null,
							title: data?.title || '',
							content: data?.content || '',
							type: data?.type || '',
							data: data?.data || null
						}
					};
				}
			});
		},

		// Get specific modal state
		getModal: (modalId: string) => {
			return derived(
				{ subscribe },
				($state) => $state[modalId] || { isOpen: false, item: null, title: '', content: '', type: '', data: null }
			);
		},

		// Check if modal is open
		isOpen: (modalId: string) => {
			return derived(
				{ subscribe },
				($state) => $state[modalId]?.isOpen || false
			);
		},

		// Clear all modals
		clearAll: () => {
			set({});
			viewportStore.enableScroll();
			unlockVisibility();
			headerVisibility.set(true);
		},

		// Expose the toggle function for header visibility
		toggleHeaderVisibility
	};
}

export const modalStore = createModalStore();