<script lang="ts">
  import { ScrollableImage } from '$lib/components/molecules/media';
	import { CONTAINER_SECTION, CONTAINER_RESPONSIVE } from '$lib/const';
  import { createTranslationStore } from '$lib/utils/translation';
  import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';

  const t = createTranslationStore();

  // Props untuk customization - menggunakan translasi sebagai default
  export let title: string = '';
  export let description: string = '';
  export let subtitle: string = '';
  export let backgroundImage = CONTAINER_SECTION.experience.backgroundPatternImageUrl;
  
  // Props untuk layout dan styling
  export let backgroundColor: string = '#fdf6ee';
  export let layout_direction: 'normal' | 'reverse' = 'normal';
  export let containerClass: string = '';
  export let contentClass: string = '';
  export let imageClass: string = '';

  // Props untuk animasi
  export let animationType: 'fly' | 'fade' | 'scale' | 'slide' = 'fly';
  export let animationY: number = 40;
  export let animationDuration: number = 700;
  
  export let leftColumnImages: string[] = [
    'https://absteakjkt.com/wp-content/uploads/2024/04/AboutUs-Image-1024x683.png',
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    'https://absteakjkt.com/wp-content/uploads/2024/03/A5-Ribeye-Cap-1024x1024.jpg',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    'https://absteakjkt.com/wp-content/uploads/2024/04/ABSteak-Bar.png',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80',
  ];
  
  export let rightColumnImages: string[] = [
    'https://absteakjkt.com/wp-content/uploads/2024/04/ABSteak-Bar.png',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80',
    'https://absteakjkt.com/wp-content/uploads/2024/04/AboutUs-Image-1024x683.png',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    'https://absteakjkt.com/wp-content/uploads/2024/03/A5-Ribeye-Cap-1024x1024.jpg',
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  ];

  // Array tinggi yang bervariasi untuk membuat ukuran gambar tidak sama rata
  export let leftColumnHeights: string[] = ['h-48', 'h-72', 'h-56', 'h-80', 'h-64', 'h-60'];
  export let rightColumnHeights: string[] = ['h-64', 'h-52', 'h-76', 'h-68', 'h-56', 'h-72'];

  // Computed classes dengan struktur 2 kolom responsive
  $: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
  $: sectionClasses = `${CONTAINER_SECTION.experience.base} ${containerClass}`;
  $: sectionStyle = `background-color: ${backgroundColor}; background-image: url('${backgroundImage}'); background-repeat: repeat; background-size: cover;`;
  $: contentContainerClasses = `${CONTAINER_SECTION.experience.content.base} ${flexDirection}`;
  $: textContainerClasses = `${CONTAINER_SECTION.experience.content.left} ${CONTAINER_RESPONSIVE.text.base}`;
  $: imageContainerClasses = `${CONTAINER_SECTION.experience.content.right}`;
</script>

<AnimateOnScroll animation={animationType} y={animationY} duration={animationDuration}>
  <section class={sectionClasses} style={sectionStyle}>
    <!-- Container dengan 2 kolom responsive -->
    <div class={contentContainerClasses}>
      <!-- Text Content Container (Kolom Kiri) -->
      <div class={`${textContainerClasses} ${contentClass}`}>
        <!-- Content dalam 1 baris vertikal ke bawah -->
        <div class={CONTAINER_SECTION.experience.flex}>
          <!-- Title -->
          <h2 class={CONTAINER_SECTION.experience.text.title}>
            {title || $t('experience.title') || 'PENGALAMAN KULINER PREMIUM ABSTEAK'}
          </h2>

          <!-- Description -->
          <p class={CONTAINER_SECTION.experience.text.description}>
            {description || $t('experience.description') || 'Nikmati pengalaman kuliner istimewa di ABSteak dengan hidangan steak premium yang disiapkan oleh chef berpengalaman. Setiap hidangan dibuat dengan dedikasi tinggi untuk memberikan cita rasa yang tak terlupakan dan pengalaman bersantap yang luar biasa.'}
          </p>

          <!-- Subtitle -->
          <p class={CONTAINER_SECTION.experience.text.subtitle}>
            {subtitle || $t('experience.subtitle') || 'Bergabunglah dengan kami untuk merasakan kelezatan steak premium, teknik memasak terdepan, dan pelayanan berkelas dunia. Kami siap melayani Anda dengan pengalaman kuliner yang tak akan pernah Anda lupakan.'}
          </p>
        </div>

        <!-- Slot untuk konten tambahan -->
        <slot name="additional-content" />
      </div>

      <!-- Image Container (Kolom Kanan) -->
      <div class={`${imageContainerClasses} ${imageClass}`}>
        <!-- Left column - scrolling up -->
        <div class={CONTAINER_SECTION.experience.scrollableImage.left}>
          <ScrollableImage 
            images={leftColumnImages}
            heights={leftColumnHeights}
            animationClass="animate-scroll-up"
          />
        </div>
        
        <!-- Right column - scrolling down -->
        <div class={CONTAINER_SECTION.experience.scrollableImage.right}>
          <ScrollableImage 
            images={rightColumnImages}
            heights={rightColumnHeights}
            animationClass="animate-scroll-down"
          />
        </div>
      </div>
    </div>

    <!-- Slot untuk konten custom di luar layout standar -->
    <slot />
  </section>
</AnimateOnScroll>