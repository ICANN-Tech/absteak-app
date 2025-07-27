<script>
  import { fly } from 'svelte/transition';
  import AnimateOnScroll from './AnimateOnScroll.svelte';
  import { Button } from 'flowbite-svelte';
</script>

<AnimateOnScroll animation="fly" duration={700} y={50}>
  <section class="py-16 flex flex-col items-center bg-primary-light" id="reservation">
    <h2 class="text-2xl font-bold text-white mb-4">Reserve Your Table</h2>
    <p class="text-white mb-6">Book your spot for an unforgettable dining experience.</p>
    <Button href="mailto:reservations@savoria.com" color="yellow" pill outline>Book Now</Button>
  </section>
</AnimateOnScroll> 