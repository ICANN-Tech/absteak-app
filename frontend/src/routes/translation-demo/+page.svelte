<script lang="ts">
  import { createTranslationStore, t } from '$lib/utils/translation';
  
  // Create translation store for footer namespace
  const footerT = createTranslationStore('footer');
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Variables for interpolation
  const variables = {
    year: currentYear,
    name: 'ABSteak Restaurant'
  };
</script>

<div class="p-8 space-y-8">
  <h1 class="text-3xl font-bold text-center mb-8">Translation Variable Interpolation Demo</h1>
  
  <div class="space-y-6">
    <div class="bg-gray-100 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Using t() function with variables</h2>
      <div class="space-y-2">
        <p><strong>Raw translation:</strong> "© {{year}} {{name}}. All rights reserved."</p>
        <p><strong>With variables:</strong> {t('copyright', undefined, variables)}</p>
      </div>
    </div>
    
    <div class="bg-blue-50 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Using createTranslationStore with variables</h2>
      <div class="space-y-2">
        <p><strong>Footer namespace copyright:</strong></p>
        <p class="text-lg">{$footerT('copyright', undefined, variables)}</p>
      </div>
    </div>
    
    <div class="bg-green-50 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Different variable combinations</h2>
      <div class="space-y-2">
        <p><strong>Only year:</strong> {$footerT('copyright', undefined, { year: currentYear })}</p>
        <p><strong>Only name:</strong> {$footerT('copyright', undefined, { name: 'My Restaurant' })}</p>
        <p><strong>Custom values:</strong> {$footerT('copyright', undefined, { year: 2025, name: 'Future Restaurant' })}</p>
      </div>
    </div>
    
    <div class="bg-yellow-50 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Other footer translations</h2>
      <div class="space-y-2">
        <p><strong>Tagline:</strong> {$footerT('tagline')}</p>
        <p><strong>Address:</strong> {$footerT('address')}</p>
        <p><strong>Phone:</strong> {$footerT('phone')}</p>
        <p><strong>Email:</strong> {$footerT('email')}</p>
      </div>
    </div>
    
    <div class="bg-purple-50 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Usage Examples</h2>
      <div class="space-y-4">
        <div>
          <h3 class="font-semibold">In JavaScript/TypeScript:</h3>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>{`import { t } from '$lib/utils/translation';

const variables = {
  year: new Date().getFullYear(),
  name: 'ABSteak Restaurant'
};

const copyrightText = t('copyright', undefined, variables);`}</code></pre>
        </div>
        
        <div>
          <h3 class="font-semibold">In Svelte component:</h3>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>{`<script>
  import { createTranslationStore } from '$lib/utils/translation';
  
  const footerT = createTranslationStore('footer');
  const variables = { year: 2024, name: 'ABSteak' };
</script>

<p>{$footerT('copyright', undefined, variables)}</p>`}</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>