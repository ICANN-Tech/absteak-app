<script>
  // Dummy data
  const items = [
    'Ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit.',
    'Ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ];
</script>

<section class="relative w-full min-h-[480px] flex items-center justify-center overflow-hidden rounded-xl mb-20">
  <!-- Background overlay -->
  <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" alt="Background" class="absolute inset-0 w-full h-full object-cover z-0" />
  <div class="absolute inset-0 bg-black/70 z-10"></div>

  <div class="relative z-20 flex flex-col md:flex-row w-full max-w-6xl items-center gap-8 px-4 py-12">
    <!-- Left: Dummy image -->
    <div class="w-full md:w-1/2 flex justify-center">
      <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" alt="Custom Party" class="rounded-lg shadow-lg w-full max-w-md object-cover aspect-video" />
    </div>
    <!-- Right: Content -->
    <div class="w-full md:w-1/2 text-white">
      <h2 class="text-3xl md:text-4xl font-cursive mb-2">Custom Parties</h2>
      <div class="text-2xl font-bold mb-2">$99</div>
      <p class="italic mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <ul class="mb-4 space-y-2">
        {#each items as item}
          <li class="flex items-start gap-2">
            <span class="mt-1 text-yellow-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
      <p>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
    </div>
  </div>
  <!-- Navigation dots -->
  <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
    <span class="w-3 h-3 rounded-full bg-white/40"></span>
    <span class="w-3 h-3 rounded-full bg-white/40"></span>
    <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
    <span class="w-3 h-3 rounded-full bg-white/40"></span>
  </div>
</section>

<style>
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style> 