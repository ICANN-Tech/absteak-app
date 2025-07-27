<script lang="ts">
  import HeroCarousel from '../Index.svelte';

  // Contoh images custom - menggunakan gambar yang reliable
  const customImages = [
    {
      url: 'https://via.placeholder.com/1920x1080/FF6B6B/FFFFFF?text=Restaurant+1'
    },
    {
      url: 'https://via.placeholder.com/1920x1080/4ECDC4/FFFFFF?text=Restaurant+2'
    },
    {
      url: 'https://via.placeholder.com/1920x1080/45B7D1/FFFFFF?text=Restaurant+3'
    }
  ];

  const pizzaImages = [
    {
      url: 'https://via.placeholder.com/1920x1080/F7DC6F/000000?text=Pizza+Special'
    },
    {
      url: 'https://via.placeholder.com/1920x1080/BB8FCE/FFFFFF?text=Italian+Cuisine'
    }
  ];

  const fastImages = [
    {
      url: 'https://via.placeholder.com/1920x1080/58D68D/FFFFFF?text=Fast+1'
    },
    {
      url: 'https://via.placeholder.com/1920x1080/F8C471/000000?text=Fast+2'
    },
    {
      url: 'https://via.placeholder.com/1920x1080/85C1E9/000000?text=Fast+3'
    }
  ];
</script>

<div class="space-y-8">
  <h1 class="text-3xl font-bold text-center mb-8">Hero Carousel Examples</h1>

  <!-- Example 1: Default Usage -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">1. Default Usage</h2>
    <div class="h-96">
      <HeroCarousel />
    </div>
  </section>

  <!-- Example 2: Custom Images -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">2. Custom Images</h2>
    <div class="h-96">
      <HeroCarousel 
        images={customImages}
        title="Fine Dining"
        subtitle="Experience"
        description="Discover exceptional culinary artistry in an elegant atmosphere where every dish tells a story."
      />
    </div>
  </section>

  <!-- Example 3: Pizza Restaurant -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">3. Pizza Restaurant Theme</h2>
    <div class="h-96">
      <HeroCarousel 
        carouselId="pizza-hero"
        images={pizzaImages}
        interval={4000}
        title="Mario's"
        subtitle="Pizzeria"
        description="Authentic Italian pizza made with fresh ingredients and traditional recipes passed down through generations."
        primaryButtonText="View Menu"
        primaryButtonHref="#pizza-menu"
        secondaryButtonText="Order Now"
        secondaryButtonHref="#order"
      />
    </div>
  </section>

  <!-- Example 4: Fast Transition -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">4. Fast Transition (2 seconds)</h2>
    <div class="h-96">
      <HeroCarousel 
        carouselId="fast-hero"
        images={fastImages}
        interval={2000}
        title="Quick"
        subtitle="Bites"
        description="Fast, fresh, and delicious meals for people on the go."
        primaryButtonText="Quick Order"
        primaryButtonHref="#quick-order"
        secondaryButtonText="Locations"
        secondaryButtonHref="#locations"
      />
    </div>
  </section>
</div>

<style>
  section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }
</style>