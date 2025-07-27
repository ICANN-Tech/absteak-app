import type { Writable } from 'svelte/store';

interface AutoHideOptions {
  onChange: (visible: boolean) => void;
  threshold?: number;
  delay?: number;
  disabled?: () => boolean;
}

/**
 * Helper for reactive visibility state with mouse/scroll trigger.
 */
export function autoHide(node: HTMLElement, initialOptions: AutoHideOptions) {
  let {
    onChange,
    delay = 2000,
    threshold = 3000,
    disabled = () => false,
  } = initialOptions;

  let lastScrollY = window.scrollY;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let isCurrentlyVisible = true;

  function clearTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function startHideTimer() {
    clearTimer();
    if (!disabled()) {
      idleTimer = setTimeout(() => {
        isCurrentlyVisible = false;
        onChange(false);
      }, delay);
    }
  }

  function showComponent() {
    if (disabled()) return;
    
    // Clear any existing timer first
    clearTimer();
    
    // Always show component immediately
    isCurrentlyVisible = true;
    onChange(true);
    
    // Start new hide timer
    startHideTimer();
  }

  function handleMouseMove(e: MouseEvent) {
    if (disabled()) return;
    
    // Always show component on any mouse movement, regardless of current state
    showComponent();
  }

  function handleScroll() {
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

  // Setup with more frequent event checking
  const mouseHandler = (e: MouseEvent) => handleMouseMove(e);
  
  window.addEventListener('mousemove', mouseHandler, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Also listen to mouse enter/leave events for better detection
  document.addEventListener('mouseenter', showComponent, { passive: true });
  document.addEventListener('mouseover', showComponent, { passive: true });
  
  // Set initial visibility
  onChange(true);
  startHideTimer();

  return {
    destroy() {
      window.removeEventListener('mousemove', mouseHandler);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseenter', showComponent);
      document.removeEventListener('mouseover', showComponent);
      clearTimer();
    },

    update(newOptions: AutoHideOptions) {
      // Replace options dynamically
      onChange = newOptions.onChange;
      delay = newOptions.delay ?? delay;
      threshold = newOptions.threshold ?? threshold;
      disabled = newOptions.disabled ?? disabled;

      // Restart with new settings
      clearTimer();
      startHideTimer();
    }
  };
}