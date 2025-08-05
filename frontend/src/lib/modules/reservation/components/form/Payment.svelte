<script lang="ts">
	import { onMount } from 'svelte';
	import { Container, Input, Button } from '$lib/components/atoms';
	import { PaymentMethod } from '$lib/components/molecules';
	import { CheckCircleSolid, TagSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { fly, fade } from 'svelte/transition';
	
	// Import stores and services
	import {
		paymentFormStore,
		paymentFormData,
		paymentFormErrors,
		paymentFormIsValid,
		paymentFormIsSubmitting,
		selectedPaymentMethod,
		paymentFinalAmount,
		paymentAdminFee
	} from '../../stores/form/payment';
	import { PaymentService } from '../../service/payment.service';
	import type { PaymentMethod as PaymentMethodType } from '$lib/types';

	// Props
	export let totalAmount: number = 0;
	export let disabled: boolean = false;
	export let showPromoCode: boolean = true;
	export let showTermsCheckbox: boolean = true;
	export let showNotes: boolean = true;
	export let minHeight: string = 'auto';
	export let height: string = 'auto';
	export let maxHeight: string = '40vh';
	
	// Event callbacks
	export let onPaymentMethodSelected: ((method: PaymentMethodType) => void) | undefined = undefined;
	export let onValidationChange: ((isValid: boolean) => void) | undefined = undefined;
	export let onFormSubmit: (() => void) | undefined = undefined;

	// Local state
	let availablePaymentMethods: PaymentMethodType[] = [];
	let isLoadingMethods = true;
	let promoCodeInput = '';
	let promoCodeMessage = '';
	let promoCodeValid = false;
	let isValidatingPromo = false;

	// Reactive statements
	$: {
		// Update total amount when prop changes
		if (totalAmount !== $paymentFormData.totalAmount) {
			paymentFormStore.setTotalAmount(totalAmount);
		}
	}

	$: {
		// Notify parent of validation changes
		onValidationChange?.($paymentFormIsValid);
	}

	// Load payment methods on mount
	onMount(async () => {
		try {
			availablePaymentMethods = await PaymentService.getAvailablePaymentMethods();
		} catch (error) {
			console.error('Failed to load payment methods:', error);
		} finally {
			isLoadingMethods = false;
		}
	});

	// Event handlers
	function handlePaymentMethodSelected(method: PaymentMethodType) {
		paymentFormStore.setPaymentMethod(method);
		onPaymentMethodSelected?.(method);
	}

	function handlePaymentMethodDeselected() {
		paymentFormStore.setPaymentMethod(null);
	}

	async function handleApplyPromoCode() {
		if (!promoCodeInput.trim()) return;

		isValidatingPromo = true;
		promoCodeMessage = '';

		try {
			const result = await PaymentService.validatePromoCode(promoCodeInput.trim());
			
			if (result.valid) {
				promoCodeValid = true;
				promoCodeMessage = result.message || 'Kode promo berhasil diterapkan';
				paymentFormStore.applyPromoCode(promoCodeInput.trim());
			} else {
				promoCodeValid = false;
				promoCodeMessage = result.message || 'Kode promo tidak valid';
			}
		} catch (error) {
			promoCodeValid = false;
			promoCodeMessage = 'Gagal memvalidasi kode promo';
		} finally {
			isValidatingPromo = false;
		}
	}

	function handleNotesChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		paymentFormStore.updateField('customerNotes', target.value);
	}

	function handleTermsChange(event: Event) {
		const target = event.target as HTMLInputElement;
		paymentFormStore.updateField('agreeToTerms', target.checked);
	}

	function handleSubmit() {
		paymentFormStore.validateAll();
		if ($paymentFormIsValid) {
			onFormSubmit?.();
		}
	}
</script>

<div
	class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 xl:grid-cols-5"
	in:fly={{ x: 300, duration: 300 }}
>
	<!-- Payment Method Selection -->
	<div class="order-2 min-w-0 lg:order-1 xl:col-span-2">
		<div class="space-y-4">
			{#if isLoadingMethods}
				<div class="flex items-center justify-center py-8">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
					<span class="ml-3 text-gray-300">Memuat metode pembayaran...</span>
				</div>
			{:else}
				<PaymentMethod
					paymentMethods={availablePaymentMethods}
					selectedMethod={$selectedPaymentMethod}
					{disabled}
					{minHeight}
					{height}
					{maxHeight}
					onMethodSelected={handlePaymentMethodSelected}
					onMethodDeselected={handlePaymentMethodDeselected}
				>
					<div slot="header">
						<div class="border-b border-gray-700 pb-4 text-center">
							<h3 class="mb-2 text-2xl font-bold text-white">Metode Pembayaran</h3>
							<p class="text-gray-300">Pilih metode pembayaran yang Anda inginkan</p>
						</div>
					</div>
				</PaymentMethod>
			{/if}

			<!-- Payment Method Error -->
			{#if $paymentFormErrors.selectedMethod}
				<div class="flex items-center gap-2 text-red-400 text-sm" transition:fade>
					<ExclamationCircleSolid class="h-4 w-4" />
					<span>{$paymentFormErrors.selectedMethod}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Payment Details Form -->
	<div class="order-1 min-w-0 lg:order-2 xl:col-span-3">
		<Container
			variant="elegant"
			size="full"
			padding="xl"
			scrollable={true}
			class="col-span-2 h-full max-h-[65vh] w-full"
		>
			<div
				class="space-y-6 pb-4 pr-3"
				on:wheel|stopPropagation
				on:touchmove|stopPropagation
				role="region"
				aria-label="Payment details form"
			>
				<h2 class="mb-6 text-xl font-semibold text-white">Payment Details</h2>

				<div class="space-y-6">
					<!-- Promo Code Section -->
					{#if showPromoCode}
						<div class="space-y-4">
							<div class="flex items-center gap-2">
								<TagSolid class="h-5 w-5 text-orange-400" />
								<h4 class="text-lg font-semibold text-white">Kode Promo</h4>
							</div>

							<div class="flex gap-3">
								<div class="flex-1">
									<Input
										type="text"
										placeholder="Masukkan kode promo"
										bind:value={promoCodeInput}
										disabled={disabled || isValidatingPromo}
										class="w-full"
									/>
								</div>
								<Button
									variant="primary"
									size="md"
									disabled={disabled || !promoCodeInput.trim() || isValidatingPromo}
									onclick={handleApplyPromoCode}
									class="whitespace-nowrap"
								>
									{#if isValidatingPromo}
										<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
									{/if}
									Terapkan
								</Button>
							</div>

							{#if promoCodeMessage}
								<div 
									class="flex items-center gap-2 text-sm {promoCodeValid ? 'text-green-400' : 'text-red-400'}"
									transition:fade
								>
									<CheckCircleSolid class="h-4 w-4" />
									<span>{promoCodeMessage}</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Customer Notes -->
					{#if showNotes}
						<div class="space-y-4">
							<h4 class="text-lg font-semibold text-white">Catatan Tambahan</h4>
							<textarea
								class="w-full min-h-[100px] p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-vertical"
								placeholder="Tambahkan catatan khusus untuk pesanan Anda (opsional)"
								value={$paymentFormData.customerNotes}
								{disabled}
								on:input={handleNotesChange}
							></textarea>
						</div>
					{/if}

					<!-- Payment Summary -->
					{#if $selectedPaymentMethod}
						<div class="space-y-4">
							<h4 class="text-lg font-semibold text-white">Ringkasan Pembayaran</h4>
							
							<div class="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
								<div class="flex justify-between items-center">
									<span class="text-gray-300">Subtotal</span>
									<span class="text-white font-medium">{PaymentService.formatCurrency($paymentFormData.totalAmount)}</span>
								</div>
								
								{#if $paymentAdminFee > 0}
									<div class="flex justify-between items-center">
										<span class="text-gray-300">Biaya Admin ({$selectedPaymentMethod.name})</span>
										<span class="text-yellow-400 font-medium">{PaymentService.formatCurrency($paymentAdminFee)}</span>
									</div>
								{/if}
								
								<div class="border-t border-gray-600 pt-3">
									<div class="flex justify-between items-center">
										<span class="text-lg font-semibold text-white">Total Pembayaran</span>
										<span class="text-xl font-bold text-orange-400">{PaymentService.formatCurrency($paymentFinalAmount)}</span>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Terms and Conditions -->
					{#if showTermsCheckbox}
						<div class="space-y-4">
							<label class="flex items-start gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={$paymentFormData.agreeToTerms}
									{disabled}
									on:change={handleTermsChange}
									class="mt-1 h-4 w-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
								/>
								<div class="text-sm text-gray-300">
									Saya menyetujui 
									<a href="/terms" class="text-orange-400 hover:text-orange-300 underline" target="_blank">
										syarat dan ketentuan
									</a> 
									serta 
									<a href="/privacy" class="text-orange-400 hover:text-orange-300 underline" target="_blank">
										kebijakan privasi
									</a> 
									yang berlaku.
								</div>
							</label>

							{#if $paymentFormErrors.agreeToTerms}
								<div class="flex items-center gap-2 text-red-400 text-sm" transition:fade>
									<ExclamationCircleSolid class="h-4 w-4" />
									<span>{$paymentFormErrors.agreeToTerms}</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Submit Button Slot -->
					<slot name="submit" {handleSubmit} isValid={$paymentFormIsValid} isSubmitting={$paymentFormIsSubmitting}>
						<!-- Default submit button -->
						<Button
							variant="primary"
							size="lg"
							disabled={disabled || !$paymentFormIsValid || $paymentFormIsSubmitting}
							onclick={handleSubmit}
							class="w-full"
						>
							{#if $paymentFormIsSubmitting}
								<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
							{/if}
							Lanjutkan Pembayaran
						</Button>
					</slot>
				</div>
			</div>
		</Container>
	</div>
</div>