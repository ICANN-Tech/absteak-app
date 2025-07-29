<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createStateVisibility } from '$lib/stores/viewport/visibility.js';

	// Create state visibility dengan hideComponent support
	const visibility = createStateVisibility('hide-component-demo', {
		initialVisible: false,
		hideDelay: 2000
	});

	const { isVisible, finalVisible, show, hide, toggle, setHideComponent, hideComponent } = visibility;

	// Demo state untuk kontrol
	let hideComponentValue: boolean | null = null;

	// Update hideComponent ketika nilai berubah
	$: setHideComponent(hideComponentValue);

	onDestroy(() => {
		visibility.destroy();
	});

	function handleHideComponentChange(value: boolean | null) {
		hideComponentValue = value;
	}
</script>

<div class="p-6 bg-gray-100 min-h-screen">
	<div class="max-w-4xl mx-auto space-y-6">
		<!-- Header -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h1 class="text-2xl font-bold text-gray-800 mb-2">Hide Component Demo</h1>
			<p class="text-gray-600">
				Demonstrasi fitur <code class="bg-gray-200 px-2 py-1 rounded">hideComponent</code> yang memungkinkan 
				menyembunyikan komponen secara paksa meskipun <code class="bg-gray-200 px-2 py-1 rounded">isVisible</code> bernilai true.
			</p>
		</div>

		<!-- Controls -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Kontrol Visibility</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Basic Visibility Controls -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-gray-700">Basic Visibility</h3>
					<div class="flex flex-wrap gap-2">
						<button 
							on:click={show}
							class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
						>
							Show
						</button>
						<button 
							on:click={hide}
							class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
						>
							Hide
						</button>
						<button 
							on:click={toggle}
							class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
						>
							Toggle
						</button>
					</div>
				</div>

				<!-- Hide Component Controls -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-gray-700">Hide Component Override</h3>
					<div class="flex flex-wrap gap-2">
						<button 
							on:click={() => handleHideComponentChange(null)}
							class="px-4 py-2 {hideComponentValue === null ? 'bg-gray-700' : 'bg-gray-500'} text-white rounded hover:bg-gray-600 transition-colors"
						>
							Normal (null)
						</button>
						<button 
							on:click={() => handleHideComponentChange(false)}
							class="px-4 py-2 {hideComponentValue === false ? 'bg-green-700' : 'bg-green-500'} text-white rounded hover:bg-green-600 transition-colors"
						>
							Force Show (false)
						</button>
						<button 
							on:click={() => handleHideComponentChange(true)}
							class="px-4 py-2 {hideComponentValue === true ? 'bg-red-700' : 'bg-red-500'} text-white rounded hover:bg-red-600 transition-colors"
						>
							Force Hide (true)
						</button>
					</div>
				</div>
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
					<div class="text-sm font-medium text-gray-600 mb-1">hideComponent</div>
					<div class="text-lg font-bold {$hideComponent === null ? 'text-gray-600' : $hideComponent ? 'text-red-600' : 'text-green-600'}">
						{$hideComponent === null ? 'null' : $hideComponent}
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

		<!-- Demo Component -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Demo Component</h2>
			
			<div class="relative min-h-32 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
				{#if $finalVisible}
					<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
							<h3 class="text-xl font-bold">Component Visible!</h3>
						</div>
						<p class="mt-2 text-blue-100">
							Komponen ini ditampilkan berdasarkan nilai <code class="bg-white/20 px-2 py-1 rounded">finalVisible</code>.
						</p>
						<div class="mt-4 text-sm text-blue-200">
							<div>isVisible: <span class="font-mono">{$isVisible}</span></div>
							<div>hideComponent: <span class="font-mono">{$hideComponent}</span></div>
							<div>finalVisible: <span class="font-mono">{$finalVisible}</span></div>
						</div>
					</div>
				{:else}
					<div class="flex items-center justify-center h-24 text-gray-500">
						<div class="text-center">
							<div class="text-4xl mb-2">👻</div>
							<div class="text-lg font-medium">Component Hidden</div>
							<div class="text-sm">finalVisible: {$finalVisible}</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Explanation -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 class="text-xl font-semibold text-blue-800 mb-4">Cara Kerja hideComponent</h2>
			
			<div class="space-y-3 text-blue-700">
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>hideComponent = null (default):</strong> Menggunakan logika visibility normal berdasarkan <code>isVisible</code>
					</div>
				</div>
				
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>hideComponent = false:</strong> Memaksa komponen untuk ditampilkan, mengabaikan nilai <code>isVisible</code>
					</div>
				</div>
				
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>hideComponent = true:</strong> Memaksa komponen untuk disembunyikan, mengabaikan nilai <code>isVisible</code>
					</div>
				</div>
			</div>

			<div class="mt-4 p-4 bg-blue-100 rounded-lg">
				<div class="text-sm font-medium text-blue-800 mb-2">Formula finalVisible:</div>
				<code class="text-blue-900 text-sm">
					finalVisible = hideComponent === true ? false : hideComponent === false ? true : isVisible
				</code>
			</div>
		</div>
	</div>
</div>