<script lang="ts">
	import { Container } from '$lib/components/atoms';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import { 
        getMethodIcon,
		getMethodClasses,
		formatFee,
		getTypeLabel,
		groupMethodsByType,
		isMethodSelected,
		defaultPaymentMethods
	} from '$lib/utils/payment/method';
    
    import type { PaymentMethod } from '$lib/types';

	// Props
	export let paymentMethods: PaymentMethod[] = defaultPaymentMethods;
	export let selectedMethod: PaymentMethod | null = null;
	export let disabled: boolean = false;
	
	// New props for customization
	export let minHeight: string = 'auto';
	export let height: string = 'auto';
	export let maxHeight: string = '40vh';
	
	// Event callbacks (modern approach instead of createEventDispatcher)
	export let onMethodSelected: ((method: PaymentMethod) => void) | undefined = undefined;
	export let onMethodDeselected: (() => void) | undefined = undefined;

	// Functions
	function selectMethod(method: PaymentMethod) {
		if (disabled || !method.available) return;

		if (selectedMethod?.id === method.id) {
			selectedMethod = null;
			onMethodDeselected?.();
		} else {
			selectedMethod = method;
			onMethodSelected?.(method);
		}
	}

	function isSelected(method: PaymentMethod): boolean {
		return isMethodSelected(method, selectedMethod);
	}

	// Group methods by type using utils function
	$: groupedMethods = groupMethodsByType(paymentMethods);
	
	// Dynamic height styles
	$: heightStyles = `min-height: ${minHeight}; height: ${height}; max-height: ${maxHeight};`;
</script>

<Container variant="elegant" size="full" padding="xl" class="col-span-3 w-full h-full">
	<div class="space-y-6">
		<!-- Header Slot -->
		<slot name="header">
			<!-- Default Header -->
			<div class="border-b border-gray-700 pb-4 text-center">
				<h3 class="mb-2 text-2xl font-bold text-white">Metode Pembayaran</h3>
				<p class="text-gray-300">Pilih metode pembayaran yang Anda inginkan</p>
			</div>
		</slot>

		<!-- Payment Methods List -->
		<div 
			class="scrollbar space-y-6 overflow-y-auto pr-3 pb-4"
			style={heightStyles}
			on:wheel|stopPropagation
			on:touchmove|stopPropagation
			role="region"
			aria-label="Payment method selection"
		>
			{#each Object.entries(groupedMethods) as [type, methods]}
				<div class="space-y-4">
					<!-- Type Header -->
					<h4 class="text-lg font-semibold text-orange-400 flex items-center gap-2">
						<svelte:component this={getMethodIcon(methods[0])} class="h-5 w-5" />
						{getTypeLabel(type)}
					</h4>

					<!-- Methods Grid -->
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						{#each methods as method (method.id)}
							<div
								class={getMethodClasses(method, isSelected(method), disabled)}
								on:click={() => selectMethod(method)}
								on:keydown={(e) => e.key === 'Enter' && selectMethod(method)}
								role="button"
								tabindex={disabled || !method.available ? -1 : 0}
							>
								<!-- Selection Indicator -->
								{#if isSelected(method)}
									<div class="absolute right-3 top-3">
										<CheckCircleSolid class="h-5 w-5 text-orange-500" />
									</div>
								{/if}

								<!-- Method Info -->
								<div class="space-y-3">
									<!-- Method Name & Icon -->
									<div class="flex items-center gap-3">
										<svelte:component 
											this={getMethodIcon(method)} 
											class="h-6 w-6 flex-shrink-0 text-orange-400" 
										/>
										<div class="flex-1">
											<h5 class="font-semibold text-white transition-colors group-hover:text-orange-400">
												{method.name}
											</h5>
											<p class="text-xs text-gray-400">{method.description}</p>
										</div>
									</div>

									<!-- Method Details -->
									<div class="flex items-center justify-between text-sm">
										<div class="flex items-center gap-4">
											<!-- Fee -->
											<div class="flex items-center gap-1">
												<span class="text-gray-400">Biaya:</span>
												<span class="font-medium {(method.fee ?? 0) === 0 ? 'text-green-400' : 'text-yellow-400'}">
													{formatFee(method.fee)}
												</span>
											</div>

											<!-- Processing Time -->
											{#if method.processingTime}
												<div class="flex items-center gap-1">
													<span class="text-gray-400">Proses:</span>
													<span class="font-medium text-blue-400">{method.processingTime}</span>
												</div>
											{/if}
										</div>

										<!-- Availability Status -->
										<div class="flex items-center gap-1">
											<div class="h-2 w-2 rounded-full {method.available ? 'bg-green-500' : 'bg-red-500'}"></div>
											<span class="text-xs font-medium {method.available ? 'text-green-400' : 'text-red-400'}">
												{method.available ? 'Tersedia' : 'Tidak Tersedia'}
											</span>
										</div>
									</div>
								</div>

								<!-- Hover Effect Overlay -->
								{#if method.available && !disabled}
									<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Selected Method Summary -->
		{#if selectedMethod}
			<div class="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4" transition:fly={{ y: -100, duration: 150 }}>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<CheckCircleSolid class="h-5 w-5 flex-shrink-0 text-orange-500" />
						<div>
							<p class="text-sm font-medium text-orange-400">Metode Terpilih:</p>
							<p class="font-semibold text-white">{selectedMethod.name}</p>
						</div>
					</div>
					<div class="text-right">
						<p class="text-sm text-gray-400">Biaya Admin</p>
						<p class="font-semibold {(selectedMethod.fee ?? 0) === 0 ? 'text-green-400' : 'text-yellow-400'}">
							{formatFee(selectedMethod.fee)}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Footer Slot -->
		<slot name="footer">
			<!-- Default footer content (empty by default) -->
		</slot>
	</div>
</Container>