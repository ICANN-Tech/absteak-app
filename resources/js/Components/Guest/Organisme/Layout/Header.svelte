<script>
  import Navbar from '../../Molecules/Navbar.svelte';
  
  export let transparent = false;
  export let fixed = true;
  export let heroSection = false;
  
  // If there's a hero section, make navbar transparent initially
  $: navTransparent = heroSection ? transparent : false;
</script>

<header class="relative">
  <Navbar transparent={navTransparent} {fixed} />
  
  {#if heroSection}
    <div class="relative bg-gradient-to-r from-red-900 to-red-700 text-white">
      <!-- Hero Background Image Overlay -->
      <div class="absolute inset-0 bg-black opacity-40"></div>
      
      <!-- Hero Content -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Premium Steakhouse
            <span class="block text-red-300">Experience</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            das in the finest cuts of meat, expertly prepared and served in an elegant atmosphere that defines luxury dining.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/reservations" 
              class="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              Reserve Your Table
            </a>
            <a 
              href="/menu" 
              class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-900 transition-colors text-lg"
            >
              View Menu
            </a>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  {/if}
</header>

<style>
  /* Add background image for hero section */
  .relative.bg-gradient-to-r {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="steak" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="50" cy="50" r="2" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23steak)"/></svg>');
    background-size: cover;
    background-position: center;
    min-height: 100vh;
  }
</style>