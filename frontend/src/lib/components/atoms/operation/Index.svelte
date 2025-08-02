<script lang="ts">
	export let title: string = '';
	export let subtitle: string = '';
</script>

<div class="font-cursive flex flex-col gap-2 text-center">
	<h1 class="text-primary mb-2 text-2xl md:text-2xl">{title}</h1>
	<h6 class="text-primary text-sm md:text-sm">{subtitle}</h6>
</div>

<style>
	.font-cursive {
		font-family: 'Pacifico', cursive;
	}
</style>
