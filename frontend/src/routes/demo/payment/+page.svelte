<script lang="ts">
	import PaymentMethod from '$lib/components/molecules/payment/Method.svelte';
	import type { PaymentMethod as PaymentMethodType } from '$lib/components/molecules/payment/Method.svelte';

	let selectedMethod: PaymentMethodType | null = null;

	function handleMethodSelected(event: CustomEvent<PaymentMethodType>) {
		selectedMethod = event.detail;
		console.log('Payment method selected:', selectedMethod);
	}

	function handleMethodDeselected() {
		selectedMethod = null;
		console.log('Payment method deselected');
	}
</script>

<svelte:head>
	<title>Payment Method Demo - ABSteak</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
	<div class="mx-auto max-w-4xl">
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white">Payment Method Demo</h1>
			<p class="text-gray-300">Demo komponen payment method dengan scroll dan selection</p>
		</div>

		<div class="rounded-2xl bg-gray-900/50 p-6 backdrop-blur-sm">
			<PaymentMethod
				on:methodSelected={handleMethodSelected}
				on:methodDeselected={handleMethodDeselected}
				bind:selectedMethod
			/>
		</div>

		{#if selectedMethod}
			<div class="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-6">
				<h3 class="mb-4 text-xl font-semibold text-green-400">Selected Payment Method</h3>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p class="text-sm text-gray-400">Name:</p>
						<p class="font-medium text-white">{selectedMethod.name}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Type:</p>
						<p class="font-medium text-white">{selectedMethod.type}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Fee:</p>
						<p class="font-medium text-white">
							{(selectedMethod.fee ?? 0) === 0 ? 'Gratis' : `Rp ${(selectedMethod.fee ?? 0).toLocaleString('id-ID')}`}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Processing Time:</p>
						<p class="font-medium text-white">{selectedMethod.processingTime}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>