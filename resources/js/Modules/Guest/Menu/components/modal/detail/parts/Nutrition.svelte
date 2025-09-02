
<script lang="ts">
    export let calories: number | undefined;
    export let protein: string | undefined;
    export let carbs: string | undefined;
    export let fat: string | undefined;
</script>

<div class="rounded-xl border border-gray-700/40 bg-gray-800/60 p-5 backdrop-blur-sm">
						<h3 class="mb-3 flex items-center gap-2 text-lg font-semibold text-amber-400">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							Nutrition Information
						</h3>
						<div class="grid grid-cols-2 gap-3 text-sm text-gray-300">
							<div class="rounded-lg bg-gray-700/50 p-3 text-center">
								<div class="font-semibold text-amber-400">{calories}</div>
								<div class="text-xs">Calories</div>
							</div>
							<div class="rounded-lg bg-gray-700/50 p-3 text-center">
								<div class="font-semibold text-amber-400">{protein}</div>
								<div class="text-xs">Protein</div>
							</div>
							<div class="rounded-lg bg-gray-700/50 p-3 text-center">
								<div class="font-semibold text-amber-400">{carbs}</div>
								<div class="text-xs">Carbs</div>
							</div>
							<div class="rounded-lg bg-gray-700/50 p-3 text-center">
								<div class="font-semibold text-amber-400">{fat}</div>
								<div class="text-xs">Fat</div>
							</div>
						</div>
					</div>