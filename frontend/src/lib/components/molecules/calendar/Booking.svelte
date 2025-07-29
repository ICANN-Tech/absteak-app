<script lang="ts">
	import { Datepicker, TimePicker } from '$lib/components/atoms';
	import { ReservationSummary, type ReservationData } from '$lib/components/organisms';

	// State variables
	let selectedDate = $state<Date | undefined>(new Date());
	let selectedTime = $state('');
	let customerName = $state('');
	let customerEmail = $state('');
	let customerPhone = $state('');
	let partySize = $state(2);
	let specialRequests = $state('');
	let selectedBranch = $state('');

	// Available branches
	const branches = [
		{ value: '', name: 'Pilih Lokasi', disabled: true },
		{ value: 'jakarta-pusat', name: 'Jakarta Pusat - Plaza Indonesia' },
		{ value: 'jakarta-selatan', name: 'Jakarta Selatan - Senayan City' },
		{ value: 'bandung', name: 'Bandung - Paris Van Java' },
		{ value: 'surabaya', name: 'Surabaya - Tunjungan Plaza' }
	];

	// Party size options
	const partySizeOptions = Array.from({ length: 10 }, (_, i) => ({
		value: i + 1,
		name: `${i + 1} ${i === 0 ? 'Person' : 'Persons'}`
	}));

	// Available time slots
	// In a real application, these would be fetched from a backend based on the selected date and branch
	const timeSlots = [
		{ time: '17:00', available: true },
		{ time: '17:30', available: true },
		{ time: '18:00', available: true },
		{ time: '18:30', available: false },
		{ time: '19:00', available: true },
		{ time: '19:30', available: true },
		{ time: '20:00', available: true },
		{ time: '20:30', available: false },
		{ time: '21:00', available: true },
		{ time: '21:30', available: true }
	];

	// Reactive reservation data
	const reservationData = $derived({
		date: selectedDate,
		time: selectedTime,
		location: selectedBranch,
		partySize: partySize,
		contactPerson: 'Bapak Didi',
		contactPhone: '+62 812-3456-7890'
	} satisfies ReservationData);

	// Debug effect untuk memastikan reactivity
	$effect(() => {
		console.log('selectedTime changed:', selectedTime);
		console.log('reservationData.time:', reservationData.time);
	});

	// Event handlers for TimePicker
	function handleTimeSelected(event: CustomEvent<{ time: string; slot: any }>) {
		selectedTime = event.detail.time;
		console.log('Time selected:', event.detail.time);
	}

	function handleTimeUnselected(event: CustomEvent<{ time: string; slot: any }>) {
		selectedTime = '';
		console.log('Time unselected:', event.detail.time);
	}

	// Format date for display
	function formatDate(date: Date | undefined) {
		if (!date) return 'Belum dipilih';
		return date.toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long'
		});
	}

	// Check if form is valid
	function isFormValid() {
		return (
			customerName &&
			customerEmail &&
			customerPhone &&
			selectedDate &&
			selectedTime &&
			selectedBranch
		);
	}

	// Handle form submission
	function handleSubmit() {
		if (isFormValid()) {
			// In a real application, this would send the booking data to a backend
			alert(
				`Booking confirmed for ${customerName} on ${formatDate(selectedDate)} at ${selectedTime}`
			);
			// Reset form
			resetForm();
		} else {
			alert('Please fill in all required fields');
		}
	}

	// Reset form
	function resetForm() {
		customerName = '';
		customerEmail = '';
		customerPhone = '';
		selectedDate = new Date();
		selectedTime = '';
		partySize = 2;
		specialRequests = '';
		selectedBranch = '';
	}
</script>

<div class="flex w-full flex-col gap-4">
	<div class="mx-auto flex w-full gap-4">
		<!-- Date and Time Selection -->
		<Datepicker bind:value={selectedDate} variant="elegant" placeholder="Pilih tanggal reservasi" />

		<TimePicker
		{timeSlots}
		selectedTime={selectedTime}
		on:timeSelected={handleTimeSelected}
		on:timeUnselected={handleTimeUnselected}
		variant="elegant"
		columns={2}
	/>
	</div>

	<!-- Booking Summary -->
	<ReservationSummary {reservationData} {branches} variant="elegant" />
</div>