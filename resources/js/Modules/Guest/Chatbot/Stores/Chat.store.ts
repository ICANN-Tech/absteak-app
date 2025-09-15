import { writable } from 'svelte/store';
import { ChatbotItemEnum } from '../Enums/ChatbotItem.enum';
import type { MessageType } from '../Utils/Chat.util';
// Import CS-related stores from dedicated CustomerService store
import { csConnectionState, csAgentName, customerServiceStore } from './CustomerService.store';

// Active menu state
export const activeMenu = writable<string>('General');

// Messages array
export const messages = writable<MessageType[]>([]);

// Loading state
export const loading = writable<boolean>(false);

// Disabled state
export const disabled = writable<boolean>(false);

// Initial message
export const initialMessage = writable<string>('Hi! How can I help you?');

// Re-export CS stores for backward compatibility
export { csConnectionState, csAgentName };

// Error state
export const error = writable<string | null>(null);

// Helper functions for state management
export const chatStore = {
  // Set active menu
  setActiveMenu: (menu: string) => {
    activeMenu.set(menu);
  },

  // Set CS connection state - delegate to CustomerService store
  setCSConnectionState: (state: string) => {
    // Use customerServiceStore actions instead of direct state setting
    switch(state) {
      case 'connecting':
        customerServiceStore.connect();
        break;
      case 'connected':
        // This should be called with proper agent info
        break;
      case 'disconnected':
        customerServiceStore.disconnect();
        break;
      case 'error':
        customerServiceStore.setError();
        break;
      default:
        customerServiceStore.reset();
    }
  },

  // Set messages
  setMessages: (messageList: MessageType[]) => {
    messages.set(messageList);
  },

  // Add message
  addMessage: (message: MessageType) => {
    messages.update(msgs => [...msgs, message]);
  },

  // Clear messages
  clearMessages: () => {
    messages.set([]);
  },

  // Set loading state
  setLoading: (isLoading: boolean) => {
    loading.set(isLoading);
  },

  // Set disabled state
  setDisabled: (isDisabled: boolean) => {
    disabled.set(isDisabled);
  },

  // Set CS agent name - delegate to CustomerService store
  setCSAgentName: (name: string) => {
    csAgentName.set(name);
  },

  // Set error state
  setError: (errorMessage: string | null) => {
    error.set(errorMessage);
  },

  // Reset to initial state
  reset: () => {
    activeMenu.set('General');
    customerServiceStore.reset(); // Reset CS state using dedicated store
    messages.set([]);
    loading.set(false);
    disabled.set(false);
    error.set(null);
  }
};