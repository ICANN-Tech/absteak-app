<script lang="ts">
  import ReservationSummary, { type ReservationData, type Branch } from './Summary.svelte';

  // Sample data
  const branches: Branch[] = [
    { value: 'jakarta-pusat', name: 'Jakarta Pusat - Plaza Indonesia' },
    { value: 'jakarta-selatan', name: 'Jakarta Selatan - Senayan City' },
    { value: 'bandung', name: 'Bandung - Paris Van Java' },
    { value: 'surabaya', name: 'Surabaya - Tunjungan Plaza' }
  ];

  const sampleReservation: ReservationData = {
    date: new Date(),
    time: '19:00',
    location: 'jakarta-pusat',
    partySize: 4,
    contactPerson: 'Bapak Didi',
    contactPhone: '+62 812-3456-7890'
  };

  const incompleteReservation: ReservationData = {
    date: new Date(),
    time: '20:30',
    partySize: 2
  };

  const minimalReservation: ReservationData = {
    date: 'Minggu, 15 Desember 2024',
    time: '18:00',
    location: 'bandung'
  };
</script>

<div class="space-y-8 p-6">
  <h1 class="text-3xl font-bold text-center mb-8">ReservationSummary Examples</h1>

  <!-- Complete Reservation - Elegant -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Complete Reservation - Elegant Variant</h2>
    <ReservationSummary 
      reservationData={sampleReservation}
      {branches}
      variant="elegant"
    />
  </div>

  <!-- Complete Reservation - Default -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Complete Reservation - Default Variant</h2>
    <ReservationSummary 
      reservationData={sampleReservation}
      {branches}
      variant="default"
    />
  </div>

  <!-- Complete Reservation - Minimal -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Complete Reservation - Minimal Variant</h2>
    <ReservationSummary 
      reservationData={sampleReservation}
      {branches}
      variant="minimal"
    />
  </div>

  <!-- Incomplete Reservation -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Incomplete Reservation</h2>
    <ReservationSummary 
      reservationData={incompleteReservation}
      {branches}
      variant="elegant"
    />
  </div>

  <!-- String Date Format -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">String Date Format</h2>
    <ReservationSummary 
      reservationData={minimalReservation}
      {branches}
      variant="default"
    />
  </div>

  <!-- Custom Title -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Custom Title</h2>
    <ReservationSummary 
      reservationData={sampleReservation}
      {branches}
      variant="elegant"
      title="Booking Summary"
    />
  </div>

  <!-- No Contact Info -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">No Contact Information</h2>
    <ReservationSummary 
      reservationData={{
        date: new Date(),
        time: '21:00',
        location: 'surabaya',
        partySize: 6
      }}
      {branches}
      variant="minimal"
    />
  </div>

  <!-- Comparison Grid -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Variant Comparison</h2>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <h3 class="text-lg font-medium mb-2">Elegant</h3>
        <ReservationSummary 
          reservationData={sampleReservation}
          {branches}
          variant="elegant"
        />
      </div>
      <div>
        <h3 class="text-lg font-medium mb-2">Default</h3>
        <ReservationSummary 
          reservationData={sampleReservation}
          {branches}
          variant="default"
        />
      </div>
      <div>
        <h3 class="text-lg font-medium mb-2">Minimal</h3>
        <ReservationSummary 
          reservationData={sampleReservation}
          {branches}
          variant="minimal"
        />
      </div>
    </div>
  </div>
</div>