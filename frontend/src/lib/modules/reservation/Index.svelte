<script lang="ts">
	import PersonalForm from './components/form/Personal.svelte';
	import PaymentForm from './components/form/Payment.svelte';
	import SummaryForm from './components/form/Summary.svelte';
	import { DiningBackdrop } from '$lib/components/atoms';
	import { Stepper } from '$lib/components/molecules';
	import BookingCalendar from '$lib/components/molecules/calendar/Booking.svelte';
	import { fly } from 'svelte/transition';

	// Import new state management
	import {
		interfaceStore,
		steps,
		currentStep,
		currentStepIndex,
		StepLabel
	} from './stores/interface';
	import { personalFormStore } from './stores/form/personal';
	import { paymentFormStore } from './stores/form/payment';
	import { interfaceService } from './service/interface.service';

	// Convert steps to StepperStep format
	$: stepperSteps = $steps.map((step: any) => ({
		id: step.id.toString(),
		title: step.label,
		completed: step.status === 'completed',
		active: step.status === 'current',
		disabled: false
	}));

	// Event handlers for UI testing
	async function handleConfirmReservation() {
		try {
			console.log('Index: Handling confirm reservation...');
			const success = await interfaceService.validateAndProceed();
			if (success) {
				console.log('Index: Successfully moved to next step');
			} else {
				console.log('Index: Failed to move to next step');
			}
		} catch (error) {
			console.log('Index: Error in confirm reservation:', error);
		}
	}
</script>

<section class="relative min-h-screen overflow-hidden" id="booking">
	<DiningBackdrop />

	<div class="relative px-12 mx-auto flex min-h-screen w-full flex-col items-end justify-center">
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
				<!-- Personal Information Form -->
				<div class="w-full mx-auto h-full" in:fly={{ x: 300, duration: 300 }}>
					<PersonalForm />
				</div>
			{:else if $currentStep?.label === StepLabel.Payment}
				<!-- Payment Form -->
				<div class="w-full mx-auto h-full" in:fly={{ x: 300, duration: 300 }}>
					<PaymentForm 
						totalAmount={250000}
						onFormSubmit={handleConfirmReservation}
					/>
				</div>
			{:else if $currentStep?.label === StepLabel.Summary}
				<!-- Summary Form -->
				<div class="w-full mx-auto h-full" in:fly={{ x: 300, duration: 300 }}>
					<SummaryForm 
						reservationDate="2024-01-15"
						reservationTime="19:00"
						on:confirmReservation={handleConfirmReservation}
						on:editBranch={() => interfaceService.goToStep(0)}
						on:editOutlet={() => interfaceService.goToStep(0)}
						on:editDateTime={() => interfaceService.goToStep(0)}
						on:editPersonalInfo={() => interfaceService.goToStep(0)}
						on:editPayment={() => interfaceService.goToStep(1)}
					/>
				</div>
			{:else if $currentStep?.label === StepLabel.Receipt}
				<!-- Confirmation Step -->
				<div class="mx-auto max-w-xl text-center" in:fly={{ x: 300, duration: 300 }}>
					<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-8">
						<div class="mb-6">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500"
							>
								<svg
									class="h-8 w-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							</div>
							<h2 class="mb-4 text-3xl font-bold text-green-400">Reservasi Berhasil!</h2>
							<p class="mb-6 text-green-300">
								Terima kasih! Reservasi Anda telah berhasil dikonfirmasi. Kami akan mengirimkan
								detail reservasi ke email Anda.
							</p>
						</div>

						<div class="space-y-4">
							<button
								class="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
								on:click={() => interfaceService.reset()}
							>
								Buat Reservasi Baru
							</button>

							<button
								class="w-full rounded-lg border border-green-500 px-6 py-3 font-semibold text-green-400 transition-colors hover:bg-green-500/10"
								on:click={() => window.print()}
							>
								Cetak Konfirmasi
							</button>
						</div>
					</div>
				</div>
			{:else}
				<!-- Default/Information step -->
				<div class="mx-auto max-w-4xl text-center">
					<h2 class="mb-4 text-3xl font-bold text-white">Welcome to ABSteak Reservation</h2>
					<p class="mb-8 text-gray-300">Please follow the steps to complete your reservation.</p>
				</div>
			{/if}
		</div>
	</div>
</section>
