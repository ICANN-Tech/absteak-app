<script lang="ts">
  import GuestLayout from '../Layouts/Guest.svelte';
  import Button from '../Components/Guest/Atoms/Button.svelte';
  import Icon from '../Components/Guest/Atoms/Icon.svelte';
  
  // Page configuration
  const pageConfig = {
    title: 'ABSteak - Premium Steakhouse Experience',
    description: 'Experience the finest steakhouse dining with premium cuts, exceptional service, and an unforgettable atmosphere in the heart of the city.',
    showHero: true,
    transparentHeader: true,
    showFloatingButton: true,
    floatingButtonConfig: {
      icon: 'phone',
      href: 'tel:+15551234567',
      tooltip: 'Call for Reservations',
      position: 'bottom-right',
      variant: 'primary'
    }
  };
  
  // Featured sections data
  const features = [
    {
      icon: 'star',
      title: 'Premium Quality',
      description: 'Only the finest cuts of beef, aged to perfection and grilled by our master chefs.'
    },
    {
      icon: 'user',
      title: 'Exceptional Service',
      description: 'Our professional staff ensures every detail of your dining experience is perfect.'
    },
    {
      icon: 'location',
      title: 'Prime Location',
      description: 'Located in the heart of the culinary district with elegant ambiance and atmosphere.'
    }
  ];
  
  const stats = [
    { number: '25+', label: 'Years of Excellence' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '100+', label: 'Premium Dishes' },
    { number: '5★', label: 'Average Rating' }
  ];
</script>

<GuestLayout {...pageConfig}>
  <!-- Welcome Section -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span class="text-red-600">ABSteak</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Where culinary artistry meets exceptional hospitality. Our commitment to quality and service 
          has made us the premier destination for steak lovers for over two decades.
        </p>
      </div>
      
      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {#each features as feature}
          <div class="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
              <Icon name={feature.icon} size="lg" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
            <p class="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        {/each}
      </div>
      
      <!-- Stats Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {#each stats as stat}
          <div class="p-4">
            <div class="text-3xl md:text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
            <div class="text-gray-600 font-medium">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- Menu Preview Section -->
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Signature <span class="text-red-600">Selections</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our most popular dishes, crafted with passion and served with pride.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- Menu Item 1 -->
        <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gradient-to-br from-red-400 to-red-600"></div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Prime Ribeye</h3>
            <p class="text-gray-600 mb-4">28-day aged premium ribeye with herb butter and seasonal vegetables.</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$48</span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        </div>
        
        <!-- Menu Item 2 -->
        <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gradient-to-br from-gray-400 to-gray-600"></div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Wagyu Tenderloin</h3>
            <p class="text-gray-600 mb-4">Japanese A5 Wagyu with truffle sauce and roasted root vegetables.</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$85</span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        </div>
        
        <!-- Menu Item 3 -->
        <div class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gradient-to-br from-yellow-400 to-orange-600"></div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Surf & Turf</h3>
            <p class="text-gray-600 mb-4">Grilled lobster tail with filet mignon and garlic mashed potatoes.</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$65</span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <Button variant="primary" size="lg" href="/menu">
          View Full Menu
        </Button>
      </div>
    </div>
  </section>
  
  <!-- Reservation CTA Section -->
  <section class="py-16 bg-red-600 text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        Ready for an Unforgettable Experience?
      </h2>
      <p class="text-xl mb-8 opacity-90">
        Reserve your table today and discover why ABSteak is the city's premier steakhouse destination.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="secondary" size="lg" href="/reservations">
          <Icon name="calendar" size="sm" color="currentColor" />
          <span class="ml-2">Make Reservation</span>
        </Button>
        <Button variant="outline" size="lg" href="tel:+15551234567">
          <Icon name="phone" size="sm" color="currentColor" />
          <span class="ml-2">Call Now</span>
        </Button>
      </div>
    </div>
  </section>
</GuestLayout>