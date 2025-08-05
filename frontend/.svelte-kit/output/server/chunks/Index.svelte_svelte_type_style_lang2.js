import { S as SectionId, C as ComponentId, g as scrollUtils } from "./initialize.js";
import { H as HighlightId } from "./highlight-id.js";
import { isVisibilityLocked, hideComponent, unlockVisibility, lockVisibility, showComponent, setComponentVisibility, getVisibilityConfig, getVisibilityLockedValue } from "./visibility.js";
import { d as derived, w as writable } from "./index7.js";
[
  {
    id: HighlightId.VideoHighlight,
    name: "Video Highlight",
    sectionId: SectionId.VideoHighlight
  },
  {
    id: HighlightId.Experience,
    name: "Experience",
    sectionId: SectionId.Experience
  },
  {
    id: HighlightId.Chef,
    name: "Chef",
    sectionId: SectionId.Chef
  },
  {
    id: HighlightId.Menu,
    name: "Menu",
    sectionId: SectionId.Menu
  },
  {
    id: HighlightId.Booking,
    name: "Reservation",
    sectionId: SectionId.Booking
  }
];
const initialState = {
  isOpen: false,
  item: null,
  size: "md",
  preventBodyScroll: true,
  closeOnEscape: true,
  closeOnBackdrop: true,
  animationDuration: 400
};
function createModalStore() {
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    // Open modal with item
    open: (item, options) => {
      update((state) => ({
        ...state,
        isOpen: true,
        item,
        ...options
      }));
    },
    // Close modal
    close: () => {
      update((state) => ({
        ...state,
        isOpen: false
      }));
    },
    // Update modal settings
    updateSettings: (settings) => {
      update((state) => ({
        ...state,
        ...settings
      }));
    },
    // Reset to initial state
    reset: () => set(initialState),
    // Set size
    setSize: (size) => {
      update((state) => ({ ...state, size }));
    }
  };
}
const modalStore = createModalStore();
derived(modalStore, ($modal) => $modal.isOpen);
derived(modalStore, ($modal) => $modal.item);
derived(modalStore, ($modal) => $modal.size);
const videoModalStates = /* @__PURE__ */ new Map();
let videoModalActiveState = false;
function openVideoModal(modalId) {
  videoModalStates.set(modalId, true);
  videoModalActiveState = true;
  modalStore.updateSettings({ isOpen: true });
}
function closeVideoModal(modalId) {
  videoModalStates.set(modalId, false);
  const anyVideoModalOpen = Array.from(videoModalStates.values()).some((isOpen) => isOpen);
  if (!anyVideoModalOpen) {
    videoModalActiveState = false;
    modalStore.close();
  }
}
function isVideoModalOpen(modalId) {
  return videoModalStates.get(modalId) || false;
}
function isVideoModalActive() {
  return videoModalActiveState;
}
const snapshots = writable(/* @__PURE__ */ new Map());
function getAllComponents() {
  return [
    ComponentId.Navigation,
    ComponentId.Schedule,
    ComponentId.Highlight,
    ComponentId.LanguageSwitch,
    ComponentId.VideoPromotion,
    ComponentId.ChatBot,
    ComponentId.Operation
  ];
}
function captureComponentSnapshot(snapshotId) {
  try {
    const allComponents = getAllComponents();
    const componentStates = [];
    allComponents.forEach((componentId) => {
      const config = getVisibilityConfig(componentId);
      if (config) {
        const isLocked = isVisibilityLocked(componentId);
        const lockedValue = isLocked ? getVisibilityLockedValue(componentId) : null;
        componentStates.push({
          componentId,
          showComponent: config.currentState.showComponent,
          visible: config.currentState.visible,
          isLocked,
          lockedValue
        });
      }
    });
    const snapshot = {
      snapshotId,
      timestamp: Date.now(),
      components: componentStates
    };
    snapshots.update((store) => {
      store.set(snapshotId, snapshot);
      return store;
    });
    console.log(`Component snapshot captured: ${snapshotId}`, componentStates);
    return true;
  } catch (error) {
    console.error(`Failed to capture component snapshot: ${snapshotId}`, error);
    return false;
  }
}
function restoreComponentSnapshot(snapshotId) {
  try {
    let targetSnapshot;
    snapshots.subscribe((store) => {
      targetSnapshot = store.get(snapshotId);
    })();
    if (!targetSnapshot) {
      console.warn(`Snapshot not found: ${snapshotId}`);
      return false;
    }
    targetSnapshot.components.forEach((state) => {
      console.log("Restoring component:", state.componentId, {
        showComponent: state.showComponent,
        visible: state.visible,
        isLocked: state.isLocked,
        lockedValue: state.lockedValue
      });
      if (state.isLocked) {
        lockVisibility(state.componentId, state.lockedValue);
      } else {
        if (isVisibilityLocked(state.componentId)) {
          unlockVisibility(state.componentId);
        }
        if (state.showComponent === true) {
          showComponent(state.componentId);
        } else if (state.showComponent === false) {
          hideComponent(state.componentId);
        } else {
          setComponentVisibility(state.componentId, null);
        }
      }
    });
    console.log(`Component snapshot restored: ${snapshotId}`, targetSnapshot.components);
    return true;
  } catch (error) {
    console.error(`Failed to restore component snapshot: ${snapshotId}`, error);
    return false;
  }
}
function deleteComponentSnapshot(snapshotId) {
  try {
    snapshots.update((store) => {
      const deleted = store.delete(snapshotId);
      if (deleted) {
        console.log(`Component snapshot deleted: ${snapshotId}`);
      } else {
        console.warn(`Snapshot not found for deletion: ${snapshotId}`);
      }
      return store;
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete component snapshot: ${snapshotId}`, error);
    return false;
  }
}
function hasComponentSnapshot(snapshotId) {
  let exists = false;
  snapshots.subscribe((store) => {
    exists = store.has(snapshotId);
  })();
  return exists;
}
function hideAllComponentsWithSnapshot(snapshotId) {
  try {
    const captured = captureComponentSnapshot(snapshotId);
    if (!captured) {
      return false;
    }
    const allComponents = getAllComponents();
    const lockedComponents = [];
    const unlockedComponents = [];
    allComponents.forEach((componentId) => {
      if (isVisibilityLocked(componentId)) {
        lockedComponents.push(componentId);
      } else {
        unlockedComponents.push(componentId);
      }
    });
    if (unlockedComponents.length > 0) {
      hideComponent(unlockedComponents);
    }
    if (lockedComponents.length > 0) {
      lockedComponents.forEach((componentId) => {
        unlockVisibility(componentId);
        hideComponent(componentId);
        lockVisibility(componentId, false);
      });
    }
    console.log(`All components hidden with snapshot: ${snapshotId}`, {
      unlockedComponents,
      lockedComponents
    });
    return true;
  } catch (error) {
    console.error(`Failed to hide components with snapshot: ${snapshotId}`, error);
    return false;
  }
}
const componentSnapshotUtils = {
  // Create snapshot for modal
  captureForModal: (modalName) => captureComponentSnapshot(`modal-${modalName}`),
  // Restore snapshot for modal
  restoreForModal: (modalName) => restoreComponentSnapshot(`modal-${modalName}`),
  // Delete snapshot for modal
  cleanupForModal: (modalName) => deleteComponentSnapshot(`modal-${modalName}`),
  // Hide all and capture for modal
  hideAllForModal: (modalName) => hideAllComponentsWithSnapshot(`modal-${modalName}`),
  // Check if modal snapshot exists
  hasModalSnapshot: (modalName) => hasComponentSnapshot(`modal-${modalName}`)
};
const DEFAULT_CONFIG = {
  onOpen: () => {
  },
  onClose: () => {
  },
  preventBodyScroll: true,
  closeOnEscape: true,
  closeOnBackdrop: true,
  animationDuration: 300,
  autoFocus: true,
  restoreFocus: true,
  modalClass: "",
  backdropClass: ""
};
function createModalModule(initialConfig = {}, modalId = "default") {
  let modalElement = null;
  let isOpen = false;
  let isClosing = false;
  let config = { ...DEFAULT_CONFIG, ...initialConfig };
  let focusedElementBeforeOpen = null;
  const modalState = writable({
    show: false,
    data: null,
    type: "",
    title: "",
    content: ""
  });
  const lockModal = () => {
    if (typeof document === "undefined") return;
    console.log("🔒 lockModal called for modalId:", modalId);
    if (config.preventBodyScroll) {
      scrollUtils.disable();
    }
    console.log("📸 Calling hideAllForModal...");
    const result = componentSnapshotUtils.hideAllForModal(modalId);
    console.log("📸 hideAllForModal result:", result);
    console.log("🔒 lockModal completed");
  };
  const getAllComponents2 = () => {
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
  const unlockModal = () => {
    console.info("Component id, restore", ComponentId.LanguageSwitch);
    if (typeof document === "undefined") return;
    console.log("🔓 unlockModal called for modalId:", modalId);
    scrollUtils.enable();
    const allComponents = getAllComponents2();
    unlockVisibility(allComponents, true);
    console.log("🔄 Calling restoreForModal...");
    const restoreResult = componentSnapshotUtils.restoreForModal(modalId);
    console.log("🔄 restoreForModal result:", restoreResult);
    console.log("🧹 Calling cleanupForModal...");
    const cleanupResult = componentSnapshotUtils.cleanupForModal(modalId);
    console.log("🧹 cleanupForModal result:", cleanupResult);
    console.log("🔓 unlockModal completed");
  };
  const manageFocus = (shouldFocus) => {
    if (typeof document === "undefined") return;
    if (shouldFocus && config.autoFocus && modalElement) {
      focusedElementBeforeOpen = document.activeElement;
      modalElement.focus();
    } else if (!shouldFocus && config.restoreFocus && focusedElementBeforeOpen) {
      focusedElementBeforeOpen.focus();
      focusedElementBeforeOpen = null;
    }
  };
  const handleVisibilityChange = (shouldShow, callbacks) => {
    if (shouldShow && !isOpen) {
      isOpen = true;
      callbacks?.onOpen?.();
    } else if (!shouldShow && isOpen) {
      setTimeout(() => {
        isOpen = false;
      }, config.animationDuration);
      callbacks?.onClose?.();
    }
  };
  const handleModalIntro = (element) => {
    if (!element || !config.autoFocus) return;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  };
  const handleBackdropClickWithCallback = (event, callback) => {
    if (config.closeOnBackdrop && event.target === event.currentTarget && isOpen && !isClosing) {
      closeModal();
      callback?.();
    }
  };
  const handleBackdropClick = (event) => {
    console.log("🖱️ handleBackdropClick called:", {
      closeOnBackdrop: config.closeOnBackdrop,
      isTargetCurrentTarget: event.target === event.currentTarget,
      isOpen,
      isClosing,
      target: event.target,
      currentTarget: event.currentTarget
    });
    if (config.closeOnBackdrop && event.target === event.currentTarget && isOpen && !isClosing) {
      console.log("✅ Backdrop click conditions met, closing modal");
      closeModal();
    } else {
      console.log("❌ Backdrop click conditions not met");
    }
  };
  const handleEscapeKeyWithCallback = (event, callback) => {
    if (config.closeOnEscape && event.key === "Escape" && isOpen && !isClosing) {
      closeModal();
      callback?.();
    }
  };
  const handleOpen = (data, options) => {
    if (isOpen || isClosing) return;
    lockModal();
    modalStore.open(modalId, {
      item: data?.item || null,
      title: options?.title || data?.title || "",
      content: options?.content || data?.content || "",
      type: options?.type || data?.type || "",
      data: data || null
    });
    modalState.update((state) => ({
      ...state,
      show: true,
      data: data || null,
      type: options?.type || "",
      title: options?.title || "",
      content: options?.content || ""
    }));
    isOpen = true;
    manageFocus(true);
    config.onOpen();
  };
  const handleClose = () => {
    if (!isOpen || isClosing) return;
    isClosing = true;
    modalStore.close(modalId);
    modalState.update((state) => ({
      ...state,
      show: false
    }));
    setTimeout(() => {
      isOpen = false;
      isClosing = false;
      manageFocus(false);
      unlockModal();
      config.onClose();
    }, config.animationDuration);
  };
  const closeModal = () => {
    handleClose();
  };
  const module = {
    setModalElement: (element) => {
      modalElement = element;
      if (config.modalClass) {
        element.classList.add(...config.modalClass.split(" "));
      }
    },
    // Updated methods to use centralized store
    openModal: (data, options) => {
      handleOpen(data, options);
    },
    closeModal: () => {
      handleClose();
    },
    // Additional methods for component compatibility
    handleOpen: (data, options) => {
      handleOpen(data, options);
    },
    handleClose: () => {
      handleClose();
    },
    // Additional media manager-like methods
    toggleModal: () => {
      if (isOpen) {
        closeModal();
      } else {
        handleOpen();
      }
    },
    lockModal: () => {
      lockModal();
    },
    unlockModal: () => {
      unlockModal();
    },
    toggleLock: () => {
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
    isModalOpen: () => isOpen,
    isModalClosing: () => isClosing,
    setConfig: (newConfig) => {
      config = { ...config, ...newConfig };
    },
    getConfig: () => ({ ...config }),
    getModalElement: () => modalElement,
    // Method to sync modal state from component
    setModalOpen: (open) => {
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
    handleKeydown: (event) => {
      if (config.closeOnEscape && event.key === "Escape" && isOpen && !isClosing) {
        closeModal();
      }
    },
    handleKeyUp: (event) => {
    },
    handleCancel: (event) => {
      event.preventDefault();
      if (config.closeOnEscape && isOpen && !isClosing) {
        closeModal();
      }
    },
    handleAnimationEnd: () => {
    },
    handleAnimationStart: () => {
    },
    handleAnimationIteration: () => {
    },
    handleAnimationCancel: () => {
      if (isClosing) {
        isClosing = false;
      }
    },
    handleAnimationPause: () => {
    },
    handleAnimationResume: () => {
    },
    handleAnimationFill: () => {
    },
    destroy: () => {
      if (isOpen) {
        unlockModal();
        manageFocus(false);
      }
      modalElement = null;
      isOpen = false;
      isClosing = false;
      focusedElementBeforeOpen = null;
    },
    reset: () => {
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
const modalManager = {
  modal: createModalModule()
};
createModalModule();
function createModalDataStore() {
  const { subscribe, set, update } = writable({
    item: null,
    type: "",
    title: "",
    content: ""
  });
  return {
    subscribe,
    /**
     * Sets the modal item data (similar to media manager's openVideo)
     * @param item The item to display in the modal
     * @param options Optional configuration for modal content
     */
    setItem: (item, options) => {
      set({
        item,
        type: options?.type || "",
        title: options?.title || "",
        content: options?.content || ""
      });
    },
    /**
     * Clears the modal item data (similar to media manager's closeVideo)
     */
    clearItem: () => {
      set({
        item: null,
        type: "",
        title: "",
        content: ""
      });
    },
    /**
     * Updates modal data without replacing the entire state
     * @param updates Partial updates to apply
     */
    updateData: (updates) => {
      update((state) => ({
        ...state,
        ...updates
      }));
    },
    /**
     * Gets the current modal item
     * @returns Current modal item or null
     */
    getItem: () => {
      let currentItem = null;
      update((state) => {
        currentItem = state.item;
        return state;
      });
      return currentItem;
    },
    /**
     * Gets the current modal state
     * @returns Current modal data state
     */
    getState: () => {
      let currentState = { item: null };
      update((state) => {
        currentState = { ...state };
        return state;
      });
      return currentState;
    }
  };
}
createModalDataStore();
export {
  modalManager as a,
  isVideoModalOpen as b,
  closeVideoModal as c,
  isVideoModalActive as i,
  modalStore as m,
  openVideoModal as o
};
