<script lang="ts">
  import HeroCarousel from '$lib/components/organisms/carousel/hero/Index.svelte';
  import { Button } from '$lib/components/atoms';
  import {LogoIcon} from '$lib/components/atoms';
  
  function scrollToMenu() {
    const menu = document.getElementById('menu');
    if (menu) menu.scrollIntoView({ behavior: 'smooth' });
  }

  const images: { url: string }[] = [
    {
      url: 'https://bootstrapmade.com/content/demo/Delicious/assets/img/hero-carousel/hero-carousel-1.jpg',
    },
    {
      url: 'https://bootstrapmade.com/content/demo/Delicious/assets/img/hero-carousel/hero-carousel-2.jpg',
    }
  ]
</script>

<HeroCarousel carouselId='top' {images}>
  <div class="relative z-20 flex flex-col gap-8 justify-center items-center">
    <LogoIcon className="ml-10" size="2xl" />
    
    <p class="text-white text-base md:text-lg max-w-2xl font-cursive mb-8 font-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <div class="flex gap-4 justify-center">
      <Button href="#menu" color="yellow" pill outline>Menu</Button>
      <Button href="#reservation" variant="warning" pill outline>Book</Button>
    </div>
  </div>
</HeroCarousel> 

<style>
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style>