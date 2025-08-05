<script lang="ts">
	import { BackNavigation, Container } from '$lib/components/atoms';
	import { ChevronLeftOutline, CheckCircleSolid } from 'flowbite-svelte-icons';
	import BranchCard, { type Branch } from '$lib/components/molecules/card/Branch.svelte';
	import Heading from '$lib/components/atoms/heading/Index.svelte';

	// Props
	export let branches: Branch[] = [];
	export let selectedBranch: Branch | null = null;
	export let disabled: boolean = false;
	export let title: string = 'Pilih Cabang';
	export let subtitle: string = 'Pilih cabang ABSteak yang ingin Anda kunjungi';
	export let loading: boolean = false;
	export let onBack: (() => void) | null = null;
	export let onBranchSelected: ((branch: Branch) => void) | null = null;
	export let onBranchDeselected: (() => void) | null = null;


	// Functions
	function selectBranch(branch: Branch) {
		if (disabled || !branch.available) return;

		if (selectedBranch?.id === branch.id) {
			selectedBranch = null;
			if (onBranchDeselected) {
				onBranchDeselected();
			}
		} else {
			selectedBranch = branch;
			if (onBranchSelected) {
				onBranchSelected(branch);
			}
		}
	}

	function isSelected(branch: Branch): boolean {
		return selectedBranch?.id === branch.id;
	}
</script>

<div
	class="space-y-6 pb-4 pr-3"
	on:wheel|stopPropagation
	on:touchmove|stopPropagation
	aria-label="Branch selection"
	role="region"
>
	<!-- Header -->
	<Heading {title} {subtitle}>
		{#if onBack !== null}
			<BackNavigation slot="left" onclick={onBack} />
		{/if}
	</Heading>

	<!-- Loading State -->
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<div
					class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"
				></div>
				<p class="text-gray-300">Loading branches...</p>
			</div>
		</div>
	{:else if branches.length === 0}
		<!-- Empty State -->
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<p class="mb-2 text-gray-300">No branches available</p>
				<p class="text-sm text-gray-400">Please try again later</p>
			</div>
		</div>
	{:else}
		<!-- Branch List -->
		<div class="flex flex-col gap-4 space-y-4">
			{#each branches as branch (branch.id)}
				<BranchCard
					{branch}
					selected={isSelected(branch)}
					{disabled}
					onclick={selectBranch}
				/>
			{/each}
		</div>
	{/if}

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
