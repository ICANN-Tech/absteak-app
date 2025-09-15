<script context="module" lang="ts">
    import { quintOut } from "svelte/easing";
    import { MessageFrom } from "../Types/Message.type";
    import { fly } from "svelte/transition";
</script>

<script lang="ts">
    export let message: any;
    export let index: number;
    export let messages: any[] = [];
    export let error: boolean = false;
    export let onMessageClick: ((event: CustomEvent) => void) | null = null;

    // Class generator
    $: baseClass =
        message.from === MessageFrom.User
            ? "px-4 py-3 rounded-2xl rounded-tr-md mb-1 max-w-[85%] text-sm bg-white text-gray-800 shadow-lg border border-primary-200 backdrop-blur-sm text-left"
            : message.from === MessageFrom.CS || message.isFromCS
              ? "px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border border-green-400 text-left"
              : `px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-primary-400 text-left ${
                    error && index === messages.length - 1
                        ? "bg-red-500 border-red-400"
                        : ""
                }`;

    $: interactiveClass = onMessageClick
        ? "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-300"
        : "";
</script>

<div
    class="flex {message.from === MessageFrom.User
        ? 'justify-end'
        : 'justify-start'} items-start gap-2"
    in:fly={{ y: 20, duration: 300, easing: quintOut, delay: index * 50 }}
>
    {#if message.from === MessageFrom.Bot || message.from === MessageFrom.CS}
        <!-- Bot/CS Avatar -->
        <div
            class="w-8 h-8 rounded-full {message.from === MessageFrom.CS
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : 'bg-gradient-to-br from-primary-500 to-primary-600'} flex items-center justify-center flex-shrink-0"
        >
            {#if message.from === MessageFrom.CS}
                <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            {:else}
                <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
            {/if}
        </div>
    {/if}

    {#if onMessageClick}
        <button
            type="button"
            class="{baseClass} {interactiveClass}"
            on:click={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMessageClick(
                    new CustomEvent("messageClick", { detail: message }),
                );
            }}
        >
            {message.message}
        </button>
    {:else}
        <div class={baseClass}>
            {message.message}
        </div>
    {/if}
</div>
