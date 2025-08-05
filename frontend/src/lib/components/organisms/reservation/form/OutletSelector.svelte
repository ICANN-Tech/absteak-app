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
	import { BackNavigation, Heading } from '$lib/components/atoms';
	import OutletCard from '$lib/components/molecules/card/Outlet.svelte';
	import { BuildingSolid } from 'flowbite-svelte-icons';
	import type { Branch } from '$lib/components/molecules/card/Branch.svelte';

	// Props
	interface Props {
		outlets?: Outlet[];
		selectedBranch?: Branch | null;
		selectedOutlet?: Outlet | null;
		disabled?: boolean;
		title?: string;
		subtitle?: string;
		loading?: boolean;
		onBack?: (() => void) | null;
		onOutletSelected?: ((outlet: Outlet) => void) | null;
		onOutletDeselected?: (() => void) | null;
	}

	let {
		outlets = [],
		selectedBranch = null,
		selectedOutlet = null,
		disabled = false,
		title = 'Pilih Outlet',
		subtitle = '',
		loading = false,
		onBack = null,
		onOutletSelected = null,
		onOutletDeselected = null
	}: Props = $props();

	const availableOutlets = $derived(
		selectedBranch ? outlets.filter((outlet) => outlet.branchId === selectedBranch.id) : []
	);

	const isDisabled = $derived(disabled || !selectedBranch);

	const selectOutlet = (outlet: Outlet) => {
		if (isDisabled || !outlet.available) return;

		if (selectedOutlet?.id === outlet.id) {
			selectedOutlet = null;
			if (onOutletDeselected) {
				onOutletDeselected();
			}
		} else {
			selectedOutlet = outlet;
			if (onOutletSelected) {
				onOutletSelected(outlet);
			}
		}
	};

	const isSelected = (outlet: Outlet): boolean => {
		return selectedOutlet?.id === outlet.id;
	};
</script>

<div
	class="space-y-6 pb-4 pr-3"
	onwheel={(e) => e.stopPropagation()}
	ontouchmove={(e) => e.stopPropagation()}
	aria-label="Outlet selection"
	role="region"
>
	<Heading title={title} subtitle={subtitle}>
		{#if onBack}
			{#snippet left()}
				<BackNavigation onclick={onBack} />
			{/snippet}
		{/if}
	</Heading>

	<!-- Content Area -->
	<main class="space-y-6">
		<!-- Loading State -->
		{#if loading}
			<div class="py-12 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
					<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-white/30"></div>
				</div>
				<p class="text-lg text-gray-300">Loading outlets...</p>
			</div>
			<!-- No Branch Selected State -->
		{:else if !selectedBranch}
			<div class="py-12 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
				>
					<BuildingSolid class="h-8 w-8 text-gray-300" />
				</div>
				<p class="text-lg text-gray-300">
					Pilih cabang terlebih dahulu untuk melihat outlet yang tersedia
				</p>
			</div>
		{:else if availableOutlets.length === 0}
			<!-- No Outlets Available -->
			<div class="py-12 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
				>
					<BuildingSolid class="h-8 w-8 text-gray-300" />
				</div>
				<p class="text-lg text-gray-300">Tidak ada outlet tersedia di cabang ini</p>
			</div>
		{:else}
			<!-- Outlet List -->
			<div class="space-y-4">
				{#each availableOutlets as outlet (outlet.id)}
					<OutletCard
						{outlet}
						selected={isSelected(outlet)}
						disabled={isDisabled}
						onclick={selectOutlet}
					/>
				{/each}
			</div>
		{/if}
	</main>
</div>