<script context="module" lang="ts">
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { tick } from "svelte";
    import { CHATBOT_CONFIG, CSS_CLASSES } from "../Const/Chatbot.const";

    import type { MessageType } from "../Types/Message.type";

    import ChatHeader from "./Header.svelte";
    import MenuButtons from "./BadgeMenu.svelte";
    import ChatInput from "./Input.svelte";
    import MessageText from "./MessageText.svelte";
</script>

<script lang="ts">
    // Props
    export let dialogPositionClasses: string;
    export let messages: MessageType[] = [];
    export let showMenuButtons = true;
    export let customMenuItems: ("CS" | "Menu" | "Dine In" | "Dine Out")[] = [
        ...CHATBOT_CONFIG.DEFAULT_MENU_ITEMS,
    ];

    export let loading = false;
    export let disabled = false;
    export let error: string | null = null;
    export let input = "";
    export let placeholder = CHATBOT_CONFIG.DEFAULT_PLACEHOLDER;

    // Event handlers
    export let onClearChat: () => void;
    export let onCloseChat: () => void;
    export let onSelectMenu: (menu: string) => void;
    export let onSend: () => void;
    export let onKeyDown: (e: KeyboardEvent) => void;
    export let onMessageClick: (e: CustomEvent) => void;
    export let onAvatarClick: (e: CustomEvent) => void;
    export let onEndChat: (() => void) | null = null;

    // Messages container reference
    let messagesContainer: HTMLElement;

    // Auto-scroll to bottom when new messages arrive
    let lastMessageCount = 0;
    $: if (
        messages &&
        messagesContainer &&
        messages.length > lastMessageCount
    ) {
        lastMessageCount = messages.length;
        tick().then(() => {
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });
    }

    // Handle scroll events to prevent propagation when scrolling in chat area
    function handleChatScroll(event: WheelEvent) {
        if (!messagesContainer) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        // Prevent scroll propagation to parent if we can still scroll in the chat area
        if (
            (event.deltaY < 0 && !isAtTop) ||
            (event.deltaY > 0 && !isAtBottom)
        ) {
            event.stopPropagation();
        }
    }

    // Reactive classes
    $: dialogClasses = `${CSS_CLASSES.CHAT_DIALOG} ${CHATBOT_CONFIG.UI.CHAT_WIDTH} ${CHATBOT_CONFIG.UI.CHAT_HEIGHT} ${dialogPositionClasses}`;
</script>

<div
    class={dialogClasses}
    in:fly={{
        y: CHATBOT_CONFIG.ANIMATION.FLY_OFFSET,
        duration: CHATBOT_CONFIG.ANIMATION.FLY_DURATION,
        easing: cubicOut,
        delay: CHATBOT_CONFIG.ANIMATION.FLY_DELAY,
    }}
    out:fly={{
        y: CHATBOT_CONFIG.ANIMATION.FLY_OFFSET,
        duration: CHATBOT_CONFIG.ANIMATION.FLY_OUT_DURATION,
        easing: cubicOut,
    }}
>
    <!-- Header -->
    <ChatHeader {error} {loading} {onClearChat} {onCloseChat} />

    <!-- Menu Buttons -->
    {#if showMenuButtons}
        <MenuButtons {customMenuItems} {loading} {disabled} {onSelectMenu} />
    {/if}

    <!-- Messages -->
    <div
        bind:this={messagesContainer}
        class="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50 to-white"
        on:wheel={handleChatScroll}
    >
        {#each messages as message, index (message.id || index)}
            <!-- Message Content -->
            <MessageText
                {message}
                {index}
                {messages}
                error={false}
                {onMessageClick}
            />
        {/each}
    </div>

    <!-- Input -->
    <ChatInput
        bind:input
        {placeholder}
        {loading}
        {disabled}
        {onSend}
        {onKeyDown}
        {onEndChat}
    />
</div>

<style>
    /* Custom scrollbar for messages container */
    :global(div::-webkit-scrollbar) {
        width: 6px;
    }

    :global(div::-webkit-scrollbar-track) {
        background: #fef3c7;
        border-radius: 10px;
    }

    /* Ensure smooth animations */
    :global(.svelte-fly-move) {
        transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Message bubble animations */
    :global(.message-bubble) {
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

    /* Backdrop blur support */
    :global(.backdrop-blur-sm) {
        backdrop-filter: blur(4px);
    }
</style>
