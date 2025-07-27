<script lang="ts">
  import { ScrollableImage } from '$lib/components/molecules/media';

  // Props untuk customization
  export let title = 'EXPERIENCE GORDON RAMSAY ACROSS NORTH AMERICA';
  export let description = 'Visit world-renowned, Michelin-starred Chef Gordon Ramsay\'s restaurants across North America. Whether you have a taste for gourmet burgers, a Chef-Ramsay-classic beef wellington, or a new twist on a local favorite, your experience will be excellent.';
  export let subtitle = 'Join us on the Las Vegas Strip, Baltimore, Atlantic City, Southern Indiana, NYC, Naperville, D.C., OKC, Orlando, Tahoe, Kansas City, Southern California, Chicago, Miami, Reno, Vancouver, and Boston. We can\'t wait to serve you.';
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
        {title}
      </h2>
      <p class="text-gray-700 text-lg mb-4">
        {description}
      </p>
      <p class="text-gray-700 text-base mb-8">
        {subtitle}
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