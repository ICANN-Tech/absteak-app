<script lang="ts">
  import TimePicker from './Time.svelte';
  
  // Sample time slots
  const timeSlots = [
    { time: '17:00', available: true, label: 'Early Dinner' },
    { time: '17:30', available: true },
    { time: '18:00', available: true },
    { time: '18:30', available: false },
    { time: '19:00', available: true, label: 'Prime Time' },
    { time: '19:30', available: true },
    { time: '20:00', available: true },
    { time: '20:30', available: false },
    { time: '21:00', available: true },
    { time: '21:30', available: true, label: 'Late Dinner' }
  ];

  // State variables
  let selectedTime1 = '';
  let selectedTime2 = '';
  let selectedTime3 = '';
  let selectedTime4 = '';
</script>

<div class="p-8 space-y-12 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-white mb-2">TimePicker Component Examples</h1>
    <p class="text-gray-300 mb-8">Demonstrasi berbagai penggunaan komponen TimePicker</p>

    <!-- Basic Example -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-white mb-4">Basic Usage</h2>
      <div class="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <TimePicker
          {timeSlots}
          bind:selectedTime={selectedTime1}
          label="Pilih Waktu Reservasi"
          columns={4}
        />
        <p class="mt-4 text-gray-300">Selected: <span class="text-orange-400 font-semibold">{selectedTime1 || 'None'}</span></p>
      </div>
    </section>

    <!-- Elegant Variant -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-white mb-4">Elegant Variant</h2>
      <div class="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <TimePicker
          {timeSlots}
          bind:selectedTime={selectedTime2}
          variant="elegant"
          label="Elegant Style"
          columns={4}
        />
        <p class="mt-4 text-gray-300">Selected: <span class="text-orange-400 font-semibold">{selectedTime2 || 'None'}</span></p>
      </div>
    </section>

    <!-- Minimal Variant -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-white mb-4">Minimal Variant</h2>
      <div class="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <TimePicker
          {timeSlots}
          bind:selectedTime={selectedTime3}
          variant="minimal"
          label="Minimal Style"
          columns={4}
        />
        <p class="mt-4 text-gray-300">Selected: <span class="text-orange-400 font-semibold">{selectedTime3 || 'None'}</span></p>
      </div>
    </section>

    <!-- Error State -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-white mb-4">Error State</h2>
      <div class="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <TimePicker
          {timeSlots}
          bind:selectedTime={selectedTime4}
          variant="elegant"
          label="Waktu Reservasi"
          error="Silakan pilih waktu yang tersedia"
          required
          columns={4}
        />
      </div>
    </section>

    <!-- Code Example -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-white mb-4">Code Example</h2>
      <div class="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <pre class="text-sm text-gray-300 overflow-x-auto"><code>{`<script>
  import { TimePicker } from '$lib/components/molecules';
  
  const timeSlots = [
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: false },
    { time: '18:30', available: true }
  ];
  
  let selectedTime = '';
</script>

<TimePicker
  {timeSlots}
  bind:selectedTime
  variant="elegant"
  label="Pilih Waktu"
  columns={4}
  required
/>`}</code></pre>
      </div>
    </section>
  </div>
</div>