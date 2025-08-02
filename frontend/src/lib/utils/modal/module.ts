/**
 * Configuration interface for modal behavior and callbacks
 */
export interface Config {
    /** Callback function triggered when modal opens */
    onOpen?: () => void;
    
    /** Callback function triggered when modal closes */
    onClose?: () => void;
    
    /** Whether to prevent body scrolling when modal is open */
    preventBodyScroll?: boolean;
    
    /** Whether to close modal when Escape key is pressed */
    closeOnEscape?: boolean;
    
    /** Whether to close modal when backdrop/overlay is clicked */
    closeOnBackdrop?: boolean;
    
    /** Duration of modal animations in milliseconds */
    animationDuration?: number;
    
    /** Whether to auto-focus the modal when opened */
    autoFocus?: boolean;
    
    /** Whether to restore focus to trigger element when closed */
    restoreFocus?: boolean;
    
    /** Custom CSS class for modal container */
    modalClass?: string;
    
    /** Custom CSS class for modal backdrop */
    backdropClass?: string;
}

/**
 * Modal module interface defining all modal management functionality
 */
export interface Module {
    /**
     * Sets the modal element reference for the manager
     * @param element The HTML dialog or div element to be managed
     */
    setModalElement: (element: HTMLDialogElement | HTMLDivElement) => void;

    /**
     * Opens the modal with proper animations and state management
     * @param data Optional data to pass to the modal
     * @param options Optional configuration for modal content
     */
    openModal: (data?: any, options?: { type?: string; title?: string; content?: string }) => void;

    /**
     * Closes the modal with proper cleanup and animations
     */
    closeModal: () => void;

    /**
     * Handles opening the modal using centralized state management
     * @param data Optional data to pass to the modal
     * @param options Optional configuration for modal content
     */
    handleOpen: (data?: any, options?: { type?: string; title?: string; content?: string }) => void;

    /**
     * Handles closing the modal using centralized state management
     */
    handleClose: () => void;

    /**
     * Checks if the modal is currently open
     * @returns True if the modal is open, false otherwise
     */
    isModalOpen: () => boolean;

    /**
     * Toggles the modal between open and closed states
     */
    toggleModal: () => void;

    /**
     * Checks if the modal is currently in closing animation
     * @returns True if the modal is closing, false otherwise
     */
    isModalClosing: () => boolean;

    /**
     * Updates the modal configuration
     * @param config The new configuration object
     */
    setConfig: (config: Partial<Config>) => void;

    /**
     * Retrieves the current modal configuration
     * @returns The current configuration object
     */
    getConfig: () => Config;

    /**
     * Gets the current modal element reference
     * @returns The HTML dialog or div element or null if not set
     */
    getModalElement: () => HTMLDialogElement | HTMLDivElement | null;

    /**
     * Sets the modal open state for synchronization with component state
     * @param open Whether the modal should be considered open
     */
    setModalOpen: (open: boolean) => void;

    /**
     * Handles visibility state changes with smooth transitions
     * @param shouldShow Whether the modal should be visible
     * @param callbacks Optional callbacks for open/close events
     */
    handleVisibilityChange: (shouldShow: boolean, callbacks?: { onOpen?: () => void; onClose?: () => void }) => void;

    /**
     * Handles focus management for modal intro
     * @param element The modal element to focus
     */
    handleModalIntro: (element: HTMLElement | null) => void;

    /**
     * Enhanced backdrop click handler with callback support
     * @param event The mouse or keyboard event from backdrop interaction
     * @param callback Optional callback to execute after closing
     */
    handleBackdropClickWithCallback: (event: KeyboardEvent | MouseEvent, callback?: () => void) => void;

    /**
     * Simple backdrop click handler for component integration
     * @param event The mouse event from backdrop interaction
     */
    handleBackdropClick: (event: MouseEvent) => void;

    /**
     * Enhanced escape key handler with callback support
     * @param event The keyboard event
     * @param callback Optional callback to execute after closing
     */
    handleEscapeKeyWithCallback: (event: KeyboardEvent, callback?: () => void) => void;

    /**
     * Handles keyboard events for modal interactions (ESC key, etc.)
     * @param event The keyboard event
     */
    handleKeydown: (event: KeyboardEvent) => void;

    /**
     * Handles native dialog cancel events (ESC key on dialog element)
     * @param event The cancel event
     */
    handleCancel: (event: Event) => void;

    /**
     * Handles keyup events for modal interactions
     * @param event The keyboard event
     */
    handleKeyUp: (event: KeyboardEvent) => void;

    /**
     * Handles animation end events for proper state management
     */
    handleAnimationEnd: () => void;

    /**
     * Handles animation start events
     */
    handleAnimationStart: () => void;

    /**
     * Handles animation iteration events for looping animations
     */
    handleAnimationIteration: () => void;

    /**
     * Handles animation cancel events
     */
    handleAnimationCancel: () => void;

    /**
     * Handles animation pause events
     */
    handleAnimationPause: () => void;

    /**
     * Handles animation resume events
     */
    handleAnimationResume: () => void;

    /**
     * Handles animation fill events
     */
    handleAnimationFill: () => void;

    /**
     * Destroys the modal instance and cleans up all event listeners
     */
    destroy: () => void;

    /**
     * Resets the modal to its initial state
     */
    reset: () => void;

    /**
     * Gets the current modal state information
     * @returns Object containing modal state details
     */
    getState: () => {
        isOpen: boolean;
        isClosing: boolean;
        hasElement: boolean;
    };

    /**
     * Locks modal and disables scrolling (similar to media manager's lockVideo)
     */
    lockModal: () => void;

    /**
     * Unlocks modal and enables scrolling (similar to media manager's unlockVideo)
     */
    unlockModal: () => void;

    /**
     * Toggles the lock state of the modal
     */
    toggleLock: () => void;

    /**
     * Gets the modal state store (similar to media manager's overlay state)
     * @returns Writable store containing modal state
     */
    getModalState: () => import('svelte/store').Writable<{
        show: boolean;
        data?: any;
        type?: string;
        title?: string;
        content?: string;
    }>;

    /**
     * Gets the centralized modal state for this modal ID
     * @returns Readable store containing centralized modal state
     */
    getCentralizedState: () => import('svelte/store').Readable<{
        isOpen: boolean;
        item?: any;
        title?: string;
        content?: string;
        type?: string;
        data?: any;
    }>;

    /**
     * Checks if this modal is open in the centralized store
     * @returns Readable store containing boolean open state
     */
    isModalOpenInStore: () => import('svelte/store').Readable<boolean>;
}