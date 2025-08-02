<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';

	// Props
	export let currentSectionIndex: number = 0;
	export let isActive: boolean = false;
	export let title: string | null = null;
	export let colorScheme: 'white' | 'primary' | 'auto' = 'auto';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let showTooltip: boolean = true;

	// Size configurations
	const sizeClasses = {
		sm: 'w-1.5 h-1.5',
		md: 'w-2.5 h-2.5',
		lg: 'w-4 h-4'
	};

	$: dotColorClasses = (() => {
		if (colorScheme === 'white') {
			return isActive ? 'bg-white' : 'bg-white/30';
		} else if (colorScheme === 'primary') {
			return isActive ? 'bg-primary-700' : 'bg-primary-700/30';
		} else {
			// Auto mode - based on current section index
			if ([0, 2, 5, 6].includes(currentSectionIndex)) {
				return isActive ? 'bg-white' : 'bg-white/30';
			}

			return isActive ? 'bg-primary-950' : 'bg-primary-950/30';
		}
	})();
</script>

<div
	class={`
    hover:scale-180
    rounded-full
    transition-all
    duration-300
    hover:bg-white
    ${sizeClasses[size]}
    ${dotColorClasses}
  `}
></div>

{#if showTooltip}
	<Tooltip placement="left">
		{title}
	</Tooltip>
{/if}
