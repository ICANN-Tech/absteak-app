<script lang="ts">
  import Input from '$lib/components/atoms/input/Index.svelte';
  import Dropdown from '$lib/components/atoms/dropdown/Index.svelte';

  let inputValue = '';
  let emailValue = '';
  let passwordValue = '';
  let dropdownValue = '';
  let searchableDropdownValue = '';

  const countryOptions = [
    { value: 'id', label: 'Indonesia' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'jp', label: 'Japan' },
    { value: 'kr', label: 'South Korea' },
    { value: 'sg', label: 'Singapore' },
    { value: 'my', label: 'Malaysia' },
    { value: 'th', label: 'Thailand' },
    { value: 'vn', label: 'Vietnam' },
    { value: 'ph', label: 'Philippines' }
  ];

  const categoryOptions = [
    { value: 'starters', label: 'Starters' },
    { value: 'mains', label: 'Main Courses' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'wine', label: 'Wine Selection' }
  ];

  function handleDropdownChange(event: CustomEvent) {
    console.log('Dropdown changed:', event.detail);
  }
</script>

<svelte:head>
  <title>Form Components Demo - Restaurant</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
  <!-- Background overlay -->
  <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/65"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
  
  <div class="relative z-10 container mx-auto px-6 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-2xl">
        FORM <span class="text-amber-400 drop-shadow-lg">COMPONENTS</span>
      </h1>
      <p class="text-gray-200 text-lg drop-shadow-lg leading-relaxed max-w-2xl mx-auto">
        Elegant and reusable input and dropdown components with beautiful styling
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <!-- Input Components Section -->
      <div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-6 drop-shadow-lg">
          Input Components
        </h2>
        
        <div class="space-y-6">
          <!-- Basic Input -->
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            bind:value={inputValue}
            variant="elegant"
            required
          />

          <!-- Email Input with Icon -->
          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            bind:value={emailValue}
            variant="elegant"
            icon="fas fa-envelope"
            required
          />

          <!-- Password Input -->
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            bind:value={passwordValue}
            variant="elegant"
            icon="fas fa-lock"
            required
          />

          <!-- Input with Success State -->
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+62 812 3456 7890"
            value="+62 812 3456 7890"
            variant="elegant"
            icon="fas fa-phone"
            success="Phone number verified!"
            readonly
          />

          <!-- Input with Error State -->
          <Input
            label="Website URL"
            type="url"
            placeholder="https://example.com"
            value="invalid-url"
            variant="elegant"
            icon="fas fa-globe"
            error="Please enter a valid URL"
          />
        </div>
      </div>

      <!-- Dropdown Components Section -->
      <div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-6 drop-shadow-lg">
          Dropdown Components
        </h2>
        
        <div class="space-y-6">
          <!-- Basic Dropdown -->
          <Dropdown
            label="Country"
            placeholder="Select your country"
            bind:value={dropdownValue}
            options={countryOptions}
            variant="elegant"
            icon="fas fa-flag"
            required
            on:change={handleDropdownChange}
          />

          <!-- Searchable Dropdown -->
          <Dropdown
            label="Menu Category"
            placeholder="Choose a category"
            bind:value={searchableDropdownValue}
            options={categoryOptions}
            variant="elegant"
            icon="fas fa-utensils"
            searchable
            clearable
            on:change={handleDropdownChange}
          />

          <!-- Dropdown with Success State -->
          <Dropdown
            label="Reservation Time"
            placeholder="Select time slot"
            value="19:00"
            options={[
              { value: '18:00', label: '6:00 PM' },
              { value: '18:30', label: '6:30 PM' },
              { value: '19:00', label: '7:00 PM' },
              { value: '19:30', label: '7:30 PM' },
              { value: '20:00', label: '8:00 PM' },
              { value: '20:30', label: '8:30 PM' }
            ]}
            variant="elegant"
            icon="fas fa-clock"
            success="Time slot confirmed!"
          />

          <!-- Dropdown with Error State -->
          <Dropdown
            label="Party Size"
            placeholder="Number of guests"
            value=""
            options={[
              { value: '1', label: '1 Guest' },
              { value: '2', label: '2 Guests' },
              { value: '3', label: '3 Guests' },
              { value: '4', label: '4 Guests' },
              { value: '5', label: '5 Guests' },
              { value: '6+', label: '6+ Guests' }
            ]}
            variant="elegant"
            icon="fas fa-users"
            error="Please select number of guests"
            required
          />
        </div>
      </div>
    </div>

    <!-- Different Variants Section -->
    <div class="mt-12 bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-2xl">
      <h2 class="text-2xl font-bold text-white mb-6 drop-shadow-lg text-center">
        Different Variants
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Default Variant -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-amber-400">Default Variant</h3>
          <Input
            label="Name"
            placeholder="Enter name"
            variant="default"
          />
          <Dropdown
            label="Option"
            placeholder="Select option"
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' }
            ]}
            variant="default"
          />
        </div>

        <!-- Elegant Variant -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-amber-400">Elegant Variant</h3>
          <Input
            label="Name"
            placeholder="Enter name"
            variant="elegant"
          />
          <Dropdown
            label="Option"
            placeholder="Select option"
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' }
            ]}
            variant="elegant"
          />
        </div>

        <!-- Minimal Variant -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-amber-400">Minimal Variant</h3>
          <Input
            label="Name"
            placeholder="Enter name"
            variant="minimal"
          />
          <Dropdown
            label="Option"
            placeholder="Select option"
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' }
            ]}
            variant="minimal"
          />
        </div>
      </div>
    </div>

    <!-- Values Display -->
    <div class="mt-8 bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
      <h3 class="text-lg font-semibold text-white mb-4">Current Values:</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="text-gray-300">
          <strong class="text-amber-400">Input Value:</strong> {inputValue || 'Empty'}
        </div>
        <div class="text-gray-300">
          <strong class="text-amber-400">Email:</strong> {emailValue || 'Empty'}
        </div>
        <div class="text-gray-300">
          <strong class="text-amber-400">Password:</strong> {passwordValue ? '••••••••' : 'Empty'}
        </div>
        <div class="text-gray-300">
          <strong class="text-amber-400">Country:</strong> {dropdownValue || 'Not selected'}
        </div>
        <div class="text-gray-300">
          <strong class="text-amber-400">Category:</strong> {searchableDropdownValue || 'Not selected'}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Enhanced text shadows untuk better readability */
  .drop-shadow-2xl {
    filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(0, 0, 0, 0.6));
  }

  .drop-shadow-lg {
    filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.4));
  }

  /* Smooth transitions untuk semua elemen */
  * {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Enhanced backdrop blur effect */
  .backdrop-blur-sm {
    backdrop-filter: blur(4px) saturate(1.2);
  }
</style>