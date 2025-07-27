<script>
  import { CheckCircleOutline, AngleLeftOutline, AngleRightOutline } from 'flowbite-svelte-icons';
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  let current = 0;
  let timer;
  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      title: 'Custom Parties',
      price: '$99',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      items: [
        'Ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit.',
        'Ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      ],
      detail: 'Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
    },
    {
      img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=600&q=80',
      title: 'Birthday Events',
      price: '$150',
      desc: 'Celebrate your birthday with us! Enjoy great food and atmosphere.',
      items: [
        'Special birthday menu and cake.',
        'Free drinks for the birthday person.',
        'Live music and decorations.'
      ],
      detail: 'Contact us for more details and reservations.'
    }
  ];
  function goTo(idx) {
    current = idx;
    resetTimer();
  }
  function prev() {
    current = (current - 1 + slides.length) % slides.length;
    resetTimer();
  }
  function next() {
    current = (current + 1) % slides.length;
    resetTimer();
  }
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => next(), 6000);
  }
  onMount(() => {
    timer = setInterval(() => next(), 6000);
    return () => clearInterval(timer);
  });
  onDestroy(() => clearInterval(timer));
</script>

<section class="relative w-full min-h-[480px] flex items-center justify-center overflow-hidden bg-black">
  {#key current}
    <img src={slides[current].img} alt="bg" class="absolute inset-0 w-full h-full object-cover z-0" transition:fade={{ duration: 900 }} draggable="false" />
  {/key}
  <div class="absolute inset-0 bg-black/70 z-10 transition-colors duration-500 pointer-events-none"></div>
  <!-- Navigasi panah -->
  <button class="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-yellow-400 rounded-full p-2 transition" on:click={prev} aria-label="Previous">
    <AngleLeftOutline class="w-8 h-8" />
  </button>
  <button class="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-yellow-400 rounded-full p-2 transition" on:click={next} aria-label="Next">
    <AngleRightOutline class="w-8 h-8" />
  </button>
  <div class="relative z-20 flex flex-col md:flex-row w-full max-w-5xl items-center gap-8 px-4 py-12 animate-fadein">
    {#key current}
      <div class="w-full flex flex-col md:flex-row items-center gap-8" transition:fade={{ duration: 700 }}>
        <div class="w-full md:w-1/2 flex justify-center">
          <img src={slides[current].img} alt={slides[current].title} class="rounded-lg shadow-lg w-full max-w-md object-cover aspect-video" />
        </div>
        <div class="w-full md:w-1/2 text-white">
          <h2 class="text-3xl md:text-4xl font-cursive mb-2">{slides[current].title}</h2>
          <div class="text-2xl font-bold mb-2">{slides[current].price}</div>
          <p class="italic mb-4">{slides[current].desc}</p>
          <ul class="mb-4 space-y-2">
            {#each slides[current].items as item}
              <li class="flex items-start gap-2">
                <span class="mt-1 text-yellow-400">
                  <CheckCircleOutline class="w-5 h-5" />
                </span>
                <span>{item}</span>
              </li>
            {/each}
          </ul>
          <p>{slides[current].detail}</p>
        </div>
      </div>
    {/key}
  </div>
  <!-- Navigation dots -->
  <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
    {#each slides as _, i}
      <span class="w-3 h-3 rounded-full transition-all duration-200 {i === current ? 'bg-yellow-400' : 'bg-white/40'} cursor-pointer" on:click={() => goTo(i)}></span>
    {/each}
  </div>
</section>

<style>
  @keyframes fadein {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: none; }
  }
  .animate-fadein {
    animation: fadein 0.8s;
  }
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style> 