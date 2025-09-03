<script lang="ts">
	export let section: any;
	export let isActive: boolean;
	export let slideOffset: string;
</script>

<div
	id={section.id}
	class="section-container {isActive ? 'active' : ''}"
	style="
		opacity: {isActive ? '1' : '0'};
		transform: translateY({slideOffset});
		transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
	"
>
	{#if section.component}
		<svelte:component this={section.component} />
	{/if}
</div>

<style>
.section-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 1;
	overflow-y: auto;
	will-change: transform, opacity;
}
.section-container.active {
	z-index: 2;
}
</style>
