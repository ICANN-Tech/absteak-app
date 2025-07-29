<script context="module" lang="ts">
	export interface Branch {
		id: string;
		name: string;
		address: string;
		phone?: string;
		available: boolean;
	}
</script>

<script lang="ts">
	import { Container } from '$lib/components/atoms';
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { MapPinSolid, PhoneSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import { ChevronLeftOutline } from 'flowbite-svelte-icons';

	// Props
	export let branches: Branch[] = [
		{
			id: 'branch-1',
			name: 'ABSteak Jakarta Pusat',
			address: 'Jl. Sudirman No. 123, Jakarta Pusat',
			phone: '+62 21 1234 5678',
			available: true
		},
		{
			id: 'branch-2',
			name: 'ABSteak Bandung',
			address: 'Jl. Braga No. 45, Bandung',
			phone: '+62 22 8765 4321',
			available: true
		},
		{
			id: 'branch-3',
			name: 'ABSteak Surabaya',
			address: 'Jl. Pemuda No. 67, Surabaya',
			phone: '+62 31 9876 5432',
			available: false
		}
	];
	export let selectedBranch: Branch | null = null;
	export let disabled: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		branchSelected: Branch;
		branchDeselected: void;
	}>();

	// Functions
	function selectBranch(branch: Branch) {
		if (disabled || !branch.available) return;

		if (selectedBranch?.id === branch.id) {
			selectedBranch = null;
			dispatch('branchDeselected');
		} else {
			selectedBranch = branch;
			dispatch('branchSelected', branch);
		}
	}

	function isSelected(branch: Branch): boolean {
		return selectedBranch?.id === branch.id;
	}

	function getBranchClasses(branch: Branch): string {
		const baseClasses =
			'relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group';

		if (!branch.available) {
			return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
		}

		if (disabled) {
			return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
		}

		if (isSelected(branch)) {
			return `${baseClasses} border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-[1.02]`;
		}

		return `${baseClasses} border-gray-700 bg-white/5 hover:border-orange-400 hover:bg-orange-400/5 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-400/10`;
	}
</script>

<Container variant="elegant" size="full" padding="xl" class="col-span-3 w-full h-full">
	<div 
		class="enhanced-scrollbar space-y-6 h-full max-h-[65vh] overflow-y-auto pr-3 pb-4"
		on:wheel|stopPropagation
		on:touchmove|stopPropagation
		tabindex="0"
		role="region"
		aria-label="Branch selection"
	>
		<!-- Header -->
		<div class="relative mb-8 flex items-center p-4 text-white">
			<button
				class="z-10 flex cursor-pointer items-center gap-1 text-yellow-600 hover:text-yellow-700"
			>
				<ChevronLeftOutline size="xl" />Back
			</button>

			<div class="absolute inset-x-0 text-center text-lg font-bold">
				<h3 class="mb-2 text-xl font-bold text-white">Pilih Cabang</h3>
				<p class="text-sm text-gray-300">Pilih cabang ABSteak yang ingin Anda kunjungi</p>
			</div>
		</div>

		<!-- Branch List -->
		<div class="grid grid-cols-2 gap-4 space-y-4">
			{#each branches as branch (branch.id)}
				<div
					class={getBranchClasses(branch)}
					on:click={() => selectBranch(branch)}
					on:keydown={(e) => e.key === 'Enter' && selectBranch(branch)}
					role="button"
					tabindex={disabled || !branch.available ? -1 : 0}
				>
					<!-- Selection Indicator -->
					{#if isSelected(branch)}
						<div class="absolute right-4 top-4">
							<CheckCircleSolid class="h-6 w-6 text-orange-500" />
						</div>
					{/if}

					<!-- Branch Info -->
					<div class="space-y-3">
						<!-- Branch Name -->
						<h4
							class="text-xl font-semibold text-white transition-colors group-hover:text-orange-400"
						>
							{branch.name}
						</h4>

						<!-- Address -->
						<div class="flex items-start gap-3 text-gray-300">
							<MapPinSolid class="mt-0.5 h-5 w-5 flex-shrink-0" />
							<span class="text-sm leading-relaxed">{branch.address}</span>
						</div>

						<!-- Phone -->
						{#if branch.phone}
							<div class="flex items-center gap-3 text-gray-300">
								<PhoneSolid class="h-5 w-5 flex-shrink-0" />
								<span class="text-sm">{branch.phone}</span>
							</div>
						{/if}

						<!-- Availability Status -->
						<div class="mt-4 flex items-center gap-2">
							<div
								class="h-2 w-2 rounded-full {branch.available ? 'bg-green-500' : 'bg-red-500'}"
							></div>
							<span
								class="text-xs font-medium {branch.available ? 'text-green-400' : 'text-red-400'}"
							>
								{branch.available ? 'Tersedia' : 'Tidak Tersedia'}
							</span>
						</div>
					</div>

					<!-- Hover Effect Overlay -->
					{#if branch.available && !disabled}
						<div
							class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Selected Branch Summary -->
		{#if selectedBranch}
			<div class="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
				<div class="flex items-center gap-3">
					<CheckCircleSolid class="h-5 w-5 flex-shrink-0 text-orange-500" />
					<div>
						<p class="text-sm font-medium text-orange-400">Cabang Terpilih:</p>
						<p class="font-semibold text-white">{selectedBranch.name}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Container>

<style>
	/* Enhanced custom scrollbar untuk branch list - lebih terlihat */
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

	/* Enhanced scroll behavior untuk branch container */
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

	/* Prevent body scroll when scrolling branch list */
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
