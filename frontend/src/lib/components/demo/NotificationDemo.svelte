<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createStateVisibility } from '$lib/stores/viewport/visibility.js';

	// Create state-based visibility dengan ID unik untuk notification
	const notificationVisibility = createStateVisibility('notification-banner', {
		initialVisible: false,
		hideDelay: 5000 // Auto hide setelah 5 detik
	});

	// Extract store dan control functions
	const { isVisible, show, hide, toggle } = notificationVisibility;

	// Auto show notification setelah 2 detik (simulasi)
	setTimeout(() => {
		show();
	}, 2000);

	onDestroy(() => {
		notificationVisibility.destroy();
	});
</script>

{#if $isVisible}
	<div 
		class="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-all duration-300"
		role="alert"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
				</svg>
				<span>State visibility berhasil diimplementasikan!</span>
			</div>
			<button 
				on:click={hide}
				class="ml-4 text-white hover:text-gray-200 transition-colors"
				aria-label="Close notification"
			>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
				</svg>
			</button>
		</div>
	</div>
{/if}

<!-- Control buttons untuk demo -->
<div class="fixed bottom-20 right-4 z-40 flex flex-col gap-2">
	<button 
		on:click={show}
		class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
	>
		Show Notification
	</button>
	<button 
		on:click={hide}
		class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
	>
		Hide Notification
	</button>
	<button 
		on:click={toggle}
		class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
	>
		Toggle Notification
	</button>
</div>