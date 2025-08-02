<script lang="ts">
  import { Button, LogoIcon } from '$lib/components/atoms';
  import { createTranslationStore } from '$lib/utils/translation';
	import { CONTAINER_SECTION } from '$lib/const';
  
  import HeroCarousel from '$lib/components/organisms/carousel/hero/Index.svelte';
  
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
  <div class={CONTAINER_SECTION.hero.base}>
    <div class={CONTAINER_SECTION.hero.content.centered}>
      <!-- Logo -->
      <div class={CONTAINER_SECTION.hero.logo.base}>
        <LogoIcon size="2xl" />
      </div>
      
      <!-- Description -->
      <p class={CONTAINER_SECTION.hero.text.description}>
        {$t('hero.description', 'Experience the finest culinary journey with premium steaks grilled to perfection.')}
      </p>
      
      <!-- Button Group -->
      <div class={CONTAINER_SECTION.hero.buttons.container}>
        <Button href="#menu" color="yellow" pill outline>{$t('hero.menuButton', 'Menu')}</Button>
        <Button href="#reservation" variant="warning" pill outline>{$t('hero.bookButton', 'Book')}</Button>
      </div>
    </div>
  </div>
</HeroCarousel>