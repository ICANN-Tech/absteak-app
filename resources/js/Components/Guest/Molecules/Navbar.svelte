<script>
  import Logo from '../../Global/Atoms/Logo.svelte';
  import Button from '../Atoms/Button.svelte';
  import Icon from '../Atoms/Icon.svelte';
  
  export let transparent = false;
  export let fixed = true;
  
  let mobileMenuOpen = false;
  
  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservations', href: '/reservations' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  $: navClasses = `w-full z-50 transition-all duration-300 ${
    fixed ? 'fixed top-0' : 'relative'
  } ${
    transparent ? 'bg-transparent' : 'bg-white shadow-md'
  }`;
</script>

<nav class={navClasses}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <Logo size="md" variant="full" />
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-8">
          {#each navigationItems as item}
            <a 
              href={item.href} 
              class="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
      
      <!-- Desktop CTA Button -->
      <div class="hidden md:block">
        <Button variant="primary" size="sm" href="/reservations">
          Book Table
        </Button>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          on:click={toggleMobileMenu}
          class="text-gray-700 hover:text-red-600 p-2 transition-colors"
        >
          <Icon name={mobileMenuOpen ? 'close' : 'menu'} size="md" />
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile Navigation Menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-white border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        {#each navigationItems as item}
          <a 
            href={item.href} 
            class="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium transition-colors"
            on:click={() => mobileMenuOpen = false}
          >
            {item.name}
          </a>
        {/each}
        <div class="px-3 py-2">
          <Button variant="primary" size="sm" href="/reservations" onclick={() => mobileMenuOpen = false}>
            Book Table
          </Button>
        </div>
      </div>
    </div>
  {/if}
</nav>