<script lang="ts">
  import { Datepicker } from './index';
  
  let basicDate: Date | undefined = undefined;
  let elegantDate: Date | undefined = undefined;
  let minimalDate: Date | undefined = undefined;
  let errorDate: Date | undefined = undefined;
  let successDate: Date | undefined = new Date();
  let disabledDate: Date | undefined = new Date();
</script>

<div class="p-8 space-y-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
  <h1 class="text-3xl font-bold text-white mb-8">Datepicker Component Examples</h1>
  
  <!-- Basic Example -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">Basic Datepicker</h2>
    <div class="max-w-md">
      <Datepicker 
        bind:value={basicDate}
        label="Pilih Tanggal"
        placeholder="Klik untuk memilih tanggal"
      />
    </div>
    <p class="text-gray-400 text-sm">
      Selected: {basicDate ? basicDate.toLocaleDateString('id-ID') : 'Belum dipilih'}
    </p>
  </div>

  <!-- Elegant Variant -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">Elegant Variant</h2>
    <div class="max-w-md">
      <Datepicker 
        bind:value={elegantDate}
        label="Tanggal Reservasi"
        variant="elegant"
        required
        placeholder="Pilih tanggal reservasi"
      />
    </div>
    <p class="text-gray-400 text-sm">
      Selected: {elegantDate ? elegantDate.toLocaleDateString('id-ID') : 'Belum dipilih'}
    </p>
  </div>

  <!-- Minimal Variant -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">Minimal Variant</h2>
    <div class="max-w-md">
      <Datepicker 
        bind:value={minimalDate}
        label="Tanggal Acara"
        variant="minimal"
        placeholder="Kapan acaranya?"
      />
    </div>
    <p class="text-gray-400 text-sm">
      Selected: {minimalDate ? minimalDate.toLocaleDateString('id-ID') : 'Belum dipilih'}
    </p>
  </div>

  <!-- Error State -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">Error State</h2>
    <div class="max-w-md">
      <Datepicker 
        bind:value={errorDate}
        label="Tanggal dengan Error"
        variant="elegant"
        error="Tanggal harus diisi dan tidak boleh di masa lalu"
        required
      />
    </div>
  </div>

  <!-- Success State -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">Success State</h2>
    <div class="max-w-md">
      <Datepicker 
        bind:value={successDate}
        label="Tanggal Valid"
        variant="elegant"
        success="Tanggal berhasil dipilih!"
      />
    </div>
  </div>

  <!-- Disabled State -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">Disabled State</h2>
    <div class="max-w-md">
      <Datepicker 
        bind:value={disabledDate}
        label="Tanggal Disabled"
        variant="elegant"
        disabled
      />
    </div>
  </div>

  <!-- All Variants Side by Side -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">All Variants Comparison</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 class="text-lg font-medium text-white mb-2">Default</h3>
        <Datepicker 
          label="Default Style"
          variant="default"
          placeholder="Default variant"
        />
      </div>
      <div>
        <h3 class="text-lg font-medium text-white mb-2">Elegant</h3>
        <Datepicker 
          label="Elegant Style"
          variant="elegant"
          placeholder="Elegant variant"
        />
      </div>
      <div>
        <h3 class="text-lg font-medium text-white mb-2">Minimal</h3>
        <Datepicker 
          label="Minimal Style"
          variant="minimal"
          placeholder="Minimal variant"
        />
      </div>
    </div>
  </div>

  <!-- Form Example -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-white">Form Integration Example</h2>
    <form class="max-w-md space-y-4 p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700/50">
      <Datepicker 
        label="Tanggal Lahir"
        variant="elegant"
        required
        placeholder="Pilih tanggal lahir"
      />
      <Datepicker 
        label="Tanggal Mulai Kerja"
        variant="elegant"
        placeholder="Kapan mulai bekerja?"
      />
      <button 
        type="submit" 
        class="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200"
      >
        Submit
      </button>
    </form>
  </div>
</div>