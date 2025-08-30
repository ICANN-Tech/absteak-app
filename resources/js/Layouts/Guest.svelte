<script>
  import Header from '../Components/Guest/Organisme/Header.svelte';
  import Footer from '../Components/Guest/Organisme/Footer.svelte';
  import FloatingActionButton from '../Components/Guest/Molecules/FloatingActionButton.svelte';
  
  // Layout props
  export let title = 'ABSteak - Premium Steakhouse';
  export let description = 'Experience the finest steakhouse dining with premium cuts, exceptional service, and an unforgettable atmosphere.';
  export let showHero = false;
  export let transparentHeader = false;
  export let fixedHeader = true;
  export let showFloatingButton = true;
  export let floatingButtonConfig = {
    icon: 'phone',
    href: 'tel:+15551234567',
    tooltip: 'Call for Reservations',
    position: 'bottom-right',
    variant: 'primary'
  };
  
  // SEO and meta data
  $: {
    if (typeof document !== 'undefined') {
      document.title = title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
      }
    }
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-white">
  <!-- Header -->
  <Header 
    transparent={transparentHeader} 
    fixed={fixedHeader} 
    heroSection={showHero} 
  />
  
  <!-- Main Content -->
  <main class="flex-1" class:pt-16={fixedHeader && !showHero} class:pt-0={!fixedHeader || showHero}>
    <slot />
  </main>
  
  <!-- Footer -->
  <Footer />
  
  <!-- Floating Action Button -->
  {#if showFloatingButton}
    <FloatingActionButton 
      icon={floatingButtonConfig.icon}
      href={floatingButtonConfig.href}
      tooltip={floatingButtonConfig.tooltip}
      position={floatingButtonConfig.position}
      variant={floatingButtonConfig.variant}
    />
  {/if}
</div>

<style>
  /* Global styles for the guest layout */
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
  }
  
  /* Ensure proper spacing when header is fixed */
  .pt-16 {
    padding-top: 4rem;
  }
  
  .pt-0 {
    padding-top: 0;
  }
  
  /* Custom scrollbar for webkit browsers */
  :global(::-webkit-scrollbar) {
    width: 8px;
  }
  
  :global(::-webkit-scrollbar-track) {
    background: #f1f1f1;
  }
  
  :global(::-webkit-scrollbar-thumb) {
    background: #dc2626;
    border-radius: 4px;
  }
  
  :global(::-webkit-scrollbar-thumb:hover) {
    background: #b91c1c;
  }
  
  /* Focus styles for accessibility */
  :global(*:focus) {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
  
  /* Animation utilities */
  :global(.fade-in) {
    animation: fadeIn 0.6s ease-in-out;
  }
  
  :global(.slide-up) {
    animation: slideUp 0.6s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>