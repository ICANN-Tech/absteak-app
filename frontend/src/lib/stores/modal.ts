import { writable, derived } from 'svelte/store';

export interface ModalItem {
  id: string;
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

export interface ModalState {
  isOpen: boolean;
  item: ModalItem | null;
  size: 'sm' | 'md' | 'lg' | 'xl';
  preventBodyScroll: boolean;
  closeOnEscape: boolean;
  closeOnBackdrop: boolean;
  animationDuration: number;
}

const initialState: ModalState = {
  isOpen: false,
  item: null,
  size: 'md',
  preventBodyScroll: true,
  closeOnEscape: true,
  closeOnBackdrop: true,
  animationDuration: 400
};

// Create the main modal store
function createModalStore() {
  const { subscribe, set, update } = writable<ModalState>(initialState);

  return {
    subscribe,
    
    // Open modal with item
    open: (item: ModalItem, options?: Partial<ModalState>) => {
      update(state => ({
        ...state,
        isOpen: true,
        item,
        ...options
      }));
    },

    // Close modal
    close: () => {
      update(state => ({
        ...state,
        isOpen: false
      }));
    },

    // Update modal settings
    updateSettings: (settings: Partial<ModalState>) => {
      update(state => ({
        ...state,
        ...settings
      }));
    },

    // Reset to initial state
    reset: () => set(initialState),

    // Set size
    setSize: (size: ModalState['size']) => {
      update(state => ({ ...state, size }));
    }
  };
}

export const modalStore = createModalStore();

// Derived stores for specific properties
export const isModalOpen = derived(modalStore, $modal => $modal.isOpen);
export const currentModalItem = derived(modalStore, $modal => $modal.item);
export const modalSize = derived(modalStore, $modal => $modal.size);

// Multiple modal instances support
const modalInstances = new Map<string, ReturnType<typeof createModalStore>>();

export function getModalStore(id: string = 'default') {
  if (!modalInstances.has(id)) {
    modalInstances.set(id, createModalStore());
  }
  return modalInstances.get(id)!;
}

// Video modal state tracking - separate from main modal
const videoModalStates = new Map<string, boolean>();
let videoModalActiveState = false;

export function openVideoModal(modalId: string) {
  videoModalStates.set(modalId, true);
  videoModalActiveState = true;
  modalStore.updateSettings({ isOpen: true });
}

export function closeVideoModal(modalId: string) {
  videoModalStates.set(modalId, false);
  // Check if any video modal is still open
  const anyVideoModalOpen = Array.from(videoModalStates.values()).some(isOpen => isOpen);
  if (!anyVideoModalOpen) {
    videoModalActiveState = false;
    modalStore.close();
  }
}

export function isVideoModalOpen(modalId: string) {
  return videoModalStates.get(modalId) || false;
}

export function isVideoModalActive() {
  return videoModalActiveState;
}

// Helper functions
export function openModal(item: ModalItem, options?: Partial<ModalState>) {
  modalStore.open(item, options);
}

export function closeModal() {
  modalStore.close();
}

export function openModalById(id: string, item: ModalItem, options?: Partial<ModalState>) {
  const store = getModalStore(id);
  store.open(item, options);
}

export function closeModalById(id: string) {
  const store = getModalStore(id);
  store.close();
}