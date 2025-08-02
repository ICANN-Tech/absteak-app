import { ComponentId } from '$lib/enums';
import { lockVisibility, showComponent, unlockVisibility } from '$lib/stores/viewport/visibility';
import { componentSnapshotUtils } from '$lib/stores/viewport/component';
import { modalStore } from '$lib/stores/modal';
import { writable, type Writable } from 'svelte/store';
import { scrollUtils } from '../viewport';
import type { Config, Module } from "./module";

export interface ModalState {
    show: boolean;
    data?: any;
    type?: string;
    title?: string;
    content?: string;
}

/**
 * Default configuration for modal behavior
 */
const DEFAULT_CONFIG: Required<Config> = {
    onOpen: () => {},
    onClose: () => {},
    preventBodyScroll: true,
    closeOnEscape: true,
    closeOnBackdrop: true,
    animationDuration: 300,
    autoFocus: true,
    restoreFocus: true,
    modalClass: '',
    backdropClass: ''
};

/**
 * Creates a modal module with comprehensive modal management functionality
 * @param initialConfig Initial configuration for the modal
 * @param modalId Unique identifier for the modal instance
 * @returns Module instance with all modal management methods
 */
export function createModalModule(initialConfig: Partial<Config> = {}, modalId: string = 'default'): Module {
    let modalElement: HTMLDialogElement | HTMLDivElement | null = null;
    let isOpen = false;
    let isClosing = false;
    let config: Required<Config> = { ...DEFAULT_CONFIG, ...initialConfig };
    let focusedElementBeforeOpen: Element | null = null;

    // Create writable store for modal state (similar to media manager)
    const modalState: Writable<ModalState> = writable({
        show: false,
        data: null,
        type: '',
        title: '',
        content: ''
    });

    /**
     * Locks modal and hides all components using snapshot system
     */
    const lockModal = (): void => {
        if (typeof document === 'undefined') return;

        console.log('🔒 lockModal called for modalId:', modalId);

        // Use scrollUtils to disable scrolling only if preventBodyScroll is enabled
        if (config.preventBodyScroll) {
            scrollUtils.disable();
        }

        // Always capture current component states and hide all components
        console.log('📸 Calling hideAllForModal...');
        const result = componentSnapshotUtils.hideAllForModal(modalId);
        console.log('📸 hideAllForModal result:', result);

        console.log('🔒 lockModal completed');
    };

    /**
     * Get all available components
     */
    const getAllComponents = (): ComponentId[] => {
        return [
            ComponentId.Navigation,
            ComponentId.Schedule,
            ComponentId.Highlight,
            ComponentId.LanguageSwitch,
            ComponentId.VideoPromotion,
            ComponentId.ChatBot,
            ComponentId.Operation
        ];
    };

    /**
     * Unlocks modal and restores component visibility using snapshot system
     */
    const unlockModal = (): void => {
        console.info("Component id, restore", ComponentId.LanguageSwitch)
        if (typeof document === 'undefined') return;

        console.log('🔓 unlockModal called for modalId:', modalId);

        // Use scrollUtils to enable scrolling
        scrollUtils.enable();

        // Unlock components visibility first with explicit true value to ensure they become visible
        const allComponents = getAllComponents();
        unlockVisibility(allComponents, true);

        // Restore components using snapshot system (this will handle unlock automatically)
        console.log('🔄 Calling restoreForModal...');
        const restoreResult = componentSnapshotUtils.restoreForModal(modalId);
        console.log('🔄 restoreForModal result:', restoreResult);

        // Clean up snapshot after restoration
        console.log('🧹 Calling cleanupForModal...');
        const cleanupResult = componentSnapshotUtils.cleanupForModal(modalId);
        console.log('🧹 cleanupForModal result:', cleanupResult);
        console.log('🔓 unlockModal completed');
    };

    /**
     * Manages focus for accessibility
     */
    const manageFocus = (shouldFocus: boolean): void => {
        if (typeof document === 'undefined') return;

        if (shouldFocus && config.autoFocus && modalElement) {
            focusedElementBeforeOpen = document.activeElement;
            modalElement.focus();
        } else if (!shouldFocus && config.restoreFocus && focusedElementBeforeOpen) {
            (focusedElementBeforeOpen as HTMLElement).focus();
            focusedElementBeforeOpen = null;
        }
    };

    /**
     * Handles visibility state changes with smooth transitions
     */
    const handleVisibilityChange = (shouldShow: boolean, callbacks?: { onOpen?: () => void; onClose?: () => void }): void => {
        if (shouldShow && !isOpen) {
            isOpen = true;
            callbacks?.onOpen?.();
        } else if (!shouldShow && isOpen) {
            // Delay state change to allow exit animation
            setTimeout(() => {
                isOpen = false;
            }, config.animationDuration);
            callbacks?.onClose?.();
        }
    };

    /**
     * Handles focus management for modal intro
     */
    const handleModalIntro = (element: HTMLElement | null): void => {
        if (!element || !config.autoFocus) return;
        
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
        }
    };

    /**
     * Enhanced backdrop click handler with callback support
     */
    const handleBackdropClickWithCallback = (event: KeyboardEvent | MouseEvent, callback?: () => void): void => {
        if (config.closeOnBackdrop && event.target === event.currentTarget && isOpen && !isClosing) {
            closeModal();
            callback?.();
        }
    };

    /**
     * Simple backdrop click handler for component integration
     */
    const handleBackdropClick = (event: MouseEvent): void => {
        console.log('🖱️ handleBackdropClick called:', {
            closeOnBackdrop: config.closeOnBackdrop,
            isTargetCurrentTarget: event.target === event.currentTarget,
            isOpen,
            isClosing,
            target: event.target,
            currentTarget: event.currentTarget
        });
        
        if (config.closeOnBackdrop && event.target === event.currentTarget && isOpen && !isClosing) {
            console.log('✅ Backdrop click conditions met, closing modal');
            closeModal();
        } else {
            console.log('❌ Backdrop click conditions not met');
        }
    };

    /**
     * Enhanced escape key handler with callback support
     */
    const handleEscapeKeyWithCallback = (event: KeyboardEvent, callback?: () => void): void => {
        if (config.closeOnEscape && event.key === 'Escape' && isOpen && !isClosing) {
            closeModal();
            callback?.();
        }
    };
    const handleOpen = (data?: any, options?: { type?: string; title?: string; content?: string }): void => {
        if (isOpen || isClosing) return;

        // Store component states and lock modal BEFORE opening
        lockModal();

        // Use the centralized modal store
        modalStore.open(modalId, {
            item: data?.item || null,
            title: options?.title || data?.title || '',
            content: options?.content || data?.content || '',
            type: options?.type || data?.type || '',
            data: data || null
        });

        // Update local modal state
        modalState.update(state => ({
            ...state,
            show: true,
            data: data || null,
            type: options?.type || '',
            title: options?.title || '',
            content: options?.content || ''
        }));

        isOpen = true;
        manageFocus(true);
        config.onOpen();
    };

    /**
     * Handles closing the modal using the centralized store
     */
    const handleClose = (): void => {
        if (!isOpen || isClosing) return;

        isClosing = true;

        // Use the centralized modal store
        modalStore.close(modalId);

        // Update local modal state
        modalState.update(state => ({
            ...state,
            show: false
        }));

        // Wait for animation to complete before actual cleanup
        setTimeout(() => {
            isOpen = false;
            isClosing = false;
            manageFocus(false);
            
            // Unlock modal and restore components AFTER animation
            unlockModal();
            
            config.onClose();
        }, config.animationDuration);
    };

    /**
     * Closes the modal (alias for handleClose for component compatibility)
     */
    const closeModal = (): void => {
        handleClose();
    };

    const module: Module = {
        setModalElement: (element: HTMLDialogElement | HTMLDivElement): void => {
            modalElement = element;
            
            // Apply custom classes if provided
            if (config.modalClass) {
                element.classList.add(...config.modalClass.split(' '));
            }
        },

        // Updated methods to use centralized store
        openModal: (data?: any, options?: { type?: string; title?: string; content?: string }): void => {
            handleOpen(data, options);
        },

        closeModal: (): void => {
            handleClose();
        },

        // Additional methods for component compatibility
        handleOpen: (data?: any, options?: { type?: string; title?: string; content?: string }): void => {
            handleOpen(data, options);
        },

        handleClose: (): void => {
            handleClose();
        },

        // Additional media manager-like methods
        toggleModal: (): void => {
            if (isOpen) {
                closeModal();
            } else {
                handleOpen();
            }
        },

        lockModal: (): void => {
            lockModal();
        },

        unlockModal: (): void => {
            unlockModal();
        },

        toggleLock: (): void => {
            // Implementation for toggle lock functionality
            // This would need to track current lock state
            if (isOpen) {
                unlockModal();
            } else {
                lockModal();
            }
        },

        // Store access method (similar to media manager)
        getModalState: () => modalState,

        // Get centralized store state for this modal
        getCentralizedState: () => modalStore.getModal(modalId),

        // Check if this modal is open in centralized store
        isModalOpenInStore: () => modalStore.isOpen(modalId),

        isModalOpen: (): boolean => isOpen,

        isModalClosing: (): boolean => isClosing,

        setConfig: (newConfig: Partial<Config>): void => {
            config = { ...config, ...newConfig };
        },

        getConfig: (): Config => ({ ...config }),

        getModalElement: (): HTMLDialogElement | HTMLDivElement | null => modalElement,

        // Method to sync modal state from component
        setModalOpen: (open: boolean): void => {
            isOpen = open;
            if (open) {
                lockModal();
            } else {
                unlockModal();
            }
        },

        // Event handlers with callback support
        handleBackdropClickWithCallback,
        handleBackdropClick,
        handleEscapeKeyWithCallback,
        handleVisibilityChange,
        handleModalIntro,

        handleKeydown: (event: KeyboardEvent): void => {
            if (config.closeOnEscape && event.key === 'Escape' && isOpen && !isClosing) {
                closeModal();
            }
        },

        handleKeyUp: (event: KeyboardEvent): void => {
            // Handle keyup events if needed
        },

        handleCancel: (event: Event): void => {
            // Prevent the native dialog cancel behavior
            event.preventDefault();
            if (config.closeOnEscape && isOpen && !isClosing) {
                closeModal();
            }
        },

        handleAnimationEnd: (): void => {
            // Handle animation end logic
            // Can be used for state management after animations complete
        },

        handleAnimationStart: (): void => {
            // Handle animation start logic
        },

        handleAnimationIteration: (): void => {
            // Handle animation iteration for looping animations
        },

        handleAnimationCancel: (): void => {
            // Handle animation cancellation
            if (isClosing) {
                isClosing = false;
            }
        },

        handleAnimationPause: (): void => {
            // Handle animation pause
        },

        handleAnimationResume: (): void => {
            // Handle animation resume
        },

        handleAnimationFill: (): void => {
            // Handle animation fill
        },

        destroy: (): void => {
            if (isOpen) {
                unlockModal();
                manageFocus(false);
            }
            
            modalElement = null;
            isOpen = false;
            isClosing = false;
            focusedElementBeforeOpen = null;
        },

        reset: (): void => {
            if (isOpen) {
                closeModal();
            }
            
            config = { ...DEFAULT_CONFIG, ...initialConfig };
        },

        getState: () => ({
            isOpen,
            isClosing,
            hasElement: modalElement !== null
        })
    };

    return module;
}

/**
 * Manager module interface for modal management (similar to media manager)
 */
export interface ManagerModule {
    /** Modal module instance */
    modal: Module;
    
    /** Creates a new modal manager with configuration */
    createModalManager: (options?: Partial<Config>, modalId?: string) => Module;
}

/**
 * Creates a modal manager with default configuration (similar to media manager)
 * @param options Optional configuration overrides
 * @param modalId Optional modal ID for centralized state management
 * @returns Module instance for modal management
 */
export function createModalManager(options: Partial<Config> = {}, modalId: string = 'default'): Module {
    return createModalModule(options, modalId);
}

/**
 * Main modal manager instance with utilities (similar to media manager)
 */
export const modalManager: ManagerModule = {
    modal: createModalModule(),
    createModalManager
};

// Export individual modules for direct access (similar to media manager)
export const modalModule = createModalModule();

// Export utility functions for convenience (similar to media manager)
export const modalUtils = {
    createModalManager,
    createModalModule,
    lockModal: () => modalManager.modal.lockModal(),
    unlockModal: () => modalManager.modal.unlockModal(),
    openModal: (data?: any, options?: { type?: string; title?: string; content?: string }) => 
        modalManager.modal.openModal(data, options),
    closeModal: () => modalManager.modal.closeModal(),
    toggleModal: () => modalManager.modal.toggleModal(),
    isModalOpen: () => modalManager.modal.isModalOpen(),
    getModalState: () => modalManager.modal.getModalState(),
    handleBackdropClick: (event: MouseEvent) => modalManager.modal.handleBackdropClick(event)
};