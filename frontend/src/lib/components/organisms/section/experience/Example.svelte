<script lang="ts">
  import ExperienceSection from './Index.svelte';

  // Custom images untuk contoh
  const customLeftImages = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  ];

  const customRightImages = [
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80',
  ];

  // Custom heights untuk variasi yang berbeda
  const customLeftHeights = ['h-40', 'h-64', 'h-48', 'h-72', 'h-56', 'h-60'];
  const customRightHeights = ['h-56', 'h-44', 'h-68', 'h-52', 'h-64', 'h-48'];

  // Cafe theme images
  const cafeLeftImages = [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
  ];

  const cafeRightImages = [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
  ];
</script>

<div class="space-y-8">
  <div class="p-6 bg-gray-100 rounded-lg">
    <h1 class="text-3xl font-bold mb-4">Experience Section - Usage Examples</h1>
    <p class="text-gray-600 mb-6">
      Berikut adalah berbagai contoh penggunaan komponen Experience Section dengan konfigurasi yang berbeda.
    </p>
  </div>

  <!-- Example 1: Default Usage -->
  <div class="space-y-4">
    <div class="p-4 bg-blue-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">1. Default Usage</h2>
      <p class="text-gray-600 text-sm">
        Penggunaan default tanpa props tambahan. Menggunakan konten dan gambar default Gordon Ramsay.
      </p>
      <div class="mt-2 p-2 bg-gray-800 rounded text-green-400 text-sm font-mono">
        &lt;ExperienceSection /&gt;
      </div>
    </div>
    <div class="h-screen border-2 border-gray-300 rounded-lg overflow-hidden">
      <ExperienceSection />
    </div>
  </div>

  <!-- Example 2: Custom Text Content -->
  <div class="space-y-4">
    <div class="p-4 bg-green-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">2. Custom Text Content</h2>
      <p class="text-gray-600 text-sm">
        Menggunakan konten teks yang dikustomisasi untuk brand atau restaurant yang berbeda.
      </p>
      <div class="mt-2 p-2 bg-gray-800 rounded text-green-400 text-sm font-mono">
        &lt;ExperienceSection<br>
        &nbsp;&nbsp;title="DISCOVER CULINARY EXCELLENCE"<br>
        &nbsp;&nbsp;description="Experience the finest dining..."<br>
        &nbsp;&nbsp;subtitle="Visit our locations worldwide..."<br>
        /&gt;
      </div>
    </div>
    <div class="h-screen border-2 border-gray-300 rounded-lg overflow-hidden">
      <ExperienceSection 
        title="DISCOVER CULINARY EXCELLENCE"
        description="Experience the finest dining with our world-class chefs and premium ingredients. Every dish tells a story of passion, creativity, and culinary mastery."
        subtitle="Visit our locations in New York, London, Tokyo, and Paris. Each restaurant offers a unique atmosphere while maintaining our signature quality and service."
      />
    </div>
  </div>

  <!-- Example 3: Custom Images and Heights -->
  <div class="space-y-4">
    <div class="p-4 bg-purple-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">3. Custom Images and Heights</h2>
      <p class="text-gray-600 text-sm">
        Menggunakan gambar custom dan variasi tinggi yang berbeda untuk menciptakan visual yang unik.
      </p>
      <div class="mt-2 p-2 bg-gray-800 rounded text-green-400 text-sm font-mono">
        &lt;ExperienceSection<br>
        &nbsp;&nbsp;leftColumnImages={customLeftImages}<br>
        &nbsp;&nbsp;rightColumnImages={customRightImages}<br>
        &nbsp;&nbsp;leftColumnHeights={customLeftHeights}<br>
        &nbsp;&nbsp;rightColumnHeights={customRightHeights}<br>
        /&gt;
      </div>
    </div>
    <div class="h-screen border-2 border-gray-300 rounded-lg overflow-hidden">
      <ExperienceSection 
        leftColumnImages={customLeftImages}
        rightColumnImages={customRightImages}
        leftColumnHeights={customLeftHeights}
        rightColumnHeights={customRightHeights}
      />
    </div>
  </div>

  <!-- Example 4: Cafe Theme -->
  <div class="space-y-4">
    <div class="p-4 bg-amber-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">4. Cafe Theme</h2>
      <p class="text-gray-600 text-sm">
        Contoh penggunaan untuk tema cafe dengan gambar dan konten yang sesuai.
      </p>
      <div class="mt-2 p-2 bg-gray-800 rounded text-green-400 text-sm font-mono">
        &lt;ExperienceSection<br>
        &nbsp;&nbsp;title="COZY CAFE EXPERIENCE"<br>
        &nbsp;&nbsp;description="Enjoy artisanal coffee..."<br>
        &nbsp;&nbsp;leftColumnImages={cafeLeftImages}<br>
        &nbsp;&nbsp;rightColumnImages={cafeRightImages}<br>
        &nbsp;&nbsp;backgroundImage="cafe-bg.jpg"<br>
        /&gt;
      </div>
    </div>
    <div class="h-screen border-2 border-gray-300 rounded-lg overflow-hidden">
      <ExperienceSection 
        title="COZY CAFE EXPERIENCE"
        description="Enjoy artisanal coffee and freshly baked pastries in our warm, welcoming atmosphere. Every cup is crafted with care using premium beans from around the world."
        subtitle="Find us in downtown locations across the city. Perfect for meetings, study sessions, or simply relaxing with friends."
        leftColumnImages={cafeLeftImages}
        rightColumnImages={cafeRightImages}
        backgroundImage="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80"
      />
    </div>
  </div>

  <!-- Example 5: Minimal Heights -->
  <div class="space-y-4">
    <div class="p-4 bg-red-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">5. Minimal Heights Variation</h2>
      <p class="text-gray-600 text-sm">
        Menggunakan variasi tinggi yang lebih minimal untuk tampilan yang lebih seragam.
      </p>
      <div class="mt-2 p-2 bg-gray-800 rounded text-green-400 text-sm font-mono">
        &lt;ExperienceSection<br>
        &nbsp;&nbsp;leftColumnHeights={['h-52', 'h-56', 'h-52', 'h-56', 'h-52', 'h-56']}<br>
        &nbsp;&nbsp;rightColumnHeights={['h-56', 'h-52', 'h-56', 'h-52', 'h-56', 'h-52']}<br>
        /&gt;
      </div>
    </div>
    <div class="h-screen border-2 border-gray-300 rounded-lg overflow-hidden">
      <ExperienceSection 
        leftColumnHeights={['h-52', 'h-56', 'h-52', 'h-56', 'h-52', 'h-56']}
        rightColumnHeights={['h-56', 'h-52', 'h-56', 'h-52', 'h-56', 'h-52']}
      />
    </div>
  </div>

  <!-- Props Documentation -->
  <div class="p-6 bg-gray-50 rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Props Documentation</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-medium mb-2">Text Content Props</h3>
        <ul class="space-y-1 text-sm text-gray-600">
          <li><code class="bg-gray-200 px-1 rounded">title</code> - Judul utama section</li>
          <li><code class="bg-gray-200 px-1 rounded">description</code> - Deskripsi utama</li>
          <li><code class="bg-gray-200 px-1 rounded">subtitle</code> - Sub deskripsi</li>
          <li><code class="bg-gray-200 px-1 rounded">backgroundImage</code> - URL background image</li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-medium mb-2">Visual Props</h3>
        <ul class="space-y-1 text-sm text-gray-600">
          <li><code class="bg-gray-200 px-1 rounded">leftColumnImages</code> - Array URL gambar kolom kiri</li>
          <li><code class="bg-gray-200 px-1 rounded">rightColumnImages</code> - Array URL gambar kolom kanan</li>
          <li><code class="bg-gray-200 px-1 rounded">leftColumnHeights</code> - Array class tinggi kolom kiri</li>
          <li><code class="bg-gray-200 px-1 rounded">rightColumnHeights</code> - Array class tinggi kolom kanan</li>
        </ul>
      </div>
    </div>
  </div>
</div>