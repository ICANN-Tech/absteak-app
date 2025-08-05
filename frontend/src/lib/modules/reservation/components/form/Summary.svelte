<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { Container, Button } from '$lib/components/atoms';
	import { createEventDispatcher } from 'svelte';
	import {
		MapPinSolid,
		PhoneSolid,
		CheckCircleSolid,
		UsersSolid,
		HomeSolid,
		BuildingSolid,
		CalendarMonthSolid,
		ClockSolid,
		EditOutline,
		CreditCardSolid,
		TagSolid,
		FileLinesSolid
	} from 'flowbite-svelte-icons';

	// Import stores
	import {
		personalFormData,
		selectedBranch,
		selectedOutlet
	} from '../../stores/form/personal';
	import {
		paymentFormData,
		paymentFormIsValid,
		paymentFormIsSubmitting
	} from '../../stores/form/payment';
	import { PaymentService } from '../../service/payment.service';

	// Props
	export let reservationDate: string = '';
	export let reservationTime: string = '';
	export let disabled: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		editBranch: void;
		editOutlet: void;
		editDateTime: void;
		editPersonalInfo: void;
		editPayment: void;
		confirmReservation: void;
	}>();

	// Helper functions
	function getTypeIcon(type: string) {
		switch (type) {
			case 'indoor':
				return HomeSolid;
			case 'outdoor':
				return BuildingSolid;
			case 'private':
				return UsersSolid;
			default:
				return HomeSolid;
		}
	}

	function getTypeLabel(type: string): string {
		switch (type) {
			case 'indoor':
				return 'Indoor';
			case 'outdoor':
				return 'Outdoor';
			case 'private':
				return 'Private Room';
			default:
				return 'Indoor';
		}
	}

	function getPriceRangeColor(priceRange: string): string {
		switch (priceRange) {
			case 'Standard':
				return 'text-green-400';
			case 'Premium':
				return 'text-yellow-400';
			case 'Luxury':
				return 'text-purple-400';
			default:
				return 'text-gray-400';
		}
	}

	function formatDate(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatTime(timeString: string): string {
		if (!timeString) return '';
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	}

	// Computed values
	$: isComplete = $selectedBranch && $selectedOutlet && $personalFormData.customerName && 
		$personalFormData.customerEmail && $personalFormData.customerPhone && $paymentFormData.selectedMethod;

	// Event handlers
	function handleConfirmReservation() {
		if (isComplete && $paymentFormIsValid) {
			dispatch('confirmReservation');
		}
	}
</script>

<div
	class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 xl:grid-cols-5"
	in:fly={{ x: 300, duration: 300 }}
>
	<!-- Reservation Review -->
	<div class="order-2 min-w-0 lg:order-1 xl:col-span-2">
		<Container variant="elegant" size="full" padding="xl" class="h-full w-full">
			<div class="space-y-6">
				<!-- Header -->
				<div class="border-b border-gray-700 pb-4 text-center">
					<h3 class="mb-2 text-2xl font-bold text-white">Review Reservasi</h3>
					<p class="text-gray-300">Periksa kembali detail reservasi Anda</p>
				</div>

				<div
					class="custom-scrollbar max-h-[50vh] space-y-6 overflow-y-auto pr-2"
					on:wheel|stopPropagation
					on:touchmove|stopPropagation
					role="region"
					aria-label="Reservation review"
				>
					<!-- Branch Information -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
								<CheckCircleSolid class="h-5 w-5 text-orange-500" />
								Cabang
							</h4>
							<button
								class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"
								on:click={() => dispatch('editBranch')}
								{disabled}
							>
								<EditOutline class="h-3 w-3" />
								<span class="text-xs">Edit</span>
							</button>
						</div>

						{#if $selectedBranch}
							<div class="rounded-lg border border-gray-700 bg-white/5 p-4">
								<h5 class="font-semibold text-white">{$selectedBranch.name}</h5>
								<div class="mt-2 flex items-start gap-2 text-gray-300">
									<MapPinSolid class="mt-0.5 h-4 w-4 flex-shrink-0" />
									<span class="text-sm">{$selectedBranch.address}</span>
								</div>
								{#if $selectedBranch.phone}
									<div class="mt-2 flex items-center gap-2 text-gray-300">
										<PhoneSolid class="h-4 w-4 flex-shrink-0" />
										<span class="text-sm">{$selectedBranch.phone}</span>
									</div>
								{/if}
							</div>
						{:else}
							<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
								<p class="text-sm text-red-400">Cabang belum dipilih</p>
							</div>
						{/if}
					</div>

					<!-- Outlet Information -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
								<CheckCircleSolid class="h-5 w-5 text-orange-500" />
								Outlet
							</h4>
							<button
								class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"
								on:click={() => dispatch('editOutlet')}
								{disabled}
							>
								<EditOutline class="h-3 w-3" />
								<span class="text-xs">Edit</span>
							</button>
						</div>

						{#if $selectedOutlet}
							<div class="rounded-lg border border-gray-700 bg-white/5 p-4">
								<div class="flex items-start justify-between">
									<div class="flex items-center gap-2">
										<svelte:component
											this={getTypeIcon($selectedOutlet.type)}
											class="h-5 w-5 flex-shrink-0 text-orange-400"
										/>
										<div>
											<h5 class="font-semibold text-white">{$selectedOutlet.name}</h5>
											<p class="text-sm text-gray-400">{getTypeLabel($selectedOutlet.type)}</p>
										</div>
									</div>
									{#if $selectedOutlet.priceRange}
										<span
											class="rounded-full bg-gray-800 px-2 py-1 text-xs font-medium {getPriceRangeColor(
												$selectedOutlet.priceRange
											)}"
										>
											{$selectedOutlet.priceRange}
										</span>
									{/if}
								</div>

								<div class="mt-2 flex items-center gap-2 text-gray-300">
									<UsersSolid class="h-4 w-4 flex-shrink-0" />
									<span class="text-sm">Kapasitas: {$selectedOutlet.capacity} orang</span>
								</div>
							</div>
						{:else}
							<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
								<p class="text-sm text-red-400">Outlet belum dipilih</p>
							</div>
						{/if}
					</div>

					<!-- Date & Time Information -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
								<CalendarMonthSolid class="h-5 w-5 text-orange-500" />
								Tanggal & Waktu
							</h4>
							<button
								class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"
								on:click={() => dispatch('editDateTime')}
								{disabled}
							>
								<EditOutline class="h-3 w-3" />
								<span class="text-xs">Edit</span>
							</button>
						</div>

						<div class="rounded-lg border border-gray-700 bg-white/5 p-4">
							<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div class="flex items-center gap-2">
									<CalendarMonthSolid class="h-4 w-4 flex-shrink-0 text-orange-400" />
									<div>
										<p class="text-xs text-gray-400">Tanggal</p>
										<p class="text-sm font-medium text-white">
											{reservationDate ? formatDate(reservationDate) : 'Belum dipilih'}
										</p>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<ClockSolid class="h-4 w-4 flex-shrink-0 text-orange-400" />
									<div>
										<p class="text-xs text-gray-400">Waktu</p>
										<p class="text-sm font-medium text-white">
											{reservationTime ? formatTime(reservationTime) : 'Belum dipilih'}
										</p>
									</div>
								</div>

								<div class="flex items-center gap-2 sm:col-span-2">
									<UsersSolid class="h-4 w-4 flex-shrink-0 text-orange-400" />
									<div>
										<p class="text-xs text-gray-400">Jumlah Tamu</p>
										<p class="text-sm font-medium text-white">{$personalFormData.partySize} orang</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Personal Information -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
								<UsersSolid class="h-5 w-5 text-orange-500" />
								Informasi Pribadi
							</h4>
							<button
								class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"
								on:click={() => dispatch('editPersonalInfo')}
								{disabled}
							>
								<EditOutline class="h-3 w-3" />
								<span class="text-xs">Edit</span>
							</button>
						</div>

						<div class="rounded-lg border border-gray-700 bg-white/5 p-4">
							<div class="grid grid-cols-1 gap-3">
								<div>
									<p class="text-xs text-gray-400">Nama Lengkap</p>
									<p class="text-sm font-medium text-white">{$personalFormData.customerName || 'Belum diisi'}</p>
								</div>

								<div>
									<p class="text-xs text-gray-400">Email</p>
									<p class="text-sm font-medium text-white">{$personalFormData.customerEmail || 'Belum diisi'}</p>
								</div>

								<div>
									<p class="text-xs text-gray-400">Nomor Telepon</p>
									<p class="text-sm font-medium text-white">{$personalFormData.customerPhone || 'Belum diisi'}</p>
								</div>

								{#if $personalFormData.specialRequests}
									<div>
										<p class="text-xs text-gray-400">Permintaan Khusus</p>
										<p class="text-sm font-medium text-white">{$personalFormData.specialRequests}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Container>
	</div>

	<!-- Payment Confirmation -->
	<div class="order-1 min-w-0 lg:order-2 xl:col-span-3">
		<Container
			variant="elegant"
			size="full"
			padding="xl"
			scrollable={true}
			class="h-full max-h-[65vh] w-full"
		>
			<div
				class="space-y-6 pb-4 pr-3"
				on:wheel|stopPropagation
				on:touchmove|stopPropagation
				role="region"
				aria-label="Payment confirmation"
			>
				<div class="border-b border-gray-700 pb-4 text-center">
					<h2 class="mb-2 text-2xl font-bold text-white">Konfirmasi Pembayaran</h2>
					<p class="text-gray-300">Review detail pembayaran dan konfirmasi reservasi</p>
				</div>

				<div class="space-y-6">
					<!-- Payment Method -->
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
								<CreditCardSolid class="h-5 w-5 text-orange-500" />
								Metode Pembayaran
							</h4>
							<button
								class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"
								on:click={() => dispatch('editPayment')}
								{disabled}
							>
								<EditOutline class="h-3 w-3" />
								<span class="text-xs">Edit</span>
							</button>
						</div>

						{#if $paymentFormData.selectedMethod}
							<div class="rounded-lg border border-gray-700 bg-white/5 p-4">
								<div class="flex items-center gap-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
										<CreditCardSolid class="h-6 w-6 text-orange-400" />
									</div>
									<div>
										<h5 class="font-semibold text-white">{$paymentFormData.selectedMethod.name}</h5>
										<p class="text-sm text-gray-400">{$paymentFormData.selectedMethod.description}</p>
									</div>
								</div>
							</div>
						{:else}
							<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
								<p class="text-sm text-red-400">Metode pembayaran belum dipilih</p>
							</div>
						{/if}
					</div>

					<!-- Promo Code -->
					{#if $paymentFormData.promoCode}
						<div class="space-y-4">
							<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
								<TagSolid class="h-5 w-5 text-orange-500" />
								Kode Promo
							</h4>

							<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
								<div class="flex items-center gap-3">
									<CheckCircleSolid class="h-5 w-5 text-green-400" />
									<div>
										<p class="font-semibold text-green-400">{$paymentFormData.promoCode}</p>
										<p class="text-sm text-green-300">Kode promo berhasil diterapkan</p>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Customer Notes -->
					{#if $paymentFormData.customerNotes}
						<div class="space-y-4">
							<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
							<FileLinesSolid class="h-5 w-5 text-orange-500" />
							Catatan Tambahan
						</h4>

							<div class="rounded-lg border border-gray-700 bg-white/5 p-4">
								<p class="text-sm text-gray-300">{$paymentFormData.customerNotes}</p>
							</div>
						</div>
					{/if}

					<!-- Payment Summary -->
					<div class="space-y-4">
						<h4 class="flex items-center gap-2 text-lg font-semibold text-white">
							<CheckCircleSolid class="h-5 w-5 text-orange-500" />
							Ringkasan Pembayaran
						</h4>
						
						<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
							<div class="space-y-4">
								<div class="flex justify-between items-center">
									<span class="text-gray-300">Subtotal</span>
									<span class="text-white font-medium">{PaymentService.formatCurrency($paymentFormData.totalAmount)}</span>
								</div>
								
								{#if $paymentFormData.adminFee > 0}
									<div class="flex justify-between items-center">
										<span class="text-gray-300">Biaya Admin ({$paymentFormData.selectedMethod?.name})</span>
										<span class="text-yellow-400 font-medium">{PaymentService.formatCurrency($paymentFormData.adminFee)}</span>
									</div>
								{/if}
								
								<div class="border-t border-gray-600 pt-4">
									<div class="flex justify-between items-center">
										<span class="text-xl font-semibold text-white">Total Pembayaran</span>
										<span class="text-2xl font-bold text-orange-400">{PaymentService.formatCurrency($paymentFormData.finalAmount)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Terms Confirmation -->
					<div class="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
						<div class="flex items-start gap-3">
							<CheckCircleSolid class="mt-0.5 h-5 w-5 text-blue-400" />
							<div class="text-sm text-blue-300">
								<p class="font-medium">Syarat dan Ketentuan</p>
								<p class="mt-1">Anda telah menyetujui syarat dan ketentuan serta kebijakan privasi yang berlaku.</p>
							</div>
						</div>
					</div>

					<!-- Confirmation Status -->
					{#if isComplete}
						<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-6" transition:fade>
							<div class="mb-4 flex items-center gap-3">
								<CheckCircleSolid class="h-6 w-6 text-green-500" />
								<h5 class="text-lg font-semibold text-green-400">Siap untuk Konfirmasi</h5>
							</div>
							<p class="text-sm text-green-300">
								Semua informasi telah lengkap. Klik tombol di bawah untuk mengkonfirmasi reservasi Anda.
							</p>
						</div>

						<Button
							variant="primary"
							size="lg"
							disabled={disabled || !$paymentFormIsValid || $paymentFormIsSubmitting}
							onclick={handleConfirmReservation}
							class="w-full"
						>
							{#if $paymentFormIsSubmitting}
								<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
							{/if}
							<CheckCircleSolid class="h-5 w-5 mr-2" />
							Konfirmasi Reservasi
						</Button>
					{:else}
						<div class="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6" transition:fade>
							<div class="mb-4 flex items-center gap-3">
								<EditOutline class="h-6 w-6 text-yellow-500" />
								<h5 class="text-lg font-semibold text-yellow-400">Informasi Belum Lengkap</h5>
							</div>
							<p class="text-sm text-yellow-300">
								Mohon lengkapi semua informasi yang diperlukan sebelum melanjutkan konfirmasi.
							</p>
						</div>

						<Button
							variant="warning"
							size="lg"
							disabled={true}
							class="w-full"
						>
							<EditOutline class="h-5 w-5 mr-2" />
							Lengkapi Informasi Terlebih Dahulu
						</Button>
					{/if}
				</div>
			</div>
		</Container>
	</div>
</div>