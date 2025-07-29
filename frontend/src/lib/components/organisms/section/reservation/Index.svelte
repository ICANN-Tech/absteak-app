<script lang="ts">
	import {
		Input,
		Dropdown,
		Button,
		Textarea,
		Container,
		DiningBackdrop
	} from '$lib/components/atoms';
	import { Stepper } from '$lib/components/molecules';
	import BookingCalendar from '$lib/components/molecules/calendar/Booking.svelte';
	import BranchSelectorForm from '../../reservation/form/BranchSelector.svelte';
	import OutletSelectorForm from '../../reservation/form/OutletSelector.svelte';
	import type { Branch } from '../../reservation/form/BranchSelector.svelte';
	import type { Outlet } from '../../reservation/form/OutletSelector.svelte';
	import { PaymentMethod } from '$lib/components/molecules';
	import {
		steps,
		currentStep,
		goToNextStep,
		goToPrevStep,
		StepLabel
	} from '$lib/stores/reservation/step';
	import { fly, fade } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';
	import { ReviewForm } from '../../reservation';

	// Branch and Outlet selection data
	let selectedBranch: Branch | null = null;
	let selectedOutlet: Outlet | null = null;

	// Sample data - in real app this would come from API
	const branches: Branch[] = [
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

	const outlets: Outlet[] = [
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

	// Reservation form data
	let customerName = '';
	let customerEmail = '';
	let customerPhone = '';
	let partySize = 2;
	let specialRequests = '';

	// Payment data
	let paymentMethod = '';
	let cardNumber = '';
	let expiryDate = '';
	let cvv = '';
	let submitted = false;

	const timeOptions = [
		{ value: '', label: 'Select Time', disabled: true },
		{ value: '17:00', label: '5:00 PM' },
		{ value: '18:00', label: '6:00 PM' },
		{ value: '19:00', label: '7:00 PM' },
		{ value: '20:00', label: '8:00 PM' },
		{ value: '21:00', label: '9:00 PM' }
	];

	const paymentMethods = [
		{ value: '', label: 'Pilih Metode Pembayaran', disabled: true },
		{ value: 'credit-card', label: 'Credit Card' },
		{ value: 'debit-card', label: 'Debit Card' },
		{ value: 'gopay', label: 'GoPay' },
		{ value: 'ovo', label: 'OVO' }
	];

	// Convert steps to StepperStep format
	$: stepperSteps = $steps.map((step) => ({
		id: step.id.toString(),
		title: step.label,
		completed: step.status === 'completed',
		active: step.status === 'current',
		disabled: false
	}));

	// Event handlers
	function handleBranchSelected(event: CustomEvent<Branch>) {
		selectedBranch = event.detail;
		// Reset outlet selection when branch changes
		selectedOutlet = null;
	}

	function handleBranchDeselected() {
		selectedBranch = null;
		selectedOutlet = null;
	}

	function handleOutletSelected(event: CustomEvent<Outlet>) {
		selectedOutlet = event.detail;
	}

	function handleOutletDeselected() {
		selectedOutlet = null;
	}

	// Handle payment form submission
	function handlePaymentSubmit(event: Event) {
		event.preventDefault();
		submitted = true;

		// Simulate payment processing
		setTimeout(() => {
			submitted = false;
			// Here you would typically handle the actual payment processing
			alert('Pembayaran berhasil diproses!');
		}, 2000);
	}
</script>

<section class="relative min-h-screen overflow-hidden" id="booking">
	<DiningBackdrop />

	<div class="relative flex min-h-screen w-full flex-col items-end justify-center">
		<!-- Content Row -->
		<div class="relative z-20 my-auto flex w-full flex-col gap-8 px-4">
			<div class="my-auto flex w-full justify-center">
				<Stepper
					steps={stepperSteps}
					currentStep={$currentStep?.id || 0}
					variant="elegant"
					orientation="horizontal"
					type="numbered"
					clickable={false}
					showConnector={true}
				/>
			</div>

			{#if $currentStep?.label === StepLabel.Personal}
				<!-- Reservation Form -->
				<div
					class="mx-auto grid h-full max-w-7xl grid-cols-1 items-start gap-8 xl:grid-cols-5"
					transition:fly={{ x: 300, duration: 300 }}
				>
					{#if selectedBranch !== null}
						<!-- Outlet Selection Form -->
						<OutletSelectorForm
							{outlets}
							{selectedBranch}
							bind:selectedOutlet
							on:outletSelected={handleOutletSelected}
							on:outletDeselected={handleOutletDeselected}
						/>
					{:else}
						<!-- Branch Selection Form -->
						<BranchSelectorForm
							{branches}
							bind:selectedBranch
							on:branchSelected={handleBranchSelected}
							on:branchDeselected={handleBranchDeselected}
						/>
					{/if}

					<!-- Calendar Section -->
					<div class="order-1 xl:order-2 xl:col-span-2">
						<ReviewForm>
							<div slot="footer">
								<Button>Lihat Detail</Button>
							</div>
						</ReviewForm>
					</div>
				</div>
			{:else if $currentStep?.label !== StepLabel.Information}
				<!-- Reservation Form -->
				<div
					class="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 xl:grid-cols-5"
					transition:fly={{ x: 300, duration: 300 }}
				>
					<!-- Form Section -->
					<Container variant="elegant" size="full" padding="xl" class="col-span-3 w-full">
						<form class="grid grid-cols-2 gap-4 space-y-6">
							<!-- Nama Lengkap -->
							<div class="space-y-2">
								<Input
									label="Nama Lengkap"
									type="text"
									bind:value={customerName}
									placeholder="Masukkan nama lengkap Anda"
									variant="elegant"
									size="lg"
									required
								/>
							</div>

							<!-- Email -->
							<div class="space-y-2">
								<Input
									label="Email"
									type="email"
									bind:value={customerEmail}
									placeholder="contoh@email.com"
									variant="elegant"
									size="lg"
									required
								/>
							</div>

							<!-- Nomor Telepon -->
							<div class="space-y-2">
								<Input
									label="Nomor Telepon"
									type="tel"
									bind:value={customerPhone}
									placeholder="+62 812-3456-7890"
									variant="elegant"
									size="lg"
									required
								/>
							</div>

							<!-- Jumlah Tamu -->
							<div class="space-y-2">
								<Dropdown
									label="Jumlah Tamu"
									bind:value={partySize}
									placeholder="Pilih jumlah tamu"
									options={[
										{ value: 1, label: '1 Orang' },
										{ value: 2, label: '2 Orang' },
										{ value: 3, label: '3 Orang' },
										{ value: 4, label: '4 Orang' },
										{ value: 5, label: '5 Orang' },
										{ value: 6, label: '6 Orang' },
										{ value: 7, label: '7 Orang' },
										{ value: 8, label: '8 Orang' }
									]}
									variant="elegant"
									size="lg"
									required
									class="transition-all duration-300 focus:scale-[1.02]"
								/>
							</div>

							<!-- Permintaan Khusus -->
							<div class="col-span-full space-y-2">
								<Textarea
									label="Permintaan Khusus"
									bind:value={specialRequests}
									placeholder="Contoh: Meja dekat jendela, kursi bayi, alergi makanan, dll. (opsional)"
									variant="elegant"
									rows={4}
								/>
							</div>

							<!-- Action Buttons -->
							<div class="flex gap-4 pt-6">
								<Button type="button" onclick={goToPrevStep}>Back</Button>
								<Button type="button" onclick={goToNextStep}>Continue</Button>
							</div>
						</form>
					</Container>

					<!-- Calendar Section -->
					<div class="order-1 xl:order-2 xl:col-span-2">
						<BookingCalendar />
					</div>
				</div>
			{:else if $currentStep?.label === StepLabel.Payment}
				<!-- Payment Form -->
			{/if}
			<div
				class="mx-auto grid h-full max-w-7xl grid-cols-1 items-start gap-8 xl:grid-cols-5"
				transition:fly={{ x: 300, duration: 300 }}
			>
				<PaymentMethod />

				<!-- Calendar Section -->
				<div class="order-1 xl:order-2 xl:col-span-2">
					<ReviewForm>
						<div slot="footer">
							<Button>Lihat Detail</Button>
						</div>
					</ReviewForm>
				</div>
			</div>
		</div>
	</div>
</section>
