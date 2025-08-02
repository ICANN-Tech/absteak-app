<script lang="ts">
	import { Modal } from '$lib/components/atoms';
	import { modalStore } from '$lib/stores/modal';

	const modalId = 'test-modal';
	let showModal = false;

	function openModal() {
		showModal = true;
		modalStore.open(modalId, {
			title: 'Test Modal',
			content: 'This is a test modal to check backdrop click functionality.',
			type: 'test'
		});
	}

	function closeModal() {
		showModal = false;
		modalStore.close(modalId);
	}
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center">
	<div class="text-center">
		<h1 class="text-3xl font-bold mb-8">Modal Test Page</h1>
		<button 
			on:click={openModal}
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		>
			Open Test Modal
		</button>
		
		<div class="mt-8 text-sm text-gray-600">
			<p>Click the button to open the modal.</p>
			<p>Then click outside the modal content to test backdrop click functionality.</p>
		</div>
	</div>
</div>

<Modal
	id={modalId}
	closeOnBackdrop={true}
	closeOnEscape={true}
	showHeader={true}
	showCloseButton={true}
	showFooter={true}
>
	<div class="p-4">
		<p class="mb-4">This is the modal content. Click outside this white area to close the modal.</p>
		<button 
			on:click={closeModal}
			class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
		>
			Close Modal
		</button>
	</div>
</Modal>