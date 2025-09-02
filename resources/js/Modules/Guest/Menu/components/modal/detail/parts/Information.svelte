<script lang="ts">
	export let category: string | undefined;
	export let ingredients: string[] | undefined;
    export let allergens: string[] | undefined;
</script>

<div class="grid grid-cols-2 gap-3">
	<div class="rounded-xl border border-gray-700/40 bg-gray-800/60 p-4 backdrop-blur-sm">
		<h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-amber-400">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
				/>
			</svg>
			Ingredients
		</h3>
		<p class="text-sm leading-relaxed text-gray-300">
			{#if ingredients && ingredients.length > 0}
				{ingredients.join(', ')}
			{:else}
				Premium quality ingredients carefully selected by our chefs.
			{/if}
		</p>
	</div>

	<div class="rounded-xl border border-gray-700/40 bg-gray-800/60 p-4 backdrop-blur-sm">
		<h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-amber-400">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
				/>
			</svg>
			Category
		</h3>
		<p class="text-sm text-gray-300">
			{category || 'Signature Dish'}
		</p>
	</div>

	<div class="col-span-2 rounded-xl border border-gray-700/40 bg-gray-800/60 p-4 backdrop-blur-sm">
		<h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-amber-400">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			Allergens
		</h3>
		<p class="text-sm text-gray-300">
			{#if allergens && allergens.length > 0}
				{allergens.join(', ')}
			{:else}
				Please inform staff of any allergies.
			{/if}
		</p>
	</div>
</div>
