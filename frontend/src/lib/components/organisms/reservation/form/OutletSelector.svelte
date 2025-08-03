<script module lang="ts">
	export interface Outlet {
		id: string;
		name: string;
		branchId: string;
		type: 'indoor' | 'outdoor' | 'private';
		capacity: number;
		features: string[];
		available: boolean;
		priceRange?: string;
	}
</script>

<script lang="ts">
	import { Container } from '$lib/components/atoms';
	import { fly } from 'svelte/transition';
	import { CheckCircleSolid, UsersSolid, HomeSolid, BuildingSolid } from 'flowbite-svelte-icons';
	
	// Define Branch interface locally since it's not exported from BranchSelector
	interface Branch {
		id: string;
		name: string;
		location: string;
		available: boolean;
	}

	// Props
	interface Props {
		outlets?: Outlet[];
		selectedBranch?: Branch | null;
		selectedOutlet?: Outlet | null;
		disabled?: boolean;
		title?: string;
		subtitle?: string;
		showBackButton?: boolean;
		loading?: boolean;
	}

	let {
		outlets = [],
		selectedBranch = null,
		selectedOutlet = null,
		disabled = false,
		title = 'Pilih Outlet',
		subtitle = '',
		showBackButton = false,
		loading = false
	}: Props = $props();

	// Events
	const events = {
		outletSelected: (outlet: Outlet) => {},
		outletDeselected: () => {},
		back: () => {}
	};

	const availableOutlets = $derived(
		selectedBranch ? outlets.filter((outlet) => outlet.branchId === selectedBranch.id) : []
	);

	const isDisabled = $derived(disabled || !selectedBranch);

	const selectOutlet = (outlet: Outlet) => {
		if (isDisabled || !outlet.available) return;

		if (selectedOutlet?.id === outlet.id) {
			selectedOutlet = null;
			events.outletDeselected();
		} else {
			selectedOutlet = outlet;
			events.outletSelected(outlet);
		}
	}

	const isSelected = (outlet: Outlet): boolean => {
		return selectedOutlet?.id === outlet.id;
	};

	const getOutletClasses = (outlet: Outlet): string => {
		const baseClasses =
			'relative p-6 rounded-xl border transition-all duration-500 ease-out cursor-pointer group backdrop-blur-sm';

		if (!outlet.available) {
			return `${baseClasses} border-white/10 bg-white/5 opacity-50 cursor-not-allowed`;
		}

		if (isDisabled) {
			return `${baseClasses} border-white/10 bg-white/5 opacity-50 cursor-not-allowed`;
		}

		if (isSelected(outlet)) {
			return `${baseClasses} border-orange-400/50 bg-orange-400/15 shadow-2xl shadow-orange-400/20 scale-[1.02] backdrop-blur-xl`;
		}

		return `${baseClasses} border-white/15 bg-white/8 hover:border-orange-400/30 hover:bg-orange-400/10 hover:scale-[1.01] hover:shadow-xl hover:shadow-orange-400/10 hover:backdrop-blur-xl`;
	}

	const getTypeIcon = (type: string) => {
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

	const getTypeLabel = (type: string): string => {
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

	const getPriceRangeColor = (priceRange: string): string => {
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
</script>

<Container variant="elegant" size="full" padding="xl" scrollable={true} class="w-full h-full">
	{#snippet children()}
		<div 
				class="space-y-6"
				on:wheel|stopPropagation
				on:touchmove|stopPropagation
				aria-label="Branch selection"
		>
			<!-- Header -->
			<header class="text-center space-y-4">
				<div class="flex items-center justify-center gap-4">
					{#if showBackButton}
						<button
							on:click={() => events.back()}
							class="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
							aria-label="Back"
						>
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
							</svg>
						</button>
					{/if}
					<h3 class="text-2xl font-bold text-white">{title}</h3>
				</div>
				<p class="text-gray-300">
					{#if subtitle}
						{subtitle}
					{:else if !selectedBranch}
						Silakan pilih cabang terlebih dahulu
					{:else}
						Pilih outlet di {selectedBranch.name}
					{/if}
				</p>
			</header>

			<!-- Content Area -->
			<main class="space-y-6">
				<!-- Loading State -->
				{#if loading}
					<div class="py-12 text-center">
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
							<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30"></div>
						</div>
						<p class="text-lg text-gray-300">Loading outlets...</p>
					</div>
				<!-- No Branch Selected State -->
				{:else if !selectedBranch}
					<div class="py-12 text-center">
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
							<BuildingSolid class="h-8 w-8 text-gray-300" />
						</div>
						<p class="text-lg text-gray-300">
							Pilih cabang terlebih dahulu untuk melihat outlet yang tersedia
						</p>
					</div>
				{:else if availableOutlets.length === 0}
					<!-- No Outlets Available -->
					<div class="py-12 text-center">
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
							<BuildingSolid class="h-8 w-8 text-gray-300" />
						</div>
						<p class="text-lg text-gray-300">Tidak ada outlet tersedia di cabang ini</p>
					</div>
				{:else}
					<!-- Outlet List -->
					<div class="space-y-4">
						{#each availableOutlets as outlet (outlet.id)}
							<button
								type="button"
								class={`${getOutletClasses(outlet)} w-full text-left`}
								on:click={() => selectOutlet(outlet)}
								on:keydown={(e) => e.key === 'Enter' && selectOutlet(outlet)}
								tabindex={isDisabled || !outlet.available ? -1 : 0}
							>
								<!-- Selection Indicator -->
								{#if isSelected(outlet)}
									<div class="absolute right-4 top-4">
										<CheckCircleSolid class="h-6 w-6 text-orange-400" />
									</div>
								{/if}

								<!-- Outlet Info -->
								<div class="space-y-4">
									<!-- Outlet Name & Type -->
									<div class="flex items-start justify-between">
										<div class="flex items-center gap-3">
											<svelte:component
												this={getTypeIcon(outlet.type)}
												class="h-6 w-6 flex-shrink-0 text-orange-400"
											/>
											<div>
												<h4 class="text-xl font-semibold text-white transition-colors group-hover:text-orange-400">
													{outlet.name}
												</h4>
												<p class="text-sm text-gray-400">{getTypeLabel(outlet.type)}</p>
											</div>
										</div>
										{#if outlet.priceRange}
											<span class="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium {getPriceRangeColor(outlet.priceRange)}">
												{outlet.priceRange}
											</span>
										{/if}
									</div>

									<!-- Capacity -->
									<div class="flex items-center gap-3 text-gray-300">
										<UsersSolid class="h-5 w-5 flex-shrink-0" />
										<span class="text-sm">Kapasitas: {outlet.capacity} orang</span>
									</div>

									<!-- Features -->
									{#if outlet.features.length > 0}
										<div class="space-y-2">
											<p class="text-sm font-medium text-gray-400">Fasilitas:</p>
											<div class="flex flex-wrap gap-2">
												{#each outlet.features as feature}
													<span class="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1 text-xs text-gray-300">
														{feature}
													</span>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Availability Status -->
									<div class="flex items-center gap-2">
										<div class="h-2 w-2 rounded-full {outlet.available ? 'bg-green-400' : 'bg-red-400'}"></div>
										<span class="text-xs font-medium {outlet.available ? 'text-green-400' : 'text-red-400'}">
											{outlet.available ? 'Tersedia' : 'Tidak Tersedia'}
										</span>
									</div>
								</div>

								<!-- Hover Effect Overlay -->
								{#if outlet.available && !isDisabled}
									<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
								{/if}
							</button>
						{/each}
					</div>

					<!-- Selected Outlet Summary -->
					{#if selectedOutlet}
						<div class="mt-6 rounded-xl border border-orange-400/30 bg-orange-400/10 backdrop-blur-sm p-4">
							<div class="flex items-center gap-3">
								<CheckCircleSolid class="h-5 w-5 flex-shrink-0 text-orange-400" />
								<div>
									<p class="text-sm font-medium text-orange-400">Outlet Terpilih:</p>
									<p class="font-semibold text-white">{selectedOutlet.name}</p>
									<p class="text-sm text-gray-300">
										{getTypeLabel(selectedOutlet.type)} • Kapasitas {selectedOutlet.capacity} orang
									</p>
								</div>
							</div>
						</div>
					{/if}
				{/if}
			</main>
		</div>
	{/snippet}
</Container>
