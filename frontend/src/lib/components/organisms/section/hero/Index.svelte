<script lang="ts">
  import HeroCarousel from '$lib/components/organisms/carousel/hero/Index.svelte';
  import { Button } from '$lib/components/atoms';
  import {LogoIcon} from '$lib/components/atoms';
  import { createTranslationStore } from '$lib/utils/translation';
  
  const t = createTranslationStore();

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
    
    <p class="text-white text-base md:text-lg max-w-2xl font-cursive mb-8 font-medium">
      {$t('hero.description', 'Experience the finest culinary journey with premium steaks grilled to perfection.')}
    </p>
    <div class="flex gap-4 justify-center">
      <Button href="#menu" color="yellow" pill outline>{$t('hero.menuButton', 'Menu')}</Button>
      <Button href="#reservation" variant="warning" pill outline>{$t('hero.bookButton', 'Book')}</Button>
    </div>
  </div>
</HeroCarousel> 

<style>
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style>