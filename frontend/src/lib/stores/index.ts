export * from './carousel';
export * from './modal';
export * from './reservation';
export * from "./viewport";

// Legacy compatibility exports from viewport visibility
export { 
  getVisibilityStore,
  createVisibilityHandler,
  createVisibilityToggle,
  getAllVisibilityStores,
  getAllLockStates
} from './viewport/visibility';

// Enhanced modal exports (with different names to avoid conflicts)
export { 
  modalStore as enhancedModalStore,
  isModalOpen,
  currentModalItem,
  modalSize,
  getModalStore,
  openModal,
  closeModal,
  openModalById,
  closeModalById
} from './modal';
export type { ModalItem as EnhancedModalItem, ModalState as EnhancedModalState } from './modal';