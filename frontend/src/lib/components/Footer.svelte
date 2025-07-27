<script>
  import NewsletterSection from '$lib/components/NewsletterSection.svelte';
  import { FacebookSolid, TwitterSolid, LinkedinSolid, InstagramSolid, YoutubeSolid, MapPinOutline, EnvelopeOutline, PhoneSolid } from 'flowbite-svelte-icons';
</script>

<section class="flex h-screen w-full bg-white pt-24 flex-col flex-wrap justify-stretch">
  <NewsletterSection />

<footer class="bg-primary-900 text-white pt-16 pb-8 mt-auto overflow-hidden">
  <!-- Diagonal top -->
  <div class="absolute top-0 left-0 w-full h-16 bg-white" style="clip-path: polygon(0 0, 100% 0, 100% 10%, 0 100%);"></div>
  <div class="relative max-w-7xl mx-auto px-4 flex flex-col gap-8">
    <!-- Social media row -->
    <div class="flex justify-end gap-4 mb-2">
      <a href="#" aria-label="Facebook" class="hover:text-primary-300 transition-colors"><FacebookSolid class="w-5 h-5" /></a>
      <a href="#" aria-label="Twitter" class="hover:text-primary-300 transition-colors"><TwitterSolid class="w-5 h-5" /></a>
      <a href="#" aria-label="LinkedIn" class="hover:text-primary-300 transition-colors"><LinkedinSolid class="w-5 h-5" /></a>
      <a href="#" aria-label="Instagram" class="hover:text-primary-300 transition-colors"><InstagramSolid class="w-5 h-5" /></a>
      <a href="#" aria-label="YouTube" class="hover:text-primary-300 transition-colors"><YoutubeSolid class="w-5 h-5" /></a>
    </div>
    <div class="flex flex-col md:flex-row gap-8 justify-between items-start">
      <!-- Logo & tagline -->
      <div class="flex-1 min-w-[180px] flex flex-col gap-2">
        <div class="flex items-center gap-2 mb-2">
          <div class="bg-white rounded-lg p-2 shadow-sm"><span class="text-primary-700 font-extrabold text-2xl">R</span></div>
          <span class="font-bold text-xl tracking-wide">REAL HOMES</span>
        </div>
        <div class="text-primary-200 text-sm">Simply #1 Real Estate Theme</div>
      </div>
      <!-- Quick Links -->
      <div class="flex-1 min-w-[180px] flex flex-col gap-2">
        <div class="font-bold mb-2 border-b border-primary-600 pb-2">Quick Links</div>
        <div class="grid grid-cols-2 gap-x-8 text-primary-200 text-sm">
          <div class="flex flex-col gap-2">
            <a href="#" class="hover:text-white transition-colors flex items-center gap-1"><span class="text-primary-300">&#9654;</span> Home</a>
            <a href="#" class="hover:text-white transition-colors flex items-center gap-1"><span class="text-primary-300">&#9654;</span> Blog</a>
          </div>
          <div class="flex flex-col gap-2">
            <a href="#" class="hover:text-white transition-colors flex items-center gap-1"><span class="text-primary-300">&#9654;</span> List Layout</a>
            <a href="#" class="hover:text-white transition-colors flex items-center gap-1"><span class="text-primary-300">&#9654;</span> Contact</a>
          </div>
        </div>
      </div>
      <!-- Contact Us -->
      <div class="flex-1 min-w-[220px] flex flex-col gap-2">
        <div class="font-bold mb-2 border-b border-primary-600 pb-2">Contact Us</div>
        <div class="flex items-start gap-2 text-primary-200 text-sm mb-2 hover:text-white transition-colors">
          <MapPinOutline class="w-5 h-5 mt-0.5 text-primary-300" />
          <div>3015 Grand Ave, Coconut Grove,<br />Merrick Way, FL 12345</div>
        </div>
        <div class="flex items-center gap-2 text-primary-200 text-sm mb-2 hover:text-white transition-colors">
          <PhoneSolid class="w-4 h-4 text-primary-300" />
          <span>+123-456-789</span>
        </div>
        <div class="flex items-center gap-2 text-primary-200 text-sm hover:text-white transition-colors">
          <EnvelopeOutline class="w-5 h-5 text-primary-300" />
          <span>sales@example.com</span>
        </div>
      </div>
      <!-- Remain Updated -->
      <div class="flex-1 min-w-[220px] flex flex-col gap-2">
        <div class="font-bold mb-2 border-b border-primary-600 pb-2">Remain Updated</div>
        <input type="email" placeholder="Your email address" class="rounded-md p-3 text-gray-900 w-full mb-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
        <button class="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-md transition-colors w-fit shadow-md">Sign up</button>
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-between items-center text-primary-300 text-xs mt-8 gap-2 border-t border-primary-600 pt-4">
      <div>© 2023. All rights reserved.</div>
      <div>Designed by Inspiry Themes</div>
    </div>
  </div>
</footer>
</section>