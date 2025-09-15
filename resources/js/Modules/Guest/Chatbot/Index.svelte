<script context="module" lang="ts">
  import { lockScrolling, unlockScrolling } from '@Utils/Global/ScrollLock';
  import { onMount, onDestroy } from 'svelte';
  import { scale } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  
  import {
    CHATBOT_CONFIG,
    POSITION_CLASSES,
    DIALOG_POSITION_CLASSES,
    type ChatbotPosition
  } from './Const/Chatbot.const';
  import type { MessageType } from './Types/Message.type';
  import { chatbotService } from './Services/Chatbot.service';
  import { chatUtils, ChatUtils } from './Utils/Chat.util';
  import { MessageFrom } from './Types/Message.type';
  import { selectMenu } from './Utils/Selector.util';
  import { initializeChatbot } from './Utils/Initialize.util';
  import { toggleChat, closeChat, setupClickOutsideListener } from './Utils/Dialog';
  import { messages, error, loading, chatStore } from './Stores/Chat.store';
  import { csConnectionState, customerServiceStore } from './Stores/CustomerService.store';
  import ChatButton from './Parts/Button.svelte';
  import ChatDialog from './Parts/Dialog.svelte';
</script>

<script lang="ts">

  // Component props
  export let open = false;
  export let position: ChatbotPosition = CHATBOT_CONFIG.DEFAULT_POSITION;
  export let showMenuButtons = true;
  export let customMenuItems: ("CS" | "Menu" | "Dine In" | "Dine Out")[] = [...CHATBOT_CONFIG.DEFAULT_MENU_ITEMS];
  export let initialMessage = CHATBOT_CONFIG.DEFAULT_INITIAL_MESSAGE;
  export let placeholder = CHATBOT_CONFIG.DEFAULT_PLACEHOLDER;
  export let disabled = false;

  // State variables
  let input = '';

  // Initialize chat with welcome message
  let cleanup: (() => void) | null = null;
  
  onMount(async () => {
    cleanup = await initializeChatbot(initialMessage, closeChatHandler);
  });
  
  // Cleanup on component destroy
  onDestroy(() => {
    if (cleanup) {
      cleanup();
    }
    if (clickOutsideCleanup) {
      clickOutsideCleanup();
    }
  });

  // Dialog element reference untuk click outside
  let dialogElement: HTMLElement;
  let clickOutsideCleanup: (() => void) | null = null;

  // Toggle chat visibility
  function toggleChatHandler(): void {
    open = toggleChat(open, disabled);
  }

  // Close chat
  function closeChatHandler(): void {
    open = closeChat(open);
  }

  // Handle menu button selection using Selector.util.ts
  async function selectMenuHandler(menu: string): Promise<void> {
    await selectMenu(
      menu,
      sendMessage,
      $csConnectionState,
      $loading,
      disabled || $loading,
      initialMessage,
      (newMenu: string) => { chatStore.setActiveMenu(newMenu); },
      (newMessages: MessageType[]) => { messages.set(newMessages); },
      (newState: string) => { 
        // Use customerServiceStore actions instead of direct state setting
        switch (newState) {
          case 'connecting':
            customerServiceStore.connect();
            break;
          case 'waiting':
            customerServiceStore.setWaiting();
            break;
          case 'connected':
            customerServiceStore.setConnected('', '', '');
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
      }
    );
  }

  // Send message
  async function send(): Promise<void> {
    if (!ChatUtils.validateMessage(input) || $loading || disabled) return;
    await sendMessage(ChatUtils.sanitizeMessage(input), true);
  }

  // Core message sending
  async function sendMessage(messageText: string, clearInput: boolean = true): Promise<void> {
    if (!ChatUtils.validateMessage(messageText) || $loading) return;
    console.log('📤 SendMessage called - CS State:', $csConnectionState, 'Loading:', $loading);

    chatStore.setError(null);

    try {
      const userMessage: MessageType = {
        from: MessageFrom.User,
        message: messageText,
        timestamp: new Date(),
        id: ChatUtils.generateMessageId('user'),
        isFromCS: $csConnectionState === 'connected'
      };
      chatStore.addMessage(userMessage);

      if (clearInput) input = '';

      if ($csConnectionState === 'connected') {
        const messageData = {
          username: `customer_${chatbotService.getCurrentSession()?.id}`,
          message: messageText,
          timestamp: new Date().toISOString(),
          user_type: 'customer',
          channel: chatbotService.getCurrentSession()?.privateChannelName,
          customer_id: chatbotService.getCurrentSession()?.id
        };
        await fetch('/api/chat/private/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          },
          body: JSON.stringify(messageData)
        });
      } else if ($csConnectionState === 'idle') {
        chatStore.setLoading(true);
        const botResponse = await chatbotService.sendMessage(messageText);
        const botMessage: MessageType = {
          from: MessageFrom.Bot,
          message: botResponse.content,
          timestamp: botResponse.timestamp,
          id: botResponse.id
        };
        chatStore.addMessage(botMessage);
      }
    } catch (err) {
      chatUtils.errors.logError('sendMessage', err);
      const errorMsg = chatUtils.errors.handleError(err);
      chatStore.setError(errorMsg);
      chatStore.addMessage(chatUtils.errors.createErrorMessage(errorMsg));
    } finally {
      if ($csConnectionState !== 'connected') chatStore.setLoading(false);
    }
  }

  // Keyboard events
  function handleKey(e: KeyboardEvent): void {
    chatUtils.events.handleEnterKey(e, send);
  }

  // Clear chat
  function clearChat(): void {
    chatbotService.clearHistory();
    chatStore.setMessages([{ from: 'bot', message: initialMessage, timestamp: new Date() }]);
    chatStore.setError(null);
  }

  // End chat handler for customer
  function handleEndChat(): void {
    console.log('🔚 [CUSTOMER] End chat button clicked');
    
    // Send end chat message to CS if connected
    if ($csConnectionState === 'connected') {
      sendMessage('end chat', false);
    }
    
    // Close the chat dialog
    closeChatHandler();
    
    // Reset chat state
    chatbotService.endCurrentSession();
    customerServiceStore.reset();
    chatStore.setMessages([{ from: 'bot', message: initialMessage, timestamp: new Date() }]);
    chatStore.setError(null);
  }

  // Position classes
  $: positionClasses = POSITION_CLASSES[position];
  $: dialogPositionClasses = DIALOG_POSITION_CLASSES[position];

  // Event handlers
  function handleMessageClick(e: CustomEvent) { console.log('Message clicked:', e.detail); }
  function handleAvatarClick(e: CustomEvent) { console.log('Avatar clicked:', e.detail); }

  // Setup click outside listener when dialog opens
  $: {
    if (open && dialogElement) {
      clickOutsideCleanup = setupClickOutsideListener(dialogElement, closeChatHandler);
    } else if (!open && clickOutsideCleanup) {
      clickOutsideCleanup();
      clickOutsideCleanup = null;
    }
  }

  $: {
    if (open) lockScrolling('Chat dialog opened');
    else unlockScrolling('Chat dialog closed');
  }
</script>

<!-- Floating Action Button -->
<div class="fixed {positionClasses} z-50">
  {#if !open}
    <div in:scale={{ duration: 400, easing: backOut, delay: 500 }}>
      <ChatButton {disabled} onclick={toggleChatHandler} />
    </div>
  {/if}

  {#if open}
    <div bind:this={dialogElement}>
      <ChatDialog
        {dialogPositionClasses}
        messages={$messages}
        {showMenuButtons}
        {customMenuItems}

        loading={$loading}
        disabled={disabled || $loading}
        error={$error}
        bind:input
        {placeholder}
        onClearChat={clearChat}
        onCloseChat={closeChatHandler}
        onSelectMenu={selectMenuHandler}
        onSend={send}
        onKeyDown={handleKey}
        onMessageClick={handleMessageClick}
        onAvatarClick={handleAvatarClick}
        onEndChat={$csConnectionState === 'connected' ? handleEndChat : null}
      />
    </div>
  {/if}
</div>

<style>
  /* Scrollbar */
  div::-webkit-scrollbar { width: 6px; }
  div::-webkit-scrollbar-track { background: #fef3c7; border-radius: 10px; }
  div::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #f59e0b, #d97706); border-radius: 10px; }
  div::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #d97706, #b45309); }

  /* Transitions */
  .transition-transform { transition: transform 0.2s cubic-bezier(0.4,0,0.2,1); }
  .transition-colors { transition: color, background-color, border-color 0.2s cubic-bezier(0.4,0,0.2,1); }
  .transition-all { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }

  .chat-button-container { display: inline-block; }
  :global(.svelte-scale) { transform-origin: center; }
  :global(.svelte-fly-move) { transition: transform 0.3s cubic-bezier(0.25,1,0.5,1); }

  button:hover:not(:disabled) { transform: translateY(-1px); }

  .message-bubble { animation: messageSlide 0.3s ease-out; }
  @keyframes messageSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .backdrop-blur-sm { backdrop-filter: blur(4px); }
  input:focus { box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .animate-spin { animation: spin 1s linear infinite; }
</style>
