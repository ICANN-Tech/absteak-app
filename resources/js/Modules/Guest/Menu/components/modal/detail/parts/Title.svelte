<script lang="ts">
    export let name: string;
    export let price: string;
    export let desc: string;
</script>

<div class="space-y-2 text-center">
	<h2 class="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
		{name}
	</h2>
	<div class="text-3xl font-bold text-amber-400 drop-shadow-lg">
		{price}
	</div>
	<p class="text-base leading-relaxed text-gray-200 drop-shadow-sm">
		{desc}
	</p>
</div>
