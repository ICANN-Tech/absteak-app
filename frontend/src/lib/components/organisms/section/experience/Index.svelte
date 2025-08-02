<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
  import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import LeftContainer from './LeftContainer.svelte';
	import RightContainer from './RightContainer.svelte';

  const backgroundImage: string = CONTAINER_SECTION.experience.backgroundPatternImageUrl;
  const animationType: 'fly' | 'fade' | 'scale' | 'slide' = 'fly';
  const animationY: number = 40;
  const animationDuration: number = 700;
</script>

<script lang="ts">
  // Props untuk layout dan styling
  export let backgroundColor: string = '#fdf6ee';
  export let layout_direction: 'normal' | 'reverse' = 'normal';
  export let containerClass: string = '';
  
  $: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
  $: sectionClasses = `${CONTAINER_SECTION.experience.base} ${containerClass}`;
  $: sectionStyle = `background-color: ${backgroundColor}; background-image: url('${backgroundImage}'); background-repeat: repeat; background-size: cover;`;
  $: contentContainerClasses = `${CONTAINER_SECTION.experience.content.base} ${flexDirection}`;
</script>

<AnimateOnScroll animation={animationType} y={animationY} duration={animationDuration}>
  <section class={sectionClasses} style={sectionStyle}>
    <div class={contentContainerClasses}>
      <LeftContainer />
      <RightContainer />
    </div>
  </section>
</AnimateOnScroll>