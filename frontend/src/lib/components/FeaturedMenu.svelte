<script>
  import { fade } from 'svelte/transition';
  import AnimateOnScroll from './AnimateOnScroll.svelte';
  const dishes = [
    { name: "Truffle Risotto", desc: "Creamy risotto with wild mushrooms and truffle oil.", img: "/src/lib/images/svelte-welcome.png" },
    { name: "Seared Salmon", desc: "Fresh salmon fillet with lemon butter sauce.", img: "/src/lib/images/svelte-logo.svg" },
    { name: "Classic Margherita Pizza", desc: "Wood-fired pizza with fresh mozzarella and basil.", img: "/src/lib/images/svelte-welcome.webp" }
  ];
</script>

<section class="py-16 bg-white" id="menu">
  <h2 class="text-2xl font-bold text-center text-primary mb-10">Featured Menu</h2>
  <div class="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto px-4">
    {#each dishes as dish (dish.name)}
      <AnimateOnScroll animation="fade" duration={700}>
        <div class="bg-primary/10 rounded-lg shadow-lg p-6 flex flex-col items-center">
          <img src={dish.img} alt={dish.name} class="w-32 h-32 object-cover rounded-full mb-4 shadow" />
          <h3 class="text-xl font-semibold text-primary mb-2">{dish.name}</h3>
          <p class="text-gray-700 text-center">{dish.desc}</p>
        </div>
      </AnimateOnScroll>
    {/each}
  </div>
</section> 