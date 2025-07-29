<script context="module" lang="ts">
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
	import { createEventDispatcher } from 'svelte';
	import { CheckCircleSolid, UsersSolid, HomeSolid, BuildingSolid } from 'flowbite-svelte-icons';
	import type { Branch } from './BranchSelector.svelte';

	// Props
	export let outlets: Outlet[] = [
		{
			id: 'outlet-1',
			name: 'Main Dining Room',
			branchId: 'branch-1',
			type: 'indoor',
			capacity: 80,
			features: ['AC', 'Live Music', 'City View'],
			available: true,
			priceRange: 'Premium'
		},
		{
			id: 'outlet-2',
			name: 'Garden Terrace',
			branchId: 'branch-1',
			type: 'outdoor',
			capacity: 40,
			features: ['Garden View', 'Fresh Air', 'Romantic Setting'],
			available: true,
			priceRange: 'Premium'
		},
		{
			id: 'outlet-3',
			name: 'Private Room VIP',
			branchId: 'branch-1',
			type: 'private',
			capacity: 12,
			features: ['Private', 'Karaoke', 'Projector'],
			available: true,
			priceRange: 'Luxury'
		},
		{
			id: 'outlet-4',
			name: 'Main Hall',
			branchId: 'branch-2',
			type: 'indoor',
			capacity: 60,
			features: ['AC', 'Traditional Decor'],
			available: true,
			priceRange: 'Standard'
		},
		{
			id: 'outlet-5',
			name: 'Rooftop Dining',
			branchId: 'branch-2',
			type: 'outdoor',
			capacity: 30,
			features: ['Mountain View', 'Sunset View'],
			available: false,
			priceRange: 'Premium'
		}
	];
	export let selectedBranch: Branch | null = null;
	export let selectedOutlet: Outlet | null = null;
	export let disabled: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		outletSelected: Outlet;
		outletDeselected: void;
	}>();

	// Computed
	$: availableOutlets = selectedBranch
		? outlets.filter((outlet) => outlet.branchId === selectedBranch.id)
		: [];

	$: isDisabled = disabled || !selectedBranch;

	// Functions
	function selectOutlet(outlet: Outlet) {
		if (isDisabled || !outlet.available) return;

		if (selectedOutlet?.id === outlet.id) {
			selectedOutlet = null;
			dispatch('outletDeselected');
		} else {
			selectedOutlet = outlet;
			dispatch('outletSelected', outlet);
		}
	}

	function isSelected(outlet: Outlet): boolean {
		return selectedOutlet?.id === outlet.id;
	}

	function getOutletClasses(outlet: Outlet): string {
		const baseClasses =
			'relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group';

		if (!outlet.available) {
			return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
		}

		if (isDisabled) {
			return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
		}

		if (isSelected(outlet)) {
			return `${baseClasses} border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-[1.02]`;
		}

		return `${baseClasses} border-gray-700 bg-white/5 hover:border-orange-400 hover:bg-orange-400/5 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-400/10`;
	}

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
</script>

<Container variant="elegant" size="full" padding="xl" class="col-span-2 w-full h-full">
	<div 
		class="enhanced-scrollbar space-y-6 h-full max-h-[65vh] overflow-y-auto pr-3 pb-4"
		on:wheel|stopPropagation
		on:touchmove|stopPropagation
		tabindex="0"
		role="region"
		aria-label="Outlet selection"
	>
		<!-- Header -->
		<div class="text-center">
			<h3 class="mb-2 text-2xl font-bold text-white">Pilih Outlet</h3>
			<p class="text-gray-300">
				{#if !selectedBranch}
					Silakan pilih cabang terlebih dahulu
				{:else}
					Pilih outlet di {selectedBranch.name}
				{/if}
			</p>
		</div>

		<!-- No Branch Selected State -->
		{#if !selectedBranch}
			<div class="py-12 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-700"
				>
					<BuildingSolid class="h-8 w-8 text-gray-400" />
				</div>
				<p class="text-lg text-gray-400">
					Pilih cabang terlebih dahulu untuk melihat outlet yang tersedia
				</p>
			</div>
		{:else if availableOutlets.length === 0}
			<!-- No Outlets Available -->
			<div class="py-12 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-700"
				>
					<BuildingSolid class="h-8 w-8 text-gray-400" />
				</div>
				<p class="text-lg text-gray-400">Tidak ada outlet tersedia di cabang ini</p>
			</div>
		{:else}
			<!-- Outlet List -->
			<div class="grid grid-cols-2 gap-4 space-y-4">
				{#each availableOutlets as outlet (outlet.id)}
					<div
						class={getOutletClasses(outlet)}
						on:click={() => selectOutlet(outlet)}
						on:keydown={(e) => e.key === 'Enter' && selectOutlet(outlet)}
						role="button"
						tabindex={isDisabled || !outlet.available ? -1 : 0}
					>
						<!-- Selection Indicator -->
						{#if isSelected(outlet)}
							<div class="absolute right-4 top-4">
								<CheckCircleSolid class="h-6 w-6 text-orange-500" />
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
										<h4
											class="text-xl font-semibold text-white transition-colors group-hover:text-orange-400"
										>
											{outlet.name}
										</h4>
										<p class="text-sm text-gray-400">{getTypeLabel(outlet.type)}</p>
									</div>
								</div>
								{#if outlet.priceRange}
									<span
										class="rounded-full bg-gray-800 px-2 py-1 text-xs font-medium {getPriceRangeColor(
											outlet.priceRange
										)}"
									>
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
											<span
												class="rounded-full border border-gray-600 bg-white/10 px-3 py-1 text-xs text-gray-300"
											>
												{feature}
											</span>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Availability Status -->
							<div class="flex items-center gap-2">
								<div
									class="h-2 w-2 rounded-full {outlet.available ? 'bg-green-500' : 'bg-red-500'}"
								></div>
								<span
									class="text-xs font-medium {outlet.available ? 'text-green-400' : 'text-red-400'}"
								>
									{outlet.available ? 'Tersedia' : 'Tidak Tersedia'}
								</span>
							</div>
						</div>

						<!-- Hover Effect Overlay -->
						{#if outlet.available && !isDisabled}
							<div
								class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							></div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Selected Outlet Summary -->
			{#if selectedOutlet}
				<div class="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
					<div class="flex items-center gap-3">
						<CheckCircleSolid class="h-5 w-5 flex-shrink-0 text-orange-500" />
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
	</div>
</Container>

<style>
	/* Enhanced custom scrollbar untuk outlet list - lebih terlihat */
	.enhanced-scrollbar::-webkit-scrollbar {
		width: 12px;
	}

	.enhanced-scrollbar::-webkit-scrollbar-track {
		background: rgba(31, 41, 55, 0.8);
		border-radius: 6px;
		backdrop-filter: blur(4px);
		border: 1px solid rgba(75, 85, 99, 0.3);
	}

	.enhanced-scrollbar::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #f97316, #ea580c);
		border-radius: 6px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(31, 41, 55, 0.8);
		min-height: 40px;
	}

	.enhanced-scrollbar::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, #fb923c, #f97316);
		box-shadow: 0 4px 12px rgba(249, 115, 22, 0.6);
		transform: scale(1.05);
	}

	.enhanced-scrollbar::-webkit-scrollbar-thumb:active {
		background: linear-gradient(180deg, #ea580c, #c2410c);
		box-shadow: 0 2px 6px rgba(249, 115, 22, 0.8);
	}

	/* Enhanced scroll behavior untuk outlet container */
	.enhanced-scrollbar {
		scroll-behavior: smooth;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thick;
		scrollbar-color: #f97316 rgba(31, 41, 55, 0.8);
	}

	.enhanced-scrollbar:focus {
		outline: 2px solid rgba(249, 115, 22, 0.5);
		outline-offset: 2px;
		border-radius: 8px;
	}

	/* Prevent body scroll when scrolling outlet list */
	.enhanced-scrollbar:hover {
		overscroll-behavior: contain;
	}

	/* Scrollbar muncul saat hover pada container */
	.enhanced-scrollbar:hover::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #fb923c, #f97316);
		box-shadow: 0 4px 12px rgba(249, 115, 22, 0.6);
	}

	/* Smooth transitions untuk semua elemen */
	* {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Firefox scrollbar styling */
	.enhanced-scrollbar {
		scrollbar-width: thick;
		scrollbar-color: #f97316 rgba(31, 41, 55, 0.8);
	}
</style>
