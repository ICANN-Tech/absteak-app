import type { Writable } from 'svelte/store';

interface ModalManagerOptions {
  onOpen?: () => void;
  onClose?: () => void;
  preventBodyScroll?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  animationDuration?: number;
}

export class ModalManager {
  private isOpen = false;
  private isClosing = false;
  private modalElement: HTMLDialogElement | null = null;
  private options: Required<ModalManagerOptions>;
  private originalBodyOverflow = '';
  private originalBodyPaddingRight = '';

  constructor(options: ModalManagerOptions = {}) {
    this.options = {
      onOpen: () => {},
      onClose: () => {},
      preventBodyScroll: true,
      closeOnEscape: true,
      closeOnBackdrop: true,
      animationDuration: 400,
      ...options
    };
  }

  setModalElement(element: HTMLDialogElement) {
    this.modalElement = element;
  }

  open() {
    if (this.isOpen || this.isClosing || !this.modalElement) return;

    this.isOpen = true;
    this.modalElement.showModal();

    if (this.options.preventBodyScroll) {
      this.disableBodyScroll();
    }

    this.options.onOpen();
  }

  close() {
    if (!this.isOpen || this.isClosing || !this.modalElement) return;

    this.isClosing = true;

    // Wait for animation to complete
    setTimeout(() => {
      if (this.modalElement) {
        this.modalElement.close();
      }
      
      this.isOpen = false;
      this.isClosing = false;

      if (this.options.preventBodyScroll) {
        this.enableBodyScroll();
      }

      this.options.onClose();
    }, this.options.animationDuration);
  }

  private disableBodyScroll() {
    if (typeof document === 'undefined') return;

    // Store original values
    this.originalBodyOverflow = document.body.style.overflow;
    this.originalBodyPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  private enableBodyScroll() {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = this.originalBodyOverflow;
    document.body.style.paddingRight = this.originalBodyPaddingRight;
  }

  handleBackdropClick(event: MouseEvent) {
    if (this.options.closeOnBackdrop && event.target === this.modalElement) {
      this.close();
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.options.closeOnEscape && event.key === 'Escape') {
      this.close();
    }
  }

  getState() {
    return {
      isOpen: this.isOpen,
      isClosing: this.isClosing
    };
  }

  destroy() {
    if (this.options.preventBodyScroll) {
      this.enableBodyScroll();
    }
  }
}

// Factory function untuk membuat modal manager dengan store integration
export function createModalManager(
  store: Writable<any>,
  options: ModalManagerOptions = {}
) {
  const manager = new ModalManager({
    ...options,
    onClose: () => {
      store.update(state => ({ ...state, isOpen: false }));
      options.onClose?.();
    }
  });

  return {
    manager,
    open: (data?: any) => {
      store.update(state => ({ ...state, isOpen: true, ...(data && { item: data }) }));
      manager.open();
    },
    close: () => {
      manager.close();
    }
  };
}