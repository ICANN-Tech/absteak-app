<script context="module" lang="ts">
  // Define types
  export type MessageType = {
    from: 'user' | 'bot';
    text: string;
    timestamp?: Date;
    id?: string;
  };

  export type BotAvatarConfig = {
    type: 'icon' | 'image';
    icon?: string;
    imageUrl?: string;
    backgroundColor?: string;
    iconColor?: string;
  };
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  // Props
  export let messages: MessageType[] = [];
  export let containerClass = 'flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50 to-white';
  export let userMessageClass = 'px-4 py-3 rounded-2xl rounded-tr-md mb-1 max-w-[85%] text-sm bg-white text-gray-800 shadow-lg border border-primary-200 backdrop-blur-sm';
  export let botMessageClass = 'px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-primary-400';
  export let botAvatarConfig: BotAvatarConfig = {
    type: 'icon',
    backgroundColor: 'bg-gradient-to-br from-primary-500 to-primary-600',
    iconColor: 'text-white'
  };
  export let showTimestamp = false;
  export let animationDelay = 50;
  export let animationDuration = 300;
  export let maxMessageWidth = '85%';

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    messageClick: { message: MessageType; index: number };
    avatarClick: { message: MessageType; index: number };
  }>();

  // Refs
  let messagesContainer: HTMLElement;

  // Functions
  export function scrollToBottom(): void {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function handleMessageClick(message: MessageType, index: number): void {
    dispatch('messageClick', { message, index });
  }

  function handleAvatarClick(message: MessageType, index: number): void {
    dispatch('avatarClick', { message, index });
  }

  function formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Auto scroll when messages change
  $: if (messages && messagesContainer) {
    setTimeout(scrollToBottom, 100);
  }
</script>

<div 
  class={containerClass}
  bind:this={messagesContainer}
>
  {#each messages as msg, i (msg.id || i)}
    <div 
      class="flex" 
      class:justify-end={msg.from === 'user'}
      in:fly={{ y: 10, duration: animationDuration, delay: animationDelay }}
    >
      {#if msg.from === 'bot'}
        <div class="flex items-start gap-3" style="max-width: {maxMessageWidth}">
          <!-- Bot Avatar -->
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm transition-transform hover:scale-105 {botAvatarConfig.backgroundColor || 'bg-gradient-to-br from-primary-500 to-primary-600'}"
            on:click={() => handleAvatarClick(msg, i)}
            aria-label="Bot avatar"
          >
            {#if botAvatarConfig.type === 'image' && botAvatarConfig.imageUrl}
              <img 
                src={botAvatarConfig.imageUrl} 
                alt="Bot avatar" 
                class="w-full h-full rounded-full object-cover"
              />
            {:else}
              <!-- Default lightning icon -->
              <svg class="w-4 h-4 {botAvatarConfig.iconColor || 'text-white'}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            {/if}
          </button>
          
          <!-- Bot Message -->
          <div class="flex flex-col">
            <button
              class={botMessageClass}
              on:click={() => handleMessageClick(msg, i)}
            >
              {msg.text}
            </button>
            {#if showTimestamp && msg.timestamp}
              <span class="text-xs text-gray-500 mt-1 ml-2">
                {formatTimestamp(msg.timestamp)}
              </span>
            {/if}
          </div>
        </div>
      {:else}
        <!-- User Message -->
        <div class="flex flex-col items-end" style="max-width: {maxMessageWidth}">
          <button
            class={userMessageClass}
            on:click={() => handleMessageClick(msg, i)}
          >
            {msg.text}
          </button>
          {#if showTimestamp && msg.timestamp}
            <span class="text-xs text-gray-500 mt-1 mr-2">
              {formatTimestamp(msg.timestamp)}
            </span>
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  /* Custom scrollbar for messages container */
  div::-webkit-scrollbar {
    width: 6px;
  }
  
  div::-webkit-scrollbar-track {
    background: #fef3c7;
    border-radius: 10px;
  }
  
  div::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #f59e0b, #d97706);
    border-radius: 10px;
  }
  
  div::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #d97706, #b45309);
  }
  
  /* Message bubble animations */
  .message-bubble {
    animation: messageSlide 0.3s ease-out;
  }
  
  @keyframes messageSlide {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>