import { writable, derived, type Readable } from 'svelte/store';
import type { Section } from '$lib/types';

export interface ViewportState {
  currentSectionIndex: number;
  isTransitioning: boolean;
  scrollEnabled: boolean;
  sections: Section[];
  lastScrollTime: number;
  scrollDelay: number;
}

export interface ViewportStore extends Readable<ViewportState> {
  setCurrentSection: (index: number) => void;
  setTransitioning: (isTransitioning: boolean) => void;
  enableScroll: () => void;
  disableScroll: () => void;
  toggleScroll: () => void;
  setSections: (sections: Section[]) => void;
  updateLastScrollTime: () => void;
  setScrollDelay: (delay: number) => void;
  canScroll: () => boolean;
}

function createViewportStore(): ViewportStore {
  const initialState: ViewportState = {
    currentSectionIndex: 0,
    isTransitioning: false,
    scrollEnabled: true,
    sections: [],
    lastScrollTime: 0,
    scrollDelay: 800
  };

  const { subscribe, update } = writable<ViewportState>(initialState);

  return {
    subscribe,
    
    setCurrentSection: (index: number) => {
      update(state => ({
        ...state,
        currentSectionIndex: Math.max(0, Math.min(index, state.sections.length - 1))
      }));
    },

    setTransitioning: (isTransitioning: boolean) => {
      update(state => ({
        ...state,
        isTransitioning
      }));
    },

    enableScroll: () => {
      update(state => ({
        ...state,
        scrollEnabled: true
      }));
    },

    disableScroll: () => {
      update(state => ({
        ...state,
        scrollEnabled: false
      }));
    },

    toggleScroll: () => {
      update(state => ({
        ...state,
        scrollEnabled: !state.scrollEnabled
      }));
    },

    setSections: (sections: Section[]) => {
      update(state => ({
        ...state,
        sections,
        currentSectionIndex: Math.min(state.currentSectionIndex, sections.length - 1)
      }));
    },

    updateLastScrollTime: () => {
      update(state => ({
        ...state,
        lastScrollTime: Date.now()
      }));
    },

    setScrollDelay: (delay: number) => {
      update(state => ({
        ...state,
        scrollDelay: delay
      }));
    },

    canScroll: () => {
      let canScroll = false;
      update(state => {
        const now = Date.now();
        canScroll = state.scrollEnabled && 
                   !state.isTransitioning && 
                   (now - state.lastScrollTime) >= state.scrollDelay;
        return state;
      });
      return canScroll;
    }
  };
}

export const viewportStore = createViewportStore();

// Derived stores untuk kemudahan akses
export const currentSectionIndex = derived(viewportStore, $viewport => $viewport.currentSectionIndex);
export const isTransitioning = derived(viewportStore, $viewport => $viewport.isTransitioning);
export const scrollEnabled = derived(viewportStore, $viewport => $viewport.scrollEnabled);
export const sections = derived(viewportStore, $viewport => $viewport.sections);