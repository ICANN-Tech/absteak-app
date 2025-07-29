<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility.js';

	// Create area-based visibility untuk bottom navigation
	const bottomNavVisibility = createAreaBasedStateVisibility('bottom-navigation', {
		targetArea: 'bottom',
		proximityRadius: 120,
		areaOffset: 80,
		initialVisible: false,
		hideDelay: 1500
	});

	// Create area-based visibility untuk side panel
	const sidePanelVisibility = createAreaBasedStateVisibility('side-panel', {
		targetArea: 'right',
		proximityRadius: 100,
		areaOffset: 50,
		initialVisible: false,
		hideDelay: 2000
	});

	const { 
		isVisible: isBottomNavVisible, 
		finalVisible: bottomNavFinalVisible,
		show: showBottomNav, 
		hide: hideBottomNav,
		setHideComponent: setBottomNavHideComponent,
		updatePosition: updateBottomNavPosition 
	} = bottomNavVisibility;

	const { 
		isVisible: isSidePanelVisible, 
		finalVisible: sidePanelFinalVisible,
		show: showSidePanel, 
		hide: hideSidePanel,
		setHideComponent: setSidePanelHideComponent,
		updatePosition: updateSidePanelPosition 
	} = sidePanelVisibility;

	let bottomNavElement: HTMLElement;
	let sidePanelElement: HTMLElement;

	// Update positions when elements change
	$: if (bottomNavElement) {
		bottomNavVisibility.updatePosition(bottomNavElement);
	}

	$: if (sidePanelElement) {
		sidePanelVisibility.updatePosition(sidePanelElement);
	}

	onDestroy(() => {
		bottomNavVisibility.destroy();
		sidePanelVisibility.destroy();
	});
</script>

<!-- Bottom Navigation -->
{#if $bottomNavFinalVisible}
	<nav 
		bind:this={bottomNavElement}
		class="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 transform"
	>
		<div class="bg-gray-900/90 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-xl border border-white/10">
			<div class="flex items-center space-x-6">
				<button class="text-white hover:text-blue-400 transition-colors">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
					</svg>
				</button>
				<button class="text-white hover:text-blue-400 transition-colors">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
					</svg>
				</button>
				<button class="text-white hover:text-blue-400 transition-colors">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
					</svg>
				</button>
			</div>
		</div>
	</nav>
{/if}

<!-- Side Panel -->
{#if $sidePanelFinalVisible}
	<aside 
		bind:this={sidePanelElement}
		class="fixed right-4 top-1/2 z-30 -translate-y-1/2 transform"
	>
		<div class="bg-gray-900/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/10">
			<div class="flex flex-col space-y-4">
				<button class="text-white hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-white/10">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
					</svg>
				</button>
				<button class="text-white hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-white/10">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
					</svg>
				</button>
				<button class="text-white hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-white/10">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
					</svg>
				</button>
			</div>
		</div>
	</aside>
{/if}

<!-- Demo Controls -->
<div class="fixed top-20 left-4 z-40 bg-black/80 backdrop-blur-lg rounded-lg p-4 text-white">
	<h3 class="text-sm font-semibold mb-3">Area-Based Visibility Demo</h3>
	<div class="space-y-2 text-xs">
		<div class="flex items-center space-x-2">
			<div class="w-2 h-2 rounded-full bg-blue-500"></div>
			<span>Arahkan mouse ke bagian atas untuk navigation</span>
		</div>
		<div class="flex items-center space-x-2">
			<div class="w-2 h-2 rounded-full bg-green-500"></div>
			<span>Arahkan mouse ke bagian bawah untuk bottom nav</span>
		</div>
		<div class="flex items-center space-x-2">
			<div class="w-2 h-2 rounded-full bg-purple-500"></div>
			<span>Arahkan mouse ke bagian kanan untuk side panel</span>
		</div>
	</div>
	<div class="mt-3 pt-3 border-t border-white/20">
		<div class="text-xs space-y-1">
			<div>Proximity Radius: 100-150px</div>
			<div>Hide Delay: 1.5-2s</div>
		</div>
	</div>
	
	<!-- Controls -->
	<div class="mt-4 pt-3 border-t border-white/20">
		<h4 class="text-xs font-semibold mb-2">Manual Controls</h4>
		
		<div class="space-y-3">
			<!-- Bottom Navigation Controls -->
			<div class="space-y-2">
				<div class="text-xs text-gray-300">Bottom Navigation</div>
				<div class="flex gap-1">
					<button 
						on:click={showBottomNav}
						class="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
					>
						Show
					</button>
					<button 
						on:click={hideBottomNav}
						class="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
					>
						Hide
					</button>
				</div>
				<div class="flex gap-1">
					<button 
						on:click={() => setBottomNavHideComponent(null)}
						class="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
					>
						Normal
					</button>
					<button 
						on:click={() => setBottomNavHideComponent(false)}
						class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
					>
						Force Show
					</button>
					<button 
						on:click={() => setBottomNavHideComponent(true)}
						class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
					>
						Force Hide
					</button>
				</div>
			</div>

			<!-- Side Panel Controls -->
			<div class="space-y-2">
				<div class="text-xs text-gray-300">Side Panel</div>
				<div class="flex gap-1">
					<button 
						on:click={showSidePanel}
						class="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
					>
						Show
					</button>
					<button 
						on:click={hideSidePanel}
						class="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
					>
						Hide
					</button>
				</div>
				<div class="flex gap-1">
					<button 
						on:click={() => setSidePanelHideComponent(null)}
						class="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
					>
						Normal
					</button>
					<button 
						on:click={() => setSidePanelHideComponent(false)}
						class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
					>
						Force Show
					</button>
					<button 
						on:click={() => setSidePanelHideComponent(true)}
						class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
					>
						Force Hide
					</button>
				</div>
			</div>
		</div>
	</div>
</div>