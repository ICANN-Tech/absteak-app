<script>
  import { Button } from "flowbite-svelte";

  const specials = [
    {
      title: 'Modi sit est',
      desc: 'Architecto ut aperiam autem id',
      subdesc: 'Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka',
      detail: 'Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero',
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Unde praesentium sed',
      desc: 'Voluptas vel esse repudiandae quo excepturi',
      subdesc: 'Quisquam facilis cum velit laborum corrupti fuga rerum quia',
      detail: 'Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero',
      img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Pariatur explicabo vel',
      desc: 'Nostrum qui quasi',
      subdesc: 'Quisquam facilis cum velit laborum corrupti fuga rerum quia',
      detail: 'Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero',
      img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Nostrum qui quasi',
      desc: 'Iusto ut expedita aut',
      subdesc: 'Quisquam facilis cum velit laborum corrupti fuga rerum quia',
      detail: 'Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero',
      img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Iusto ut expedita aut',
      desc: 'Architecto ut aperiam autem id',
      subdesc: 'Quisquam facilis cum velit laborum corrupti fuga rerum quia',
      detail: 'Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero',
      img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'
    }
  ];
  let selected = 0;
</script>

<section class="w-full py-24 bg-white" id="specials">
  <div class="flex flex-col items-center mb-10">
    <span class="bg-yellow-100 text-yellow-600 px-5 py-1 rounded-full text-sm font-semibold mb-4">SPECIALS</span>
    <h2 class="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-2">
      Check Our <span class="text-yellow-400 font-cursive">Specials</span>
    </h2>
  </div>
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4">
    <!-- List -->
    <div class="md:w-1/4 flex flex-col gap-2">
      {#each specials as s, i}
        <Button
          class="text-left hover:text-yellow-600 {i === selected ? 'border-yellow-400 bg-yellow-50 text-yellow-500 hover:text-white' : 'border-transparent bg-white text-gray-800 hover:bg-yellow-50'}"
          onclick={() => selected = i}
          outline color="yellow"
        >{s.title}</Button>
      {/each}
    </div>
    <!-- Detail -->
    <div class="md:w-3/4 flex flex-col md:flex-row gap-8 items-center md:items-start">
      <div class="flex-1 border-l md:pl-8 md:border-l md:border-gray-200">
        <h3 class="text-2xl font-cursive text-gray-800 mb-2">{specials[selected].desc}</h3>
        <div class="italic text-gray-500 mb-2">{specials[selected].subdesc}</div>
        <div class="text-gray-700 text-base">{specials[selected].detail}</div>
      </div>
      <img src={specials[selected].img} alt={specials[selected].title} class="w-64 h-64 object-cover rounded-full shadow-lg bg-white" />
    </div>
  </div>
</section>

<style>
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style> 