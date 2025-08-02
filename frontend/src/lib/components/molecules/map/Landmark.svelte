<script lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';

	export let restaurantName: string;
	export let className: string = '';
	export let gradientBackground: string = 'bg-gradient-to-br from-gray-700 to-gray-800';

	$: combinedClasses = `${gradientBackground} ${className}`;
</script>

<div class={`relative flex h-72 items-center justify-center ${combinedClasses}`}>
	<div class={`${CONTAINER_SECTION.footer.map.content.interactive.pattern.background}`}>
		<svg class="h-full w-full" viewBox="0 0 400 320" fill="none">
			<defs>
				<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
					<path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)" />

			<path d="M0 100 L400 120" stroke="currentColor" stroke-width="2" opacity="0.6" />
			<path d="M0 200 L400 180" stroke="currentColor" stroke-width="2" opacity="0.6" />
			<path d="M100 0 L120 320" stroke="currentColor" stroke-width="2" opacity="0.6" />
			<path d="M300 0 L280 320" stroke="currentColor" stroke-width="2" opacity="0.6" />
		</svg>
	</div>

	<div class={`${CONTAINER_SECTION.footer.map.content.interactive.pattern.marker}`}>
		<div
			class="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg"
		>
			<svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<div class="mt-2 rounded-lg bg-black/80 px-3 py-1">
			<p class="text-sm font-semibold text-white">{restaurantName}</p>
		</div>
	</div>

	<!-- Nearby landmarks -->
	<div class="absolute left-4 top-4 h-3 w-3 rounded-full bg-blue-400 opacity-60"></div>
	<div class="absolute right-8 top-12 h-3 w-3 rounded-full bg-green-400 opacity-60"></div>
	<div class="absolute bottom-8 left-12 h-3 w-3 rounded-full bg-purple-400 opacity-60"></div>
	<div class="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-red-400 opacity-60"></div>
</div>
