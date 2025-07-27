<script lang="ts">
	import { Input, Dropdown, Datepicker, Textarea, Container } from '$lib/components/atoms';
	import { Stepper } from '$lib/components/molecules';
	import BookingCalendar from '$lib/components/organisms/reservation/BookingCalendar.svelte';
	import {
		steps,
		currentStep,
		goToNextStep,
		goToPrevStep,
		StepLabel
	} from '$lib/stores/reservation/index';
	import { Button } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';

	// Branch selection data
	let selectedBranch = '';
	let selectedOutlet = '';
	const branches = [
		{ value: 'jakarta-pusat', label: 'Jakarta Pusat - Plaza Indonesia' },
		{ value: 'jakarta-selatan', label: 'Jakarta Selatan - Senayan City' },
		{ value: 'bandung', label: 'Bandung - Paris Van Java' },
		{ value: 'surabaya', label: 'Surabaya - Tunjungan Plaza' }
	];

	const outlets = [
		{ value: 'main-floor', label: 'Main Floor - Ground Level' },
		{ value: 'upper-deck', label: 'Upper Deck - Second Floor' },
		{ value: 'terrace', label: 'Outdoor Terrace' },
		{ value: 'private-room', label: 'Private Dining Room' }
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
	<!-- Enhanced Background -->
	<div class="absolute inset-0">
		<!-- Base gradient background -->
		<div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

		<!-- Background image with enhanced overlay -->
		<div
			class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
			style="background-image: url('https://foodies.id/wp-content/uploads/2024/01/AB-Steak-Senayan-City.jpg')"
		></div>

		<!-- Noise texture overlay -->
		<div class="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
	</div>

	<div class="relative flex min-h-screen w-full flex-col items-center justify-center">
		<!-- Stepper Row -->
		<div class="mb-16 flex w-full justify-center">
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

		<!-- Content Row -->
		<div class="relative z-20 w-full">
			{#if $currentStep?.label === StepLabel.Personal}
				<!-- Branch Selection Form -->
				<div
					class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2"
					transition:fly={{ x: 300, duration: 300 }}
				>
					<!-- Form Section -->
					<div class="order-2 flex justify-center lg:order-1">
						<div class="relative w-full max-w-lg">
							<!-- Background decoration -->
							<div
								class="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/20 via-primary-500/20 to-primary-500/20 blur-xl delay-75"
							></div>

							<!-- Form container -->
							<div
								class="hover:shadow-3xl relative rounded-3xl border border-white/30 bg-gradient-to-br from-white/15 via-white/10 to-white/15 p-10 shadow-2xl backdrop-blur-xl transition-all duration-500"
							>
								<!-- Decorative elements -->
								<div
									class="absolute top-0 left-0 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-400/20 blur-2xl"
								></div>
								<div
									class="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-gradient-to-tl from-amber-400/20 to-orange-400/20 blur-2xl"
								></div>

								<form class="relative space-y-8" on:submit={goToNextStep}>
									<div class="mb-8 text-center">
										<div
											class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg"
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
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												></path>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												></path>
											</svg>
										</div>
										<h3 class="mb-3 text-3xl font-bold tracking-tight text-white">Pilih Lokasi</h3>
										<p class="text-lg text-white/70">
											Tentukan cabang dan outlet yang Anda inginkan
										</p>
									</div>

									<div class="space-y-6">
										<Dropdown
											label="Pilih Cabang"
											placeholder="Pilih lokasi cabang..."
											bind:value={selectedBranch}
											options={branches}
											variant="elegant"
											size="lg"
											required
											clearable
											searchable
											class="transition-all duration-300 focus:scale-[1.02]"
										/>

										<Dropdown
											label="Pilih Outlet"
											placeholder="Pilih outlet yang diinginkan..."
											bind:value={selectedOutlet}
											options={outlets}
											variant="elegant"
											size="lg"
											required
											clearable
											searchable
											class="transition-all duration-300 focus:scale-[1.02]"
										/>
									</div>

									<div class="pt-6">
										<Button
											type="submit"
											class="w-full rounded-2xl border-2 border-orange-400 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 font-bold text-white shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl"
										>
											Lanjutkan ke Form Reservasi →
										</Button>
									</div>
								</form>
							</div>
						</div>
					</div>

					<!-- Info Section -->
					<div class="order-1 text-center lg:order-2 lg:text-left">
						<div class="mb-4 text-lg font-semibold text-orange-400">Pilih Lokasi</div>
						<h2 class="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
							Cabang Restoran
						</h2>
						<div class="mb-4 text-2xl font-bold text-orange-400 md:text-3xl">
							Temukan Lokasi Terdekat
						</div>
						<p class="mb-8 text-lg leading-relaxed text-gray-200">
							Kami memiliki beberapa cabang di lokasi strategis untuk memberikan kemudahan akses
							bagi Anda. Pilih cabang yang paling dekat dengan lokasi Anda.
						</p>
						<div class="flex justify-center gap-12 lg:justify-start">
							<div class="flex flex-col items-center">
								<div class="text-4xl font-extrabold text-orange-400 md:text-5xl">4</div>
								<div class="font-semibold text-white">Cabang Tersedia</div>
							</div>
							<div class="flex flex-col items-center">
								<div class="text-4xl font-extrabold text-orange-400 md:text-5xl">24/7</div>
								<div class="font-semibold text-white">Layanan Reservasi</div>
							</div>
						</div>
					</div>
				</div>
			{:else if $currentStep?.label === StepLabel.Information}
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
				<div
					class="mx-auto grid max-w-6xl grid-cols-1 items-start gap-16 lg:grid-cols-2"
					transition:fly={{ x: 300, duration: 300 }}
				>
					<!-- Payment Form Section -->
					<div class="order-2 flex justify-center lg:order-1">
						<div class="w-full max-w-lg">
							<form
								class="space-y-6 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md"
								on:submit={handlePaymentSubmit}
							>
								<div class="mb-6 text-center">
									<h3 class="mb-2 text-2xl font-bold text-white">Pembayaran</h3>
									<p class="text-gray-300">Pilih metode pembayaran yang Anda inginkan</p>
								</div>

								<Dropdown
									label="Metode Pembayaran"
									placeholder="Pilih metode pembayaran..."
									bind:value={paymentMethod}
									options={paymentMethods}
									variant="elegant"
									size="lg"
									required
									clearable
								/>

								{#if paymentMethod === 'credit-card' || paymentMethod === 'debit-card'}
									<div class="space-y-4">
										<Input
											label="Nomor Kartu"
											type="text"
											bind:value={cardNumber}
											placeholder="1234 5678 9012 3456"
											variant="elegant"
											size="lg"
											required
										/>

										<div class="grid grid-cols-2 gap-4">
											<Input
												label="Tanggal Kadaluarsa"
												type="text"
												bind:value={expiryDate}
												placeholder="MM/YY"
												variant="elegant"
												size="md"
												required
											/>
											<Input
												label="CVV"
												type="text"
												bind:value={cvv}
												placeholder="123"
												variant="elegant"
												size="md"
												required
											/>
										</div>
									</div>
								{/if}

								<div class="flex gap-4 pt-4">
									<Button
										type="button"
										onclick={goToPrevStep}
										class="flex-1 rounded-full border-2 border-gray-500 bg-transparent py-3 font-bold text-gray-400 transition-all duration-300 hover:scale-105 hover:bg-gray-500 hover:text-white"
									>
										Kembali
									</Button>
									<Button
										type="submit"
										class="flex-1 rounded-full border-2 border-orange-500 bg-transparent py-3 font-bold text-orange-400 transition-all duration-300 hover:scale-105 hover:bg-orange-500 hover:text-white"
										disabled={submitted || !paymentMethod}
									>
										{submitted ? 'Memproses...' : 'Konfirmasi Pembayaran'}
									</Button>
								</div>
							</form>
						</div>
					</div>

					<!-- Summary Section -->
					<div class="order-1 lg:order-2">
						<BookingCalendar />
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
