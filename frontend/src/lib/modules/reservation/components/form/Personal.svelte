<script lang="ts">
	import { BranchSelectorForm, OutletSelectorForm, Button, Container, Input, Dropdown, Textarea } from "$lib/components";
	import { fly } from "svelte/transition";
	import { OUTLET_DUMMY } from "../../dummy/outlet.dummy";
	import { BRANCH_DUMMY } from "../../dummy/branch.dummy";
	import { 
		personalFormStore, 
		selectedBranch, 
		selectedOutlet,
		personalFormData
	} from "../../stores/form/personal";
	import { interfaceService } from "../../service/interface.service";
	import type { Branch } from "$lib/components/organisms/reservation/form/BranchSelector.svelte";
	import type { Outlet } from "$lib/components/organisms/reservation/form/OutletSelector.svelte";

	// Form input values - reactive binding pattern like Newsletter.svelte
	let customerName = $personalFormData.customerName;
	let customerEmail = $personalFormData.customerEmail;
	let customerPhone = $personalFormData.customerPhone;
	let partySize = $personalFormData.partySize;
	let specialRequests = $personalFormData.specialRequests;

	// Sinkronisasi data menggunakan reactive statements
	$: customerName = $personalFormData.customerName;
	$: customerEmail = $personalFormData.customerEmail;
	$: customerPhone = $personalFormData.customerPhone;
	$: partySize = $personalFormData.partySize;
	$: specialRequests = $personalFormData.specialRequests;

	// Reactive statements for form synchronization (don't mark as touched)
	$: personalFormStore.updateField('customerName', customerName, false);
	$: personalFormStore.updateField('customerEmail', customerEmail, false);
	$: personalFormStore.updateField('customerPhone', customerPhone, false);
	$: personalFormStore.updateField('partySize', partySize, false);
	$: personalFormStore.updateField('specialRequests', specialRequests, false);

	// Party size options for dropdown
	const partySizeOptions = Array.from({ length: 20 }, (_, i) => ({
		value: i + 1,
		label: `${i + 1} ${i + 1 === 1 ? 'person' : 'people'}`
	}));

	// Event handlers
	function handleBranchSelected(event: CustomEvent<Branch>) {
		personalFormStore.setBranch(event.detail);
		personalFormStore.touchField('selectedBranch');
	}

	function handleBranchDeselected() {
		personalFormStore.setBranch(null);
		personalFormStore.touchField('selectedBranch');
	}

	function handleOutletSelected(event: CustomEvent<Outlet>) {
		personalFormStore.setOutlet(event.detail);
		personalFormStore.touchField('selectedOutlet');
	}

	function handleOutletDeselected() {
		personalFormStore.setOutlet(null);
		personalFormStore.touchField('selectedOutlet');
	}

	// Handle form submission - using validateAndProceed for proper flow
	async function handleSubmit() {
		try {
			console.log('Attempting to validate and proceed...');
			const success = await interfaceService.validateAndProceed();
			if (success) {
				console.log('Successfully navigated to next step');
			} else {
				console.log('Validation failed, staying on current step');
			}
		} catch (error) {
			console.log('Navigation error:', error);
		}
	}
</script>

<div
	class="mx-auto grid h-full max-w-7xl grid-cols-1 lg:grid-cols-2 items-start gap-8 xl:grid-cols-5"
	in:fly={{ x: 300, duration: 300 }}
>
	<!-- Branch/Outlet Selection -->
	<div class="order-2 lg:order-1 xl:col-span-2">
		<div 
			class="h-full max-h-[65vh] overflow-y-auto pr-3"
			role="region"
			aria-label="Branch and outlet selection"
		>
			{#if $selectedBranch !== null}
				<!-- Outlet Selection Form -->
				<OutletSelectorForm
					outlets={OUTLET_DUMMY}
					selectedBranch={$selectedBranch}
					selectedOutlet={$selectedOutlet}
					on:outletSelected={handleOutletSelected}
					on:outletDeselected={handleOutletDeselected}
				/>
			{:else}
				<!-- Branch Selection Form -->
				<BranchSelectorForm
				showBackButton={false}
					branches={BRANCH_DUMMY}
					selectedBranch={$selectedBranch}
					on:branchSelected={handleBranchSelected}
					on:branchDeselected={handleBranchDeselected}
				/>
			{/if}
		</div>
	</div>

	<!-- Personal Information Form -->
	<div class="order-1 lg:order-2 xl:col-span-3">
		<Container variant="elegant" size="full" padding="xl" scrollable={true} class="col-span-2 w-full h-full max-h-[65vh]">
			<div 
				class="space-y-6 pr-3 pb-4"
				on:wheel|stopPropagation
				on:touchmove|stopPropagation
				role="region"
				aria-label="Personal information form"
			>
				<h2 class="mb-6 text-xl font-semibold text-white">Personal Information</h2>
				
				<div class="space-y-6">
					<!-- Customer Name -->
					<Input
						label="Full Name"
						type="text"
						bind:value={customerName}
											placeholder="Enter your full name"
						required
						variant="elegant"
						icon="fas fa-user"
					/>

					<!-- Email and Phone in a grid -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Customer Email -->
						<Input
							label="Email Address"
							type="email"
							bind:value={customerEmail}
							placeholder="Enter your email address"
							required
							variant="elegant"
							icon="fas fa-envelope"
						/>

						<!-- Customer Phone -->
						<Input
							label="Phone Number"
							type="tel"
							bind:value={customerPhone}
							placeholder="Enter your phone number"
							required
							variant="elegant"
							icon="fas fa-phone"
						/>
					</div>

					<!-- Party Size -->
					<Dropdown
						label="Party Size"
						bind:value={partySize}
						options={partySizeOptions}
						placeholder="Select party size"
						required
						variant="elegant"
						icon="fas fa-users"
					/>

					<!-- Special Requests -->
					<Textarea
						label="Special Requests (Optional)"
						bind:value={specialRequests}
						placeholder="Any special requests or dietary requirements..."
						rows={3}
						variant="elegant"
						maxlength={500}
						resize="vertical"
					/>

					<Button
						variant="primary"
						type="button"
						disabled={false}
						on:click={handleSubmit}
						onclick={handleSubmit}
					>
						Next Step
					</Button>
				</div>
			</div>
  		</Container>
  	</div>
  </div>
