import type { Writable } from 'svelte/store';

interface AutoHideModalOptions {
  onChange: (visible: boolean) => void;
  threshold?: number;
  delay?: number;
  disabled?: () => boolean;
  modalStore?: Writable<any>; // Modal store untuk auto hide saat modal terbuka
  pauseOnModal?: boolean; // Pause auto hide saat modal terbuka
}

/**
 * Enhanced auto hide dengan modal integration
 */
export function autoHideWithModal(node: HTMLElement, initialOptions: AutoHideModalOptions) {
  let {
    onChange,
    delay = 2000,
    threshold = 3000,
    disabled = () => false,
    modalStore,
    pauseOnModal = true
  } = initialOptions;

  let lastScrollY = window.scrollY;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let isCurrentlyVisible = true;
  let isModalOpen = false;

  // Subscribe to modal store if provided
  let unsubscribeModal: (() => void) | null = null;
  if (modalStore && pauseOnModal) {
    unsubscribeModal = modalStore.subscribe((state: any) => {
      const wasModalOpen = isModalOpen;
      isModalOpen = state.isOpen || false;
      
      // Jika modal baru saja dibuka, hide component immediately
      if (!wasModalOpen && isModalOpen) {
        clearTimer();
        isCurrentlyVisible = false;
        onChange(false);
      }
      // Jika modal baru saja ditutup, show component dan start timer
      else if (wasModalOpen && !isModalOpen) {
        showComponent();
      }
    });
  }

  function clearTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function startHideTimer() {
    clearTimer();
    // Jangan start timer jika modal terbuka atau disabled
    if (!disabled() && !(pauseOnModal && isModalOpen)) {
      idleTimer = setTimeout(() => {
        isCurrentlyVisible = false;
        onChange(false);
      }, delay);
    }
  }

  function showComponent() {
    // Jangan show jika disabled atau modal terbuka (dan pauseOnModal aktif)
    if (disabled() || (pauseOnModal && isModalOpen)) return;
    
    clearTimer();
    isCurrentlyVisible = true;
    onChange(true);
    startHideTimer();
  }

  function handleMouseMove(e: MouseEvent) {
    // Jangan respond jika modal terbuka
    if (pauseOnModal && isModalOpen) return;
    
    showComponent();
  }

  function handleScroll() {
    // Jangan respond jika modal terbuka
    if (pauseOnModal && isModalOpen) return;
    if (disabled()) return;

    const currentScroll = window.scrollY;

    if (currentScroll < threshold) {
      showComponent();
    } else {
      const scrollingUp = currentScroll < lastScrollY;
      if (scrollingUp) {
        showComponent();
      } else {
        clearTimer();
        onChange(false);
      }
    }

    lastScrollY = currentScroll;
  }

  // Setup event listeners
  const mouseHandler = (e: MouseEvent) => handleMouseMove(e);
  
  window.addEventListener('mousemove', mouseHandler, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('mouseenter', showComponent, { passive: true });
  document.addEventListener('mouseover', showComponent, { passive: true });
  
  // Set initial visibility (kecuali jika modal sudah terbuka)
  if (!(pauseOnModal && isModalOpen)) {
    onChange(true);
    startHideTimer();
  }

  return {
    destroy() {
      window.removeEventListener('mousemove', mouseHandler);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseenter', showComponent);
      document.removeEventListener('mouseover', showComponent);
      clearTimer();
      
      // Unsubscribe from modal store
      if (unsubscribeModal) {
        unsubscribeModal();
      }
    },

    update(newOptions: AutoHideModalOptions) {
      // Update options
      onChange = newOptions.onChange;
      delay = newOptions.delay ?? delay;
      threshold = newOptions.threshold ?? threshold;
      disabled = newOptions.disabled ?? disabled;
      pauseOnModal = newOptions.pauseOnModal ?? pauseOnModal;

      // Update modal store subscription
      if (newOptions.modalStore !== modalStore) {
        if (unsubscribeModal) {
          unsubscribeModal();
          unsubscribeModal = null;
        }
        
        modalStore = newOptions.modalStore;
        if (modalStore && pauseOnModal) {
          unsubscribeModal = modalStore.subscribe((state: any) => {
            const wasModalOpen = isModalOpen;
            isModalOpen = state.isOpen || false;
            
            if (!wasModalOpen && isModalOpen) {
              clearTimer();
              isCurrentlyVisible = false;
              onChange(false);
            } else if (wasModalOpen && !isModalOpen) {
              showComponent();
            }
          });
        }
      }

      // Restart with new settings
      clearTimer();
      if (!(pauseOnModal && isModalOpen)) {
        startHideTimer();
      }
    }
  };
}

// Backward compatibility - export original autoHide
export { autoHide } from './autoHide';