import { writable } from 'svelte/store';

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: any;
}

const initialState: ModalState = {
  isOpen: false,
  type: undefined,
  data: undefined
};

function createModalStore() {
  const { subscribe, set, update } = writable<ModalState>(initialState);

  return {
    subscribe,
    
    open: (type?: string, data?: any) => {
      set({ isOpen: true, type, data });
    },
    
    close: () => {
      set(initialState);
    },
    
    toggle: () => {
      update(state => ({ ...state, isOpen: !state.isOpen }));
    }
  };
}

export const modalStore = createModalStore();

// Video modal specific functions
export const openVideoModal = (videoUrl: string, options?: any) => {
  modalStore.open('video', { videoUrl, ...options });
};

export const closeVideoModal = () => {
  modalStore.close();
};

export const isVideoModalOpen = (state: ModalState) => {
  return state.isOpen && state.type === 'video';
};