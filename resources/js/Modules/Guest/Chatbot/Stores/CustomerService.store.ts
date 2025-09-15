import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

// Customer Service Connection States
export type CSConnectionState = 'idle' | 'connecting' | 'connected' | 'waiting' | 'disconnected' | 'error';

// Customer Service Store Interface
interface CustomerServiceState {
  connectionState: CSConnectionState;
  agentName: string;
  agentId: string | null;
  sessionId: string | null;
  queuePosition: number;
  estimatedWaitTime: number; // in seconds
  isTransferring: boolean;
  lastActivity: Date | null;
}

// Initial state
const initialState: CustomerServiceState = {
  connectionState: 'idle',
  agentName: '',
  agentId: null,
  sessionId: null,
  queuePosition: 0,
  estimatedWaitTime: 0,
  isTransferring: false,
  lastActivity: null
};

// Create writable stores
export const csConnectionState: Writable<CSConnectionState> = writable(initialState.connectionState);
export const csAgentName: Writable<string> = writable(initialState.agentName);
export const csAgentId: Writable<string | null> = writable(initialState.agentId);
export const csSessionId: Writable<string | null> = writable(initialState.sessionId);
export const csQueuePosition: Writable<number> = writable(initialState.queuePosition);
export const csEstimatedWaitTime: Writable<number> = writable(initialState.estimatedWaitTime);
export const csIsTransferring: Writable<boolean> = writable(initialState.isTransferring);
export const csLastActivity: Writable<Date | null> = writable(initialState.lastActivity);

// Derived stores for computed values
export const isCSConnected: Readable<boolean> = derived(
  csConnectionState,
  ($connectionState) => $connectionState === 'connected'
);

export const isCSConnecting: Readable<boolean> = derived(
  csConnectionState,
  ($connectionState) => $connectionState === 'connecting' || $connectionState === 'waiting'
);

export const isCSActive: Readable<boolean> = derived(
  csConnectionState,
  ($connectionState) => {
    const isActive = $connectionState === 'connecting' || $connectionState === 'waiting' || $connectionState === 'connected';
    console.log('🔥 [CustomerService.store] isCSActive derived:', {
      connectionState: $connectionState,
      isActive
    });
    return isActive;
  }
);

export const csStatusMessage: Readable<string> = derived(
  [csConnectionState, csAgentName, csQueuePosition, csEstimatedWaitTime],
  ([$connectionState, $agentName, $queuePosition, $estimatedWaitTime]) => {
    switch ($connectionState) {
      case 'idle':
        return 'Customer Service';
      case 'connecting':
        return 'Sedang Menghubungkan...';
      case 'waiting':
        const waitMsg = $queuePosition > 0 
          ? `Menunggu antrian (posisi ${$queuePosition})` 
          : 'Menunggu customer service agent';
        const timeMsg = $estimatedWaitTime > 0 
          ? ` - estimasi ${Math.ceil($estimatedWaitTime / 60)} menit`
          : '';
        return waitMsg + timeMsg;
      case 'connected':
        return 'Tutup Komunikasi';
      case 'disconnected':
        return 'Customer Service';
      case 'error':
        return 'Customer Service';
      default:
        return 'Customer Service';
    }
  }
);

// Customer Service Store Actions
export const customerServiceStore = {
  // Connection management
  connect: () => {
    console.log('🚀 [CustomerService.store] connect() called - setting state to connecting');
    csConnectionState.set('connecting');
    csLastActivity.set(new Date());
    console.log('✅ [CustomerService.store] connect() completed');
  },
  
  setWaiting: (queuePosition: number = 0, estimatedWaitTime: number = 0) => {
    csConnectionState.set('waiting');
    csQueuePosition.set(queuePosition);
    csEstimatedWaitTime.set(estimatedWaitTime);
    csLastActivity.set(new Date());
  },
  
  setConnected: (agentName: string, agentId: string, sessionId: string) => {
    csConnectionState.set('connected');
    csAgentName.set(agentName);
    csAgentId.set(agentId);
    csSessionId.set(sessionId);
    csQueuePosition.set(0);
    csEstimatedWaitTime.set(0);
    csLastActivity.set(new Date());
  },
  
  disconnect: () => {
    console.log('🔌 [CustomerService.store] disconnect() called - setting state to disconnected');
    csConnectionState.set('disconnected');
    csLastActivity.set(new Date());
    console.log('✅ [CustomerService.store] disconnect() completed');
  },
  
  setError: () => {
    csConnectionState.set('error');
    csLastActivity.set(new Date());
  },
  
  reset: () => {
    csConnectionState.set(initialState.connectionState);
    csAgentName.set(initialState.agentName);
    csAgentId.set(initialState.agentId);
    csSessionId.set(initialState.sessionId);
    csQueuePosition.set(initialState.queuePosition);
    csEstimatedWaitTime.set(initialState.estimatedWaitTime);
    csIsTransferring.set(initialState.isTransferring);
    csLastActivity.set(null);
  },
  
  // Transfer management
  startTransfer: () => {
    csIsTransferring.set(true);
    csLastActivity.set(new Date());
  },
  
  completeTransfer: (newAgentName: string, newAgentId: string) => {
    csAgentName.set(newAgentName);
    csAgentId.set(newAgentId);
    csIsTransferring.set(false);
    csLastActivity.set(new Date());
  },
  
  // Activity tracking
  updateActivity: () => {
    csLastActivity.set(new Date());
  },
  
  // Queue management
  updateQueue: (position: number, estimatedWaitTime: number) => {
    csQueuePosition.set(position);
    csEstimatedWaitTime.set(estimatedWaitTime);
    csLastActivity.set(new Date());
  }
};

// Export all stores and actions
export default {
  // Individual stores
  csConnectionState,
  csAgentName,
  csAgentId,
  csSessionId,
  csQueuePosition,
  csEstimatedWaitTime,
  csIsTransferring,
  csLastActivity,
  
  // Derived stores
  isCSConnected,
  isCSConnecting,
  isCSActive,
  csStatusMessage,
  
  // Actions
  ...customerServiceStore
};