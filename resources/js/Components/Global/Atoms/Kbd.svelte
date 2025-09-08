<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let variant: 'default' | 'dark' | 'light' = 'default';

	const getSizeClasses = () => {
		switch (size) {
			case 'sm':
				return 'px-2 py-1 text-xs';
			case 'lg':
				return 'px-3 py-2 text-base';
			default:
				return 'px-2.5 py-1.5 text-sm';
		}
	};

	const getVariantClasses = () => {
		switch (variant) {
			case 'dark':
				return 'bg-gray-800 text-white border-gray-600';
			case 'light':
				return 'bg-white text-gray-900 border-gray-300';
			default:
				return 'bg-gray-100 text-gray-900 border-gray-300';
		}
	};
</script>

<kbd
	class="inline-flex items-center justify-center font-mono font-medium rounded border {getSizeClasses()} {getVariantClasses()}"
>
	<slot />
</kbd>