<script lang="ts">
  import ChefSection from './Index.svelte';
</script>

<div class="space-y-8">
  <div class="p-6 bg-gray-100 rounded-lg">
    <h1 class="text-3xl font-bold mb-4">Chef Section - Usage Examples</h1>
    <p class="text-gray-600 mb-6">
      Berikut adalah contoh penggunaan komponen Chef Section yang menampilkan informasi chef dengan layout yang responsif.
    </p>
  </div>

  <!-- Example 1: Default Usage -->
  <div class="space-y-4">
    <div class="p-4 bg-blue-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">1. Default Usage</h2>
      <p class="text-gray-600 text-sm">
        Penggunaan default dengan konten Akira Back yang sudah terdefinisi.
      </p>
      <div class="mt-2 p-2 bg-gray-800 rounded text-green-400 text-sm font-mono">
        &lt;ChefSection /&gt;
      </div>
    </div>
    <div class="h-screen border-2 border-gray-300 rounded-lg overflow-hidden">
      <ChefSection />
    </div>
  </div>

  <!-- Component Structure -->
  <div class="p-6 bg-gray-50 rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Component Structure</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-medium mb-2">Layout Features</h3>
        <ul class="space-y-1 text-sm text-gray-600">
          <li>• <strong>Responsive Design</strong> - Mobile-first approach</li>
          <li>• <strong>Two-Column Layout</strong> - Image left, content right</li>
          <li>• <strong>Full Height</strong> - Takes full screen height</li>
          <li>• <strong>Warm Color Scheme</strong> - Cream background (#fdf6ee)</li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-medium mb-2">Content Elements</h3>
        <ul class="space-y-1 text-sm text-gray-600">
          <li>• <strong>Chef Image</strong> - High-quality portrait</li>
          <li>• <strong>Chef Name</strong> - Bold, prominent typography</li>
          <li>• <strong>Featured Quote</strong> - Personal statement</li>
          <li>• <strong>Biography</strong> - Professional background</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Current Content -->
  <div class="p-6 bg-amber-50 rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Current Content</h2>
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-medium mb-2">Chef: Akira Back</h3>
        <div class="bg-white p-4 rounded border-l-4 border-amber-400">
          <p class="text-gray-700 italic mb-2">
            "I love Jakarta. It is an amazing city that is a melting pot of culture just like my food. It's always been a place near and dear to me that I personally relate good with."
          </p>
          <p class="text-gray-600 text-sm">
            Hailing from the picturesque landscapes of Korea and nurtured amid the scenic beauty of Aspen, Colorado, Chef Akira Back infuses his culinary endeavours with a spirit of exploration and innovation. Originally a professional snowboarder, Back transitioned seamlessly into the culinary world, making his mark as the youngest executive chef for Nobu Matsuhisa.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Technical Details -->
  <div class="p-6 bg-green-50 rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Technical Implementation</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-medium mb-2">CSS Classes Used</h3>
        <ul class="space-y-1 text-sm text-gray-600 font-mono">
          <li>• <code class="bg-gray-200 px-1 rounded">h-screen</code> - Full height</li>
          <li>• <code class="bg-gray-200 px-1 rounded">md:flex-row</code> - Desktop layout</li>
          <li>• <code class="bg-gray-200 px-1 rounded">bg-[#fdf6ee]</code> - Custom background</li>
          <li>• <code class="bg-gray-200 px-1 rounded">md:w-1/2</code> - Half width columns</li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-medium mb-2">Responsive Breakpoints</h3>
        <ul class="space-y-1 text-sm text-gray-600">
          <li>• <strong>Mobile</strong> - Stacked layout</li>
          <li>• <strong>Tablet+</strong> - Side-by-side columns</li>
          <li>• <strong>Desktop</strong> - Optimized spacing</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Future Enhancements -->
  <div class="p-6 bg-purple-50 rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Future Enhancements</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-medium mb-2">Planned Props</h3>
        <ul class="space-y-1 text-sm text-gray-600">
          <li>• <code class="bg-gray-200 px-1 rounded">chefName</code> - Dynamic chef name</li>
          <li>• <code class="bg-gray-200 px-1 rounded">chefImage</code> - Custom image URL</li>
          <li>• <code class="bg-gray-200 px-1 rounded">quote</code> - Personal quote</li>
          <li>• <code class="bg-gray-200 px-1 rounded">biography</code> - Chef background</li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-medium mb-2">Additional Features</h3>
        <ul class="space-y-1 text-sm text-gray-600">
          <li>• Multiple chef profiles</li>
          <li>• Animation effects</li>
          <li>• Social media integration</li>
          <li>• Awards showcase</li>
        </ul>
      </div>
    </div>
  </div>
</div>