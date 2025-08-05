<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
    border?: boolean;
		class?: string;
		children?: Snippet;
		left?: Snippet;
		right?: Snippet;
	}

	let {
		title,
		subtitle = '',
    border = true,
		class: className = '',
		children,
		left,
		right
	}: Props = $props();
</script>

<div class="relative mb-8 flex items-center p-4 text-white {className} {border ? 'border-b border-gray-700' : ''}">
	<!-- Left slot for back button or other actions -->
	<div class="z-10">
		<slot name="left" />
	</div>

	<!-- Center content -->
	<div class="absolute inset-x-0 flex flex-col items-center justify-center pointer-events-none {border ? 'mb-8' : ''}">
		<h3 class="text-sm font-semibold text-white leading-tight">{title}</h3>
		{#if subtitle}
			<p class="text-xs text-gray-400 mt-0.5">{subtitle}</p>
		{/if}
	</div>

	<!-- Right slot for additional actions -->
	<div class="z-10 ml-auto">
		<slot name="right" />
	</div>
</div>