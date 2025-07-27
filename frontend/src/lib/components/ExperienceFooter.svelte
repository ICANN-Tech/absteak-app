<script>
  import { FacebookSolid, InstagramSolid, TwitterSolid } from 'flowbite-svelte-icons';
</script>

<footer class="bg-gray-900 text-white py-8 mt-0">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
    <div class="flex items-center gap-3">
      <span class="font-cursive text-2xl font-bold text-yellow-400">Gordon Ramsay</span>
      <span class="text-gray-400 text-sm">Restaurants</span>
    </div>
    <div class="flex gap-4 mt-4 md:mt-0">
      <a href="#" aria-label="Instagram" class="hover:text-yellow-400 transition">
        <InstagramSolid class="w-6 h-6" />
      </a>
      <a href="#" aria-label="Facebook" class="hover:text-yellow-400 transition">
        <FacebookSolid class="w-6 h-6" />
      </a>
      <a href="#" aria-label="Twitter" class="hover:text-yellow-400 transition">
        <TwitterSolid class="w-6 h-6" />
      </a>
    </div>
    <div class="text-gray-400 text-xs mt-4 md:mt-0">&copy; {new Date().getFullYear()} Gordon Ramsay Restaurants. All rights reserved.</div>
  </div>
</footer>

<style>
  .font-cursive {
    font-family: 'Pacifico', cursive;
  }
</style> 