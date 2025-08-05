<script context="module" lang="ts">
	import { BRANCH_DUMMY } from '../../dummy/branch.dummy';
	import { OUTLET_DUMMY } from '../../dummy/outlet.dummy';
	import { BranchSelectorForm, Container, OutletSelectorForm } from '$lib/components';
</script>

<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { branchActionInterface } from '../../service/branch.service';
	import { outletActionInterface } from '../../service/outlet.service';
	import { selectedBranch, selectedOutlet, personalFormStore } from '../../stores/form/personal';

	// Props
	export let onBack: (() => void) | null = null;

	// Import event handlers from services
	const { handleBranchSelectedCallback, handleBranchDeselectedCallback } = branchActionInterface;

	const { handleOutletSelectedCallback, handleOutletDeselectedCallback } = outletActionInterface;
</script>

<div
	class="h-full max-h-[65vh] w-full min-w-0 overflow-y-auto pr-3"
	role="region"
	aria-label="Branch and outlet selection"
>
	<Container
		variant="elegant"
		size="full"
		padding="xl"
		scrollable={true}
		class="enhanced-scrollbar h-full max-h-[65vh] w-full"
	>
		{#if $selectedBranch !== null}
			<!-- Outlet Selection Form -->
			<div
				in:fly={{ x: 300, duration: 400, delay: 200 }}
				out:fly={{ x: 300, duration: 300 }}
				class="w-full"
			>
				<OutletSelectorForm
					outlets={OUTLET_DUMMY}
					selectedBranch={$selectedBranch}
					selectedOutlet={$selectedOutlet}
					title="Pilih Outlet"
					subtitle={$selectedBranch
						? `Outlet tersedia di ${$selectedBranch.name}`
						: 'Pilih outlet yang sesuai dengan kebutuhan Anda'}
					onOutletSelected={handleOutletSelectedCallback}
					onOutletDeselected={handleOutletDeselectedCallback}
					onBack={() => personalFormStore.setBranch(null)}
				/>
			</div>
		{:else}
			<!-- Branch Selection Form -->
			<div
				in:fly={{ x: -300, duration: 400, delay: 200 }}
				out:fly={{ x: -300, duration: 300 }}
				class="w-full"
			>
				<BranchSelectorForm
					branches={BRANCH_DUMMY}
					selectedBranch={$selectedBranch}
					onBranchSelected={handleBranchSelectedCallback}
					onBranchDeselected={handleBranchDeselectedCallback}
					{onBack}
				/>
			</div>
		{/if}
	</Container>
</div>
