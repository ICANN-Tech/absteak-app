<script lang="ts">
  import Toast from '$lib/components/atoms/toast/Index.svelte';
  import { onMount } from 'svelte';

  let toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    animation: 'fly' | 'slide' | 'fade' | 'scale' | 'blur' | 'bounce' | 'elastic' | 'flip';
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: 'sm' | 'md' | 'lg';
    visible: boolean;
  }> = [];

  const animations = ['fly', 'slide', 'fade', 'scale', 'blur', 'bounce', 'elastic', 'flip'] as const;
  const types = ['success', 'error', 'warning', 'info'] as const;
  const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;

  function showToast(
    message: string, 
    type: typeof types[number] = 'info',
    animation: typeof animations[number] = 'fly',
    position: typeof positions[number] = 'top-right',
    size: typeof sizes[number] = 'md'
  ) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = {
      id,
      message,
      type,
      animation,
      position,
      size,
      visible: true
    };
    
    toasts = [...toasts, newToast];
  }

  function removeToast(id: string) {
    toasts = toasts.filter(toast => toast.id !== id);
  }

  function showAnimationDemo(animation: typeof animations[number]) {
    showToast(
      `This is a ${animation} animation demo!`,
      'success',
      animation,
      'top-right',
      'md'
    );
  }

  function showTypeDemo(type: typeof types[number]) {
    showToast(
      `This is a ${type} message!`,
      type,
      'scale',
      'top-right',
      'md'
    );
  }

  function showPositionDemo(position: typeof positions[number]) {
    showToast(
      `Toast at ${position}`,
      'info',
      'bounce',
      position,
      'md'
    );
  }

  function showSizeDemo(size: typeof sizes[number]) {
    showToast(
      `This is ${size} size toast`,
      'warning',
      'elastic',
      'top-right',
      size
    );
  }

  function clearAllToasts() {
    toasts = [];
  }
</script>

<svelte:head>
  <title>Toast Animation Demo</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-white mb-4">🍞 Toast Animation Demo</h1>
      <p class="text-gray-300 text-lg">Test berbagai animasi dan konfigurasi Toast component</p>
    </div>

    <!-- Demo Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Animation Demos -->
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 class="text-2xl font-semibold text-white mb-6">🎬 Animations</h2>
        <div class="grid grid-cols-2 gap-3">
          {#each animations as animation}
            <button
              class="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all duration-200 border border-blue-400/30 hover:border-blue-400/50"
              on:click={() => showAnimationDemo(animation)}
            >
              {animation}
            </button>
          {/each}
        </div>
      </div>

      <!-- Type Demos -->
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 class="text-2xl font-semibold text-white mb-6">🎨 Types</h2>
        <div class="grid grid-cols-2 gap-3">
          {#each types as type}
            <button
              class="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-all duration-200 border border-emerald-400/30 hover:border-emerald-400/50"
              on:click={() => showTypeDemo(type)}
            >
              {type}
            </button>
          {/each}
        </div>
      </div>

      <!-- Position Demos -->
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 class="text-2xl font-semibold text-white mb-6">📍 Positions</h2>
        <div class="grid grid-cols-2 gap-3">
          {#each positions as position}
            <button
              class="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50"
              on:click={() => showPositionDemo(position)}
            >
              {position}
            </button>
          {/each}
        </div>
      </div>

      <!-- Size Demos -->
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 class="text-2xl font-semibold text-white mb-6">📏 Sizes</h2>
        <div class="grid grid-cols-3 gap-3">
          {#each sizes as size}
            <button
              class="px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg transition-all duration-200 border border-amber-400/30 hover:border-amber-400/50"
              on:click={() => showSizeDemo(size)}
            >
              {size}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Control Panel -->
    <div class="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h2 class="text-2xl font-semibold text-white mb-6">🎛️ Controls</h2>
      <div class="flex flex-wrap gap-4">
        <button
          class="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-200 border border-red-400/30 hover:border-red-400/50"
          on:click={clearAllToasts}
        >
          Clear All Toasts
        </button>
        
        <button
          class="px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-lg transition-all duration-200 border border-indigo-400/30 hover:border-indigo-400/50"
          on:click={() => showToast('Random toast!', types[Math.floor(Math.random() * types.length)], animations[Math.floor(Math.random() * animations.length)])}
        >
          Random Toast
        </button>
      </div>
    </div>

    <!-- Active Toasts Info -->
    <div class="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h2 class="text-2xl font-semibold text-white mb-4">📊 Active Toasts: {toasts.length}</h2>
      {#if toasts.length > 0}
        <div class="space-y-2">
          {#each toasts as toast}
            <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <span class="text-gray-300">
                {toast.message} - {toast.type} - {toast.animation} - {toast.position} - {toast.size}
              </span>
              <button
                class="text-red-400 hover:text-red-300 transition-colors"
                on:click={() => removeToast(toast.id)}
              >
                ✕
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400">No active toasts</p>
      {/if}
    </div>
  </div>
</div>

<!-- Render Toasts -->
{#each toasts as toast (toast.id)}
  <Toast
    message={toast.message}
    type={toast.type}
    animation={toast.animation}
    position={toast.position}
    size={toast.size}
    animationDuration={600}
    animationEasing="elasticOut"
    autohide={true}
    timeout={5000}
    dismissible={true}
    onclose={() => removeToast(toast.id)}
  />
{/each}