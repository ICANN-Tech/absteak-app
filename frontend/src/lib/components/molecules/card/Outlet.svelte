<script lang="ts">
	import { CheckCircleSolid, UsersSolid, HomeSolid, BuildingSolid } from 'flowbite-svelte-icons';
	import type { Outlet } from '$lib/components/organisms/reservation/form/OutletSelector.svelte';

	interface Props {
		outlet: Outlet;
		selected?: boolean;
		disabled?: boolean;
		onclick?: ((outlet: Outlet) => void) | null;
	}

	let { outlet, selected = false, disabled = false, onclick = null }: Props = $props();

	// Configuration objects
	const typeConfig = {
		indoor: { icon: BuildingSolid, label: 'Ruangan Dalam' },
		outdoor: { icon: HomeSolid, label: 'Ruangan Luar' },
		private: { icon: UsersSolid, label: 'Ruangan Privat' }
	};

	const priceColors = {
		$: 'text-green-400 bg-green-400/10 border-green-400/20',
		$$: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
		$$$: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
		$$$$: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
		Standard: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		Premium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
		Luxury: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
	};

	// Computed values
	const typeInfo = $derived(
		typeConfig[outlet.type as keyof typeof typeConfig] || typeConfig.indoor
	);
	const IconComponent = $derived(typeInfo.icon);
	const isInteractive = $derived(outlet.available && !disabled);
	const priceColorClass = $derived(
		outlet.priceRange
			? priceColors[outlet.priceRange as keyof typeof priceColors] ||
					'text-gray-400 bg-gray-400/10 border-gray-400/20'
			: ''
	);

	// Event handlers
	const handleClick = () => {
		if (isInteractive && onclick) onclick(outlet);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') handleClick();
	};
</script>

<!-- Outlet Card -->
<button
	type="button"
	class="group relative w-full rounded-xl border text-left backdrop-blur-sm transition-all duration-300 ease-out
		{selected
		? 'scale-[1.02] border-orange-400/60 bg-orange-400/15 shadow-lg shadow-orange-400/20'
		: isInteractive
			? 'hover:bg-orange-400/8 border-white/20 bg-white/5 hover:scale-[1.01] hover:border-orange-400/40 hover:shadow-md hover:shadow-orange-400/10'
			: 'cursor-not-allowed border-white/10 bg-white/5 opacity-60'} p-5"
	onclick={handleClick}
	onkeydown={handleKeydown}
	tabindex={isInteractive ? 0 : -1}
	disabled={!isInteractive}
>
	<div class="mb-4 flex items-start justify-between">
		<div class="flex min-w-0 flex-1 items-center gap-3">
			<IconComponent class="h-5 w-5 flex-shrink-0 text-orange-400" />
			
			<div class="min-w-0 flex-1">
				<h3
					class="truncate text-lg font-semibold leading-tight text-white transition-colors group-hover:text-orange-300"
				>
					{outlet.name}
				</h3>
				<p class="mt-0.5 text-sm text-gray-400">{typeInfo.label}</p>
			</div>
		</div>

		{#if outlet.priceRange}
			<span
				class="rounded-lg border px-2.5 py-1 text-xs font-medium {priceColorClass} ml-3 flex-shrink-0"
			>
				{outlet.priceRange}
			</span>
		{/if}
	</div>

	<!-- Content Grid -->
	<div class="space-y-3">
		<!-- Capacity -->
		<div class="flex items-center gap-2 text-gray-300">
			<UsersSolid class="h-4 w-4 flex-shrink-0" />
			<span class="text-sm">{outlet.capacity} orang</span>
		</div>

		<div class="flex justify-between">
			<!-- Features (Compact) -->
			{#if outlet.features.length > 0}
				<div class="flex flex-wrap gap-1.5">
					{#each outlet.features.slice(0, 3) as feature}
						<span
							class="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs text-gray-300"
						>
							{feature}
						</span>
					{/each}
					{#if outlet.features.length > 3}
						<span class="px-2 py-1 text-xs text-gray-400">
							+{outlet.features.length - 3} lainnya
						</span>
					{/if}
				</div>
			{/if}

			<!-- Status -->
			<div class="flex items-center gap-2 pt-1">
				<div
					class="h-2 w-2 rounded-full {outlet.available ? 'bg-emerald-400' : 'bg-red-400'}"
				></div>
				<span class="text-xs font-medium {outlet.available ? 'text-emerald-400' : 'text-red-400'}">
					{outlet.available ? 'Tersedia' : 'Tidak Tersedia'}
				</span>
			</div>
		</div>
	</div>

	<!-- Subtle Hover Effect -->
	{#if isInteractive}
		<div
			class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 via-orange-400/0 to-orange-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>
	{/if}
</button>
