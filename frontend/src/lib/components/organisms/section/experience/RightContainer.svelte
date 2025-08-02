<script context="module" lang="ts">
	import { ScrollableImage } from "$lib/components/molecules";
	import { CONTAINER_RESPONSIVE, CONTAINER_SECTION } from "$lib/const";
</script>

<script lang="ts">
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
  export let leftColumnHeights: string[] = ['h-48', 'h-72', 'h-56', 'h-80', 'h-64', 'h-60'];
  export let rightColumnHeights: string[] = ['h-64', 'h-52', 'h-76', 'h-68', 'h-56', 'h-72'];

  $: imageContainerClasses = `${CONTAINER_SECTION.experience.content.right}`;
</script>

<div class={`${imageContainerClasses}`}>
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