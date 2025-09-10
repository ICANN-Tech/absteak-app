<script lang="ts">
	import Modal from '@Components/Global/Atoms/Modal.svelte';
	import { getScrollLockState } from '@Utils/Global/ScrollLock';

	let showModal = false;
	let scrollLockState = getScrollLockState();

	// Update scroll lock state reactively
	$: {
		scrollLockState = getScrollLockState();
	}

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function handleModalClose() {
		showModal = false;
	}
</script>

<div class="scroll-lock-test p-8">
	<h1 class="text-3xl font-bold mb-6">Scroll Lock Test</h1>
	
	<div class="mb-6">
		<h2 class="text-xl font-semibold mb-4">Instructions:</h2>
		<ol class="list-decimal list-inside space-y-2 text-gray-700">
			<li>Try scrolling with mouse wheel or arrow keys - it should work normally</li>
			<li>Click "Open Modal" button</li>
			<li>Try scrolling again - it should be locked (no navigation)</li>
			<li>Close the modal - scrolling should be restored</li>
		</ol>
	</div>

	<div class="mb-6">
		<h2 class="text-xl font-semibold mb-4">Current Scroll Lock Status:</h2>
		<div class="bg-gray-100 p-4 rounded-lg">
			<p><strong>Is Locked:</strong> <span class="{scrollLockState.isLocked ? 'text-red-600' : 'text-green-600'}">{scrollLockState.isLocked ? 'Yes' : 'No'}</span></p>
			<p><strong>Lock Count:</strong> {scrollLockState.lockCount}</p>
		</div>
	</div>

	<div class="mb-8">
		<button 
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
			on:click={openModal}
		>
			Open Modal
		</button>
	</div>

	<!-- Create some content to make the page scrollable -->
	<div class="space-y-8">
		{#each Array(20) as _, i}
			<div class="bg-gray-200 p-6 rounded-lg">
				<h3 class="text-lg font-semibold mb-2">Section {i + 1}</h3>
				<p class="text-gray-600">
					This is section {i + 1}. Try using arrow keys (up/down) or mouse wheel to navigate between sections.
					When the modal is open, navigation should be locked and you won't be able to scroll.
				</p>
			</div>
		{/each}
	</div>
</div>

<!-- Modal -->
<Modal 
	bind:show={showModal}
	title="Test Modal"
	size="md"
	onclose={handleModalClose}
>
	<div class="p-4">
		<h3 class="text-lg font-semibold mb-4">Modal Content</h3>
		<p class="mb-4">
			This is a test modal. While this modal is open, scrolling should be locked.
			Try using:
		</p>
		<ul class="list-disc list-inside space-y-1 mb-4">
			<li>Mouse wheel</li>
			<li>Arrow keys (up/down)</li>
			<li>Page Up/Page Down keys</li>
		</ul>
		<p class="mb-4">
			None of these should work while the modal is open.
		</p>
		<button 
			class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
			on:click={closeModal}
		>
			Close Modal
		</button>
	</div>
</Modal>

<style>
	.scroll-lock-test {
		min-height: 200vh; /* Make page scrollable */
	}
</style>