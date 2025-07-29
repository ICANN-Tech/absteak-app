<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Container } from '$lib/components/atoms';
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
		EditOutline
	} from 'flowbite-svelte-icons';
	import type { Branch } from './BranchSelector.svelte';
	import type { Outlet } from './OutletSelector.svelte';

	// Props
	export let selectedBranch: Branch | null = null;
	export let selectedOutlet: Outlet | null = null;
	export let reservationDate: string = '';
	export let reservationTime: string = '';
	export let partySize: number = 2;
	export let customerName: string = '';
	export let customerEmail: string = '';
	export let customerPhone: string = '';
	export let specialRequests: string = '';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		editBranch: void;
		editOutlet: void;
		editDateTime: void;
		editPersonalInfo: void;
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

	// Computed
	$: isComplete =
		selectedBranch &&
		selectedOutlet &&
		reservationDate &&
		reservationTime &&
		customerName &&
		customerEmail &&
		customerPhone;
</script>

<Container variant="elegant" size="full" padding="xl" class="col-span-3 h-full w-full">
	<div class="space-y-8">
		<!-- Header -->
		<div class="border-b border-gray-700 pb-6 text-center">
			<h3 class="mb-2 text-3xl font-bold text-white">Review Reservasi</h3>
			<p class="text-gray-300">Periksa kembali detail reservasi Anda sebelum melanjutkan</p>
		</div>
	</div>

	<div
		class="custom-scrollbar min-h-[30vh] max-h-[40vh] space-y-6 overflow-y-auto pr-2"
		on:wheel|stopPropagation
		on:touchmove|stopPropagation
		tabindex="0"
		role="region"
		aria-label="Outlet selection"
	>
		<!-- Branch Information -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h4 class="flex items-center gap-3 text-xl font-semibold text-white">
					<CheckCircleSolid class="h-6 w-6 text-orange-500" />
					Cabang Terpilih
				</h4>
				<button
					class="flex items-center gap-2 text-orange-400 transition-colors hover:text-orange-300"
					on:click={() => dispatch('editBranch')}
				>
					<EditOutline class="h-4 w-4" />
					Edit
				</button>
			</div>

			{#if selectedBranch}
				<div class="rounded-lg border border-gray-700 bg-white/5 p-6">
					<div class="space-y-4">
						<h5 class="text-lg font-semibold text-white">{selectedBranch.name}</h5>

						<div class="flex items-start gap-3 text-gray-300">
							<MapPinSolid class="mt-0.5 h-5 w-5 flex-shrink-0" />
							<span class="text-sm">{selectedBranch.address}</span>
						</div>

						{#if selectedBranch.phone}
							<div class="flex items-center gap-3 text-gray-300">
								<PhoneSolid class="h-5 w-5 flex-shrink-0" />
								<span class="text-sm">{selectedBranch.phone}</span>
							</div>
						{/if}

						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-xs font-medium text-green-400">Tersedia</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
					<p class="text-sm text-red-400">Cabang belum dipilih</p>
				</div>
			{/if}
		</div>

		<!-- Outlet Information -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h4 class="flex items-center gap-3 text-xl font-semibold text-white">
					<CheckCircleSolid class="h-6 w-6 text-orange-500" />
					Outlet Terpilih
				</h4>
				<button
					class="flex items-center gap-2 text-orange-400 transition-colors hover:text-orange-300"
					on:click={() => dispatch('editOutlet')}
				>
					<EditOutline class="h-4 w-4" />
					Edit
				</button>
			</div>

			{#if selectedOutlet}
				<div class="rounded-lg border border-gray-700 bg-white/5 p-6">
					<div class="space-y-4">
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-3">
								<svelte:component
									this={getTypeIcon(selectedOutlet.type)}
									class="h-6 w-6 flex-shrink-0 text-orange-400"
								/>
								<div>
									<h5 class="text-lg font-semibold text-white">{selectedOutlet.name}</h5>
									<p class="text-sm text-gray-400">{getTypeLabel(selectedOutlet.type)}</p>
								</div>
							</div>
							{#if selectedOutlet.priceRange}
								<span
									class="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium {getPriceRangeColor(
										selectedOutlet.priceRange
									)}"
								>
									{selectedOutlet.priceRange}
								</span>
							{/if}
						</div>

						<div class="flex items-center gap-3 text-gray-300">
							<UsersSolid class="h-5 w-5 flex-shrink-0" />
							<span class="text-sm">Kapasitas: {selectedOutlet.capacity} orang</span>
						</div>

						{#if selectedOutlet.features.length > 0}
							<div class="space-y-2">
								<p class="text-sm font-medium text-gray-400">Fasilitas:</p>
								<div class="flex flex-wrap gap-2">
									{#each selectedOutlet.features as feature}
										<span
											class="rounded-full border border-gray-600 bg-white/10 px-3 py-1 text-xs text-gray-300"
										>
											{feature}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-xs font-medium text-green-400">Tersedia</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
					<p class="text-sm text-red-400">Outlet belum dipilih</p>
				</div>
			{/if}
		</div>

		<!-- Date & Time Information -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h4 class="flex items-center gap-3 text-xl font-semibold text-white">
					<CalendarMonthSolid class="h-6 w-6 text-orange-500" />
					Tanggal & Waktu
				</h4>
				<button
					class="flex items-center gap-2 text-orange-400 transition-colors hover:text-orange-300"
					on:click={() => dispatch('editDateTime')}
				>
					<EditOutline class="h-4 w-4" />
					Edit
				</button>
			</div>

			<div class="rounded-lg border border-gray-700 bg-white/5 p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="flex items-center gap-3">
						<CalendarMonthSolid class="h-5 w-5 flex-shrink-0 text-orange-400" />
						<div>
							<p class="text-sm text-gray-400">Tanggal</p>
							<p class="font-medium text-white">
								{reservationDate ? formatDate(reservationDate) : 'Belum dipilih'}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<ClockSolid class="h-5 w-5 flex-shrink-0 text-orange-400" />
						<div>
							<p class="text-sm text-gray-400">Waktu</p>
							<p class="font-medium text-white">
								{reservationTime ? formatTime(reservationTime) : 'Belum dipilih'}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<UsersSolid class="h-5 w-5 flex-shrink-0 text-orange-400" />
						<div>
							<p class="text-sm text-gray-400">Jumlah Tamu</p>
							<p class="font-medium text-white">{partySize} orang</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Personal Information -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h4 class="flex items-center gap-3 text-xl font-semibold text-white">
					<UsersSolid class="h-6 w-6 text-orange-500" />
					Informasi Pribadi
				</h4>
				<button
					class="flex items-center gap-2 text-orange-400 transition-colors hover:text-orange-300"
					on:click={() => dispatch('editPersonalInfo')}
				>
					<EditOutline class="h-4 w-4" />
					Edit
				</button>
			</div>

			<div class="rounded-lg border border-gray-700 bg-white/5 p-6">
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<p class="mb-1 text-sm text-gray-400">Nama Lengkap</p>
						<p class="font-medium text-white">{customerName || 'Belum diisi'}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-gray-400">Email</p>
						<p class="font-medium text-white">{customerEmail || 'Belum diisi'}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-gray-400">Nomor Telepon</p>
						<p class="font-medium text-white">{customerPhone || 'Belum diisi'}</p>
					</div>

					{#if specialRequests}
						<div class="md:col-span-2">
							<p class="mb-1 text-sm text-gray-400">Permintaan Khusus</p>
							<p class="font-medium text-white">{specialRequests}</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Summary & Action -->
		<div class="border-t border-gray-700 pt-6">
			{#if isComplete}
				<div class="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-6">
					<div class="mb-4 flex items-center gap-3">
						<CheckCircleSolid class="h-6 w-6 text-green-500" />
						<h5 class="text-lg font-semibold text-green-400">Reservasi Siap Dikonfirmasi</h5>
					</div>
					<p class="text-sm text-green-300">
						Semua informasi telah lengkap. Anda dapat melanjutkan ke pembayaran.
					</p>
				</div>

				<button
					class="flex w-full items-center justify-center gap-3 rounded-lg bg-orange-500 px-6 py-4 font-semibold text-white transition-colors duration-300 hover:bg-orange-600"
					on:click={() => dispatch('confirmReservation')}
				>
					<CheckCircleSolid class="h-5 w-5" />
					Konfirmasi Reservasi
				</button>
			{:else}
				<div class="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6">
					<div class="mb-4 flex items-center gap-3">
						<EditOutline class="h-6 w-6 text-yellow-500" />
						<h5 class="text-lg font-semibold text-yellow-400">Informasi Belum Lengkap</h5>
					</div>
					<p class="text-sm text-yellow-300">
						Mohon lengkapi semua informasi yang diperlukan sebelum melanjutkan.
					</p>
				</div>

				<button
					class="w-full cursor-not-allowed rounded-lg bg-gray-600 px-6 py-4 font-semibold text-gray-400"
					disabled
				>
					Lengkapi Informasi Terlebih Dahulu
				</button>
			{/if}
		</div>
	</div>
    
      {#if $$slots.footer}
   <div class="mt-6">
      <slot name="footer"></slot>
    </div>
  {/if}
</Container>
