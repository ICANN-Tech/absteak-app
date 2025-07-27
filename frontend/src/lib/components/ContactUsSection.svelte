<script>
  // Data kontak dan state form
  let name = '';
  let email = '';
  let message = '';
  let submitted = false;
  let error = '';

  import { MapPinOutline, EnvelopeOutline, PhoneOutline } from 'flowbite-svelte-icons';

  const contactInfo = [
    {
      label: 'Location',
      value: 'A108 Adam Street, New York, NY 535022',
      icon: '📍',
      desc: 'Location'
    },
    {
      label: 'Email',
      value: 'info@example.com',
      icon: '✉️',
      desc: 'Email'
    },
    {
      label: 'Call',
      value: '+1 5589 55488 55',
      icon: '📱',
      desc: 'Call'
    }
  ];

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !message) {
      error = 'Please fill in all fields.';
      return;
    }
    // Simulasi submit
    submitted = true;
    error = '';
    name = email = message = '';
  }
</script>

<section class="w-full py-24 bg-white" id="contact">
  <div class="flex flex-col items-center mb-10">
    <span class="bg-yellow-100 text-yellow-600 px-5 py-1 rounded-full text-sm font-semibold mb-4">CONTACT US</span>
    <h2 class="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-2">
      Get In <span class="text-yellow-400 font-cursive">Touch</span>
    </h2>
  </div>
  <div class="max-w-6xl h-full mx-auto flex flex-col md:flex-row gap-8 px-4">
    <!-- Info Kontak -->
    <div class="md:w-1/2 bg-white rounded-xl shadow p-10 flex flex-col gap-6">
      <div class="mb-2">
        <h3 class="text-2xl font-cursive text-gray-800 mb-2">Get in touch</h3>
        <div class="text-gray-500 text-base mb-4">Et id eius voluptates atque nihil voluptatem enim in tempore minima sit ad mollitia commodi minus.</div>
      </div>
      <div class="flex flex-col gap-6">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <MapPinOutline class="w-6 h-6 text-yellow-500" />
            <span class="font-cursive font-bold text-gray-700 text-lg">Location:</span>
          </div>
          <div class="text-gray-700 text-base ml-8">A108 Adam Street, New York, NY 535022</div>
        </div>
        <div class="border-t border-gray-200 my-1"></div>
        <div>
          <div class="flex items-center gap-3 mb-1">
            <EnvelopeOutline class="w-6 h-6 text-yellow-500" />
            <span class="font-cursive font-bold text-gray-700 text-lg">Email:</span>
          </div>
          <div class="text-gray-700 text-base ml-8">info@example.com</div>
        </div>
        <div class="border-t border-gray-200 my-1"></div>
        <div>
          <div class="flex items-center gap-3 mb-1">
            <PhoneOutline class="w-6 h-6 text-yellow-500" />
            <span class="font-cursive font-bold text-gray-700 text-lg">Call:</span>
          </div>
          <div class="text-gray-700 text-base ml-8">+1 5589 55488 55</div>
        </div>
      </div>
    </div>
    <!-- Form Kontak -->
    <div class="md:w-3/4 h-full flex flex-col md:flex-row gap-8 items-center md:items-start">
      <form class="flex-1 border-l md:pl-8 md:border-l md:border-gray-200 flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-col gap-2">
          <label for="name" class="text-gray-700 font-semibold">Name</label>
          <input id="name" type="text" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" bind:value={name} />
        </div>
        <div class="flex flex-col gap-2">
          <label for="email" class="text-gray-700 font-semibold">Email</label>
          <input id="email" type="email" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" bind:value={email} />
        </div>
        <div class="flex flex-col gap-2">
          <label for="message" class="text-gray-700 font-semibold">Message</label>
          <textarea id="message" rows="4" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" bind:value={message}></textarea>
        </div>
        {#if error}
          <div class="text-red-500 text-sm">{error}</div>
        {/if}
        {#if submitted}
          <div class="text-green-600 text-sm">Thank you for contacting us!</div>
        {/if}
        <button type="submit" class="mt-2 px-6 py-2 bg-yellow-400 text-white font-bold rounded hover:bg-yellow-500 transition">Send Message</button>
      </form>
    </div>
  </div>
</section>

<style>
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style> 