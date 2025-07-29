<script lang="ts">
  import { ScrollableImage } from '$lib/components/molecules/media';
  import { createTranslationStore } from '$lib/utils/translation';

  const t = createTranslationStore();

  // Props untuk customization - menggunakan translasi sebagai default
  export let title: string = '';
  export let description: string = '';
  export let subtitle: string = '';
  export let backgroundImage = 'https://res.cloudinary.com/gordonramsay/image/upload/c_fill,w_1920,h_640,q_auto,f_auto/Gordon%20Ramsay%20Restaurants%20-%20NA/default-light-bg_dddsi4';
  
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
</script>

<section 
  class="w-full h-screen" 
  style="background-image: url('{backgroundImage}'); background-repeat: repeat; background-size: cover;"
>
  <div class="mx-auto flex flex-col md:flex-row h-full">
    <!-- Left: Text -->
    <div class="md:w-1/2 flex flex-col justify-center p-10 md:p-16">
      <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        {title || $t('experience.title') || 'PENGALAMAN KULINER PREMIUM ABSTEAK'}
      </h2>
      <p class="text-gray-700 text-lg mb-4">
        {description || $t('experience.description') || 'Nikmati pengalaman kuliner istimewa di ABSteak dengan hidangan steak premium yang disiapkan oleh chef berpengalaman. Setiap hidangan dibuat dengan dedikasi tinggi untuk memberikan cita rasa yang tak terlupakan dan pengalaman bersantap yang luar biasa.'}
      </p>
      <p class="text-gray-700 text-base mb-8">
        {subtitle || $t('experience.subtitle') || 'Bergabunglah dengan kami untuk merasakan kelezatan steak premium, teknik memasak terdepan, dan pelayanan berkelas dunia. Kami siap melayani Anda dengan pengalaman kuliner yang tak akan pernah Anda lupakan.'}
      </p>
    </div>
    
    <!-- Right: Infinite scrolling image columns -->
    <div class="md:w-1/2 flex h-full overflow-hidden">
      <!-- Left column - scrolling up -->
      <div class="w-1/2">
        <ScrollableImage 
          images={leftColumnImages}
          heights={leftColumnHeights}
          animationClass="animate-scroll-up"
        />
      </div>
      
      <!-- Right column - scrolling down -->
      <div class="w-1/2">
        <ScrollableImage 
          images={rightColumnImages}
          heights={rightColumnHeights}
          animationClass="animate-scroll-down"
        />
      </div>
    </div>
  </div>
</section>