import { writable } from 'svelte/store';

/**
 * Interface for modal item data
 */
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

/**
 * Interface for modal data state
 */
export interface ModalDataState {
    item: ModalItem | null;
    type?: string;
    title?: string;
    content?: string;
}

/**
 * Creates a modal data store for managing modal content (similar to media manager's overlay state)
 * @returns Modal data store with methods to set and clear data
 */
function createModalDataStore() {
    const { subscribe, set, update } = writable<ModalDataState>({
        item: null,
        type: '',
        title: '',
        content: ''
    });

    return {
        subscribe,
        
        /**
         * Sets the modal item data (similar to media manager's openVideo)
         * @param item The item to display in the modal
         * @param options Optional configuration for modal content
         */
        setItem: (item: ModalItem, options?: { type?: string; title?: string; content?: string }): void => {
            set({ 
                item,
                type: options?.type || '',
                title: options?.title || '',
                content: options?.content || ''
            });
        },
        
        /**
         * Clears the modal item data (similar to media manager's closeVideo)
         */
        clearItem: (): void => {
            set({ 
                item: null,
                type: '',
                title: '',
                content: ''
            });
        },
        
        /**
         * Updates modal data without replacing the entire state
         * @param updates Partial updates to apply
         */
        updateData: (updates: Partial<ModalDataState>): void => {
            update(state => ({
                ...state,
                ...updates
            }));
        },
        
        /**
         * Gets the current modal item
         * @returns Current modal item or null
         */
        getItem: (): ModalItem | null => {
            let currentItem: ModalItem | null = null;
            update(state => {
                currentItem = state.item;
                return state;
            });
            return currentItem;
        },

        /**
         * Gets the current modal state
         * @returns Current modal data state
         */
        getState: (): ModalDataState => {
            let currentState: ModalDataState = { item: null };
            update(state => {
                currentState = { ...state };
                return state;
            });
            return currentState;
        }
    };
}

/**
 * Global modal data store instance (similar to media manager's overlay state)
 */
export const modalDataStore = createModalDataStore();