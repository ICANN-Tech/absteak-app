import { writable, derived, type Writable } from 'svelte/store';

export interface CarouselState {
  current: number;
  overlayDark: boolean;
}

// Global store untuk carousel tanpa ID
const globalCarouselState = writable<CarouselState>({
  current: 0,
  overlayDark: false
});

// Map untuk menyimpan store berdasarkan ID
const carouselStores = new Map<string, Writable<CarouselState>>();

export function createCarouselStore(id?: string | null) {
  // Jika tidak ada ID, gunakan global store
  if (!id) {
    return {
      subscribe: globalCarouselState.subscribe,
      setCurrent: (current: number) => {
        globalCarouselState.update(state => ({ ...state, current }));
      },
      setOverlayDark: (overlayDark: boolean) => {
        globalCarouselState.update(state => ({ ...state, overlayDark }));
      },
      getState: () => {
        let currentState: CarouselState;
        globalCarouselState.subscribe(state => currentState = state)();
        return currentState!;
      }
    };
  }

  // Jika ada ID, buat atau ambil store yang sudah ada
  if (!carouselStores.has(id)) {
    carouselStores.set(id, writable<CarouselState>({
      current: 0,
      overlayDark: false
    }));
  }

  const store = carouselStores.get(id)!;

  return {
    subscribe: store.subscribe,
    setCurrent: (current: number) => {
      store.update(state => ({ ...state, current }));
    },
    setOverlayDark: (overlayDark: boolean) => {
      store.update(state => ({ ...state, overlayDark }));
    },
    getState: () => {
      let currentState: CarouselState;
      store.subscribe(state => currentState = state)();
      return currentState!;
    }
  };
}

// Helper untuk mendapatkan current index
export function getCurrentIndex(id?: string | null): number {
  const store = createCarouselStore(id);
  return store.getState().current;
}

// Helper untuk mendapatkan overlay state
export function getOverlayState(id?: string | null): boolean {
  const store = createCarouselStore(id);
  return store.getState().overlayDark;
}

// Helper untuk cleanup store berdasarkan ID
export function cleanupCarouselStore(id: string) {
  carouselStores.delete(id);
}