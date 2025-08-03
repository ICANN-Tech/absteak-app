<script lang="ts">
	import PersonalForm from './components/form/Personal.svelte';
	import { DiningBackdrop } from '$lib/components/atoms';
	import { Stepper } from '$lib/components/molecules';
	import BookingCalendar from '$lib/components/molecules/calendar/Booking.svelte';
	import { PaymentMethod } from '$lib/components/molecules';
	import { ReviewForm } from '../../components/organisms/reservation';
	import { fly } from 'svelte/transition';
	
	// Import new state management
	import { interfaceStore, steps, currentStep, currentStepIndex, StepLabel } from './stores/interface';
	import { personalFormStore } from './stores/form/personal';
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
				<!-- Personal Information Form -->
				<PersonalForm />
			{:else if $currentStep?.label === StepLabel.Payment}
				<!-- Payment Form -->
				<div
					class="mx-auto grid h-full max-w-7xl grid-cols-1 items-start gap-8 xl:grid-cols-5"
					in:fly={{ x: 300, duration: 300 }}
				>
					<PaymentMethod />

					<!-- Review Section -->
					<div class="order-1 xl:order-2 xl:col-span-2">
						<ReviewForm on:confirmReservation={handleConfirmReservation}>
							<div slot="footer">
								<!-- Review footer content -->
							</div>
						</ReviewForm>
					</div>
				</div>
			{:else if $currentStep?.label === StepLabel.Confirmation}
				<!-- Confirmation Step -->
				<div
					class="mx-auto max-w-4xl text-center"
					in:fly={{ x: 300, duration: 300 }}
				>
					<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-8">
						<div class="mb-6">
							<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
								<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							</div>
							<h2 class="text-3xl font-bold text-green-400 mb-4">Reservasi Berhasil!</h2>
							<p class="text-green-300 mb-6">
								Terima kasih! Reservasi Anda telah berhasil dikonfirmasi. 
								Kami akan mengirimkan detail reservasi ke email Anda.
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
					<h2 class="text-3xl font-bold text-white mb-4">Welcome to ABSteak Reservation</h2>
					<p class="text-gray-300 mb-8">Please follow the steps to complete your reservation.</p>
				</div>
			{/if}
		</div>
	</div>
</section>
