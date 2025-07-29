<script lang="ts">
	import { onDestroy } from 'svelte';
	import { 
		createAreaBasedStateVisibility, 
		lockVisibility, 
		unlockVisibility, 
		isVisibilityLocked,
		getVisibilityLockedValue
	} from '$lib/stores/viewport/visibility.js';

	// Create two components: heading and scroll
	const headingVisibility = createAreaBasedStateVisibility('heading', {
		targetArea: 'top',
		proximityRadius: 100,
		areaOffset: 50,
		initialVisible: false,
		hideDelay: 1000
	});

	const scrollVisibility = createAreaBasedStateVisibility('scroll', {
		targetArea: 'bottom',
		proximityRadius: 100,
		areaOffset: 50,
		initialVisible: false,
		hideDelay: 1000
	});

	const { 
		isVisible: headingIsVisible, 
		showComponent: headingShowComponent, 
		setShowComponent: setHeadingShowComponent,
		updatePosition: updateHeadingPosition 
	} = headingVisibility;

	const { 
		isVisible: scrollIsVisible, 
		showComponent: scrollShowComponent, 
		setShowComponent: setScrollShowComponent,
		updatePosition: updateScrollPosition 
	} = scrollVisibility;

	let headingElement: HTMLElement;
	let scrollElement: HTMLElement;
	let scrollId = 1;

	// Update positions when elements are available
	$: if (headingElement) {
		updateHeadingPosition(headingElement);
	}
	$: if (scrollElement) {
		updateScrollPosition(scrollElement);
	}

	// Simulate scroll condition: when scrollId == 3, lock heading to false
	$: if (scrollId === 3) {
		lockVisibility('heading', false);
	} else {
		unlockVisibility('heading');
	}

	// Set initial showComponent values
	setHeadingShowComponent(true);
	setScrollShowComponent(null);

	onDestroy(() => {
		headingVisibility.destroy();
		scrollVisibility.destroy();
	});
</script>

<div class="p-6 bg-gray-100 min-h-screen">
	<div class="max-w-4xl mx-auto space-y-6">
		<!-- Header -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h1 class="text-3xl font-bold text-gray-800 mb-2">Lock/Unlock Visibility Demo</h1>
			<p class="text-gray-600">
				Demo untuk menguji fitur lock dan unlock visibility. Heading di-set <code class="bg-gray-200 px-2 py-1 rounded">showComponent = true</code>, 
				tapi ketika scroll ID = 3, heading akan di-lock ke <code class="bg-gray-200 px-2 py-1 rounded">false</code>.
			</p>
		</div>

		<!-- Controls -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Controls</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Scroll ID Control -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Scroll ID</label>
					<div class="flex gap-2">
						{#each [1, 2, 3, 4, 5] as id}
							<button 
								on:click={() => scrollId = id}
								class="px-3 py-2 rounded {scrollId === id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition-colors"
							>
								{id}
							</button>
						{/each}
					</div>
					<p class="text-xs text-gray-500 mt-1">Ketika ID = 3, heading akan di-lock ke false</p>
				</div>

				<!-- Manual Controls -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Manual Controls</label>
					<div class="flex flex-wrap gap-2">
						<button 
							on:click={() => setHeadingShowComponent(true)}
							class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
						>
							Set Heading True
						</button>
						<button 
							on:click={() => setHeadingShowComponent(false)}
							class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
						>
							Set Heading False
						</button>
						<button 
							on:click={() => lockVisibility('heading', true)}
							class="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
						>
							Lock Heading True
						</button>
						<button 
							on:click={() => unlockVisibility('heading')}
							class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
						>
							Unlock Heading
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Status Display -->
		<div class="bg-white rounded-lg p-6 shadow-lg">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Status</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Heading Status -->
				<div class="bg-blue-50 p-4 rounded-lg">
					<h3 class="font-semibold text-blue-800 mb-3">Heading Component</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600">isVisible:</span>
							<span class="font-mono {$headingIsVisible ? 'text-green-600' : 'text-red-600'}">
								{$headingIsVisible}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">showComponent:</span>
							<span class="font-mono {$headingShowComponent === null ? 'text-gray-600' : $headingShowComponent ? 'text-green-600' : 'text-red-600'}">
								{$headingShowComponent === null ? 'null' : $headingShowComponent}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">isLocked:</span>
							<span class="font-mono {isVisibilityLocked('heading') ? 'text-orange-600' : 'text-gray-600'}">
								{isVisibilityLocked('heading')}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">lockedValue:</span>
							<span class="font-mono text-gray-600">
								{getVisibilityLockedValue('heading') === null ? 'null' : getVisibilityLockedValue('heading')}
							</span>
						</div>
					</div>
				</div>

				<!-- Scroll Status -->
				<div class="bg-green-50 p-4 rounded-lg">
					<h3 class="font-semibold text-green-800 mb-3">Scroll Component</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600">scrollId:</span>
							<span class="font-mono text-blue-600">{scrollId}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">isVisible:</span>
							<span class="font-mono {$scrollIsVisible ? 'text-green-600' : 'text-red-600'}">
								{$scrollIsVisible}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">showComponent:</span>
							<span class="font-mono {$scrollShowComponent === null ? 'text-gray-600' : $scrollShowComponent ? 'text-green-600' : 'text-red-600'}">
								{$scrollShowComponent === null ? 'null' : $scrollShowComponent}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">condition:</span>
							<span class="font-mono {scrollId === 3 ? 'text-red-600' : 'text-green-600'}">
								{scrollId === 3 ? 'LOCK heading' : 'normal'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Test Components -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Heading Component -->
			<div class="bg-white rounded-lg p-6 shadow-lg">
				<h2 class="text-xl font-semibold text-gray-800 mb-4">Heading Component</h2>
				<div class="relative min-h-32 bg-blue-50 rounded-lg p-4 border-2 border-dashed border-blue-300">
					{#if $headingShowComponent !== false && $headingIsVisible}
						<div 
							bind:this={headingElement}
							class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg"
						>
							<div class="flex items-center space-x-2">
								<div class="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
								<h3 class="text-lg font-bold">Heading Visible!</h3>
							</div>
							<p class="mt-2 text-blue-100 text-sm">
								showComponent: {$headingShowComponent === null ? 'null' : $headingShowComponent}
							</p>
							<p class="text-blue-100 text-sm">
								locked: {isVisibilityLocked('heading') ? 'YES' : 'NO'}
							</p>
						</div>
					{:else}
						<div 
							bind:this={headingElement}
							class="flex items-center justify-center h-24 text-gray-500"
						>
							<div class="text-center">
								<div class="text-3xl mb-2">📰</div>
								<div class="text-sm font-medium">Heading Hidden</div>
								<div class="text-xs">
									{isVisibilityLocked('heading') ? 'LOCKED' : 'normal'}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Scroll Component -->
			<div class="bg-white rounded-lg p-6 shadow-lg">
				<h2 class="text-xl font-semibold text-gray-800 mb-4">Scroll Component</h2>
				<div class="relative min-h-32 bg-green-50 rounded-lg p-4 border-2 border-dashed border-green-300">
					{#if $scrollShowComponent !== false && $scrollIsVisible}
						<div 
							bind:this={scrollElement}
							class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-lg shadow-lg"
						>
							<div class="flex items-center space-x-2">
								<div class="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
								<h3 class="text-lg font-bold">Scroll Visible!</h3>
							</div>
							<p class="mt-2 text-green-100 text-sm">
								scrollId: {scrollId}
							</p>
							<p class="text-green-100 text-sm">
								{scrollId === 3 ? 'Locking heading...' : 'Normal mode'}
							</p>
						</div>
					{:else}
						<div 
							bind:this={scrollElement}
							class="flex items-center justify-center h-24 text-gray-500"
						>
							<div class="text-center">
								<div class="text-3xl mb-2">📜</div>
								<div class="text-sm font-medium">Scroll Hidden</div>
								<div class="text-xs">ID: {scrollId}</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Instructions -->
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
			<h2 class="text-xl font-semibold text-yellow-800 mb-4">Cara Test</h2>
			
			<div class="space-y-3 text-yellow-700">
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>Normal Mode:</strong> Heading di-set showComponent = true, jadi akan selalu muncul
					</div>
				</div>
				
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>Lock Mode (scrollId = 3):</strong> Heading akan di-lock ke false, walaupun showComponent = true
					</div>
				</div>
				
				<div class="flex items-start space-x-2">
					<div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
					<div>
						<strong>Manual Test:</strong> Gunakan tombol manual untuk test lock/unlock secara langsung
					</div>
				</div>
			</div>
		</div>
	</div>
</div>