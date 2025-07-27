<script>
  const items = [
    {
      number: '01',
      title: 'Lorem Ipsum',
      desc: 'Ulamco laboris nisi ut aliquip ex ea commodo consequat. Et consectetur ducimus vero placeat.'
    },
    {
      number: '02',
      title: 'Repellat Nihil',
      desc: 'Dolorem est fugiat occaecati voluptate velit esse. Dicta veritatis dolor quod et vel dire leno para dest'
    },
    {
      number: '03',
      title: 'Ad ad velit qui',
      desc: 'Molestiae officiis omnis illo asperiores. Aut doloribus vitae sunt debitis quo vel nam quis'
    }
  ];
</script>

<section class="w-full py-24 bg-white">
  <div class="flex flex-col items-center mb-12">
    <span class="bg-yellow-100 text-yellow-600 px-5 py-1 rounded-full text-sm font-semibold mb-4">WHY US</span>
    <h2 class="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-2">
      Why choose <span class="text-yellow-400 font-cursive">Our Restaurant</span>
    </h2>
  </div>
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
    {#each items as item}
      <div class="bg-gray-50 rounded-lg p-8 flex flex-col items-start shadow-sm">
        <span class="text-2xl font-bold text-yellow-400 mb-2">{item.number}</span>
        <h3 class="text-xl font-cursive text-gray-800 mb-2">{item.title}</h3>
        <p class="text-gray-500 text-base">{item.desc}</p>
      </div>
    {/each}
  </div>
</section>

<style>
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style> 