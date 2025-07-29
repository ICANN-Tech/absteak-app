<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility.js';

	// Create area-based visibility for testing
	const visibility = createAreaBasedStateVisibility('test-component', {
		targetArea: 'center',
		proximityRadius: 100,
		areaOffset: 0,
		initialVisible: false,
		hideDelay: 1000
	});

	const { isVisible, finalVisible, showComponent, setShowComponent, updatePosition } = visibility;

	let testElement: HTMLElement;

	// Update position when element is available
	$: if (testElement) {
		updatePosition(testElement);
	}

	onDestroy(() => {
		visibility.destroy();
	});
</script>

<div class="p-6 bg-gray-100 min-h-screen">
	<div class="max-w-2xl mx-auto space-y-6">
		<!-- Header -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h1 class="text-2xl font-bold text-gray-800 mb-2">setShowComponent Test</h1>
			<p class="text-gray-600">
				Test untuk memverifikasi bahwa fungsi <code class="bg-gray-200 px-2 py-1 rounded">setShowComponent</code> bekerja dengan benar.
			</p>
		</div>

		<!-- Controls -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Controls</h2>
			
			<div class="flex flex-wrap gap-3">
				<button 
					on:click={() => setShowComponent(null)}
					class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
				>
					Normal Mode (null)
				</button>
				<button 
					on:click={() => setShowComponent(true)}
					class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
				>
					Force Show (true)
				</button>
				<button 
					on:click={() => setShowComponent(false)}
					class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
				>
					Force Hide (false)
				</button>
			</div>
		</div>

		<!-- Status Display -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Status</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-gray-50 p-4 rounded-lg">
					<div class="text-sm font-medium text-gray-600 mb-1">isVisible</div>
					<div class="text-lg font-bold {$isVisible ? 'text-green-600' : 'text-red-600'}">
						{$isVisible}
					</div>
				</div>
				
				<div class="bg-gray-50 p-4 rounded-lg">
					<div class="text-sm font-medium text-gray-600 mb-1">showComponent</div>
					<div class="text-lg font-bold {$showComponent === null ? 'text-gray-600' : $showComponent ? 'text-green-600' : 'text-red-600'}">
						{$showComponent === null ? 'null' : $showComponent}
					</div>
				</div>
				
				<div class="bg-gray-50 p-4 rounded-lg">
					<div class="text-sm font-medium text-gray-600 mb-1">finalVisible</div>
					<div class="text-lg font-bold {$finalVisible ? 'text-green-600' : 'text-red-600'}">
						{$finalVisible}
					</div>
				</div>
			</div>
		</div>

		<!-- Test Component -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Test Component</h2>
			
			<div class="relative min-h-32 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
				{#if $finalVisible}
					<div 
						bind:this={testElement}
						class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
					>
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
							<h3 class="text-xl font-bold">Component Visible!</h3>
						</div>
						<p class="mt-2 text-green-100">
							Komponen ini ditampilkan berdasarkan nilai <code class="bg-white/20 px-2 py-1 rounded">finalVisible</code>.
						</p>
						<div class="mt-4 text-sm text-green-200">
							<div>isVisible: <span class="font-mono">{$isVisible}</span></div>
							<div>showComponent: <span class="font-mono">{$showComponent}</span></div>
							<div>finalVisible: <span class="font-mono">{$finalVisible}</span></div>
						</div>
					</div>
				{:else}
					<div 
						bind:this={testElement}
						class="flex items-center justify-center h-24 text-gray-500"
					>
						<div class="text-center">
							<div class="text-4xl mb-2">👻</div>
							<div class="text-lg font-medium">Component Hidden</div>
							<div class="text-sm">finalVisible: {$finalVisible}</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Instructions -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 class="text-xl font-semibold text-blue-800 mb-4">Cara Test</h2>
			
			<div class="space-y-3 text-blue-700">
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>Normal Mode:</strong> Komponen akan muncul/hilang berdasarkan kedekatan mouse dengan area tengah
					</div>
				</div>
				
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>Force Show:</strong> Komponen akan selalu ditampilkan, mengabaikan posisi mouse
					</div>
				</div>
				
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>Force Hide:</strong> Komponen akan selalu disembunyikan, mengabaikan posisi mouse
					</div>
				</div>
			</div>
		</div>
	</div>
</div>