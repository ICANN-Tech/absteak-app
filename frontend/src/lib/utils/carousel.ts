import { createCarouselStore, type CarouselState } from '$lib/stores/carousel';

export interface CarouselCallbacks {
  onCurrentChange?: (index: number) => void;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export function createCarousel(images: { url: string }[], interval = 6000, id?: string | null) {
  let timer: ReturnType<typeof setInterval>;
  let callbacks: CarouselCallbacks = {};
  
  // Buat store berdasarkan ID
  const store = createCarouselStore(id);

  function start(callbacksParam: CarouselCallbacks = {}) {
    callbacks = callbacksParam;
    
    timer = setInterval(() => {
      const currentState = store.getState();
      const nextIndex = (currentState.current + 1) % images.length;
      store.setCurrent(nextIndex);
      callbacks.onCurrentChange?.(nextIndex);
    }, interval);

    // Initial call
    const initialState = store.getState();
    callbacks.onCurrentChange?.(initialState.current);
  }

  function stop() {
    clearInterval(timer);
  }

  function handleTransitionStart() {
    store.setOverlayDark(true);
    callbacks.onTransitionStart?.();
  }

  function handleTransitionEnd() {
    store.setOverlayDark(false);
    callbacks.onTransitionEnd?.();
  }

  function getState(): CarouselState {
    return store.getState();
  }

  function getCurrentIndex(): number {
    return store.getState().current;
  }

  function getOverlayState(): boolean {
    return store.getState().overlayDark;
  }

  function getStore() {
    return store;
  }

  return { 
    start, 
    stop, 
    handleTransitionStart, 
    handleTransitionEnd, 
    getState,
    getCurrentIndex,
    getOverlayState,
    getStore
  };
}
